const axios = require('axios');

let tokenHistory = [];
let longTokens = [];
let shortTokens = [];

const putToken = (item, a, b, change, kline1h, kline1d, openT, closeT) => {
  let token = {};
  token.symbol = item?.symbol;                          //              symbol
  // token.price = Number(item?.price).toFixed(4);         //              price
  token.volume = Number(kline1d?.data[0][7]).toFixed(4);//              a day volume

  token.change = change;                                //              continuous change

  token.high = Number(kline1h?.data[0][2]).toFixed(4);  //              a hour high value
  token.low = Number(kline1h?.data[0][3]).toFixed(4);   //              a hour low value 

  token.openTime = openT;                                //              open time
  token.openValue = a;

  token.closeTime = closeT;                                //              close time
  token.closeValue = b;

  return token;
}

const changePercent = (a, b) => {
  return Number(( ( b - a ) * 100 / a ).toFixed(4));    //              continuos change percentage
}

const putLongToken = (to) => {
      if( !longTokens.find( t => t?.symbol === to?.symbol) ){
        longTokens.push(to);
      }
      else {
        if(longTokens[longTokens.findIndex( t => t?.symbol === to?.symbol)].openTime == to.openTime)
          longTokens.splice(longTokens.findIndex( t => t?.symbol === to?.symbol), 1, to);
        else
          longTokens.push(to);
      }
}

const putShortToken = (to) => {
  if( !shortTokens.find( t => t?.symbol === to?.symbol) ){
    shortTokens.push(to);
  }
  else {
    if(shortTokens[shortTokens.findIndex( t => t?.symbol === to?.symbol)].openTime == to.openTime)
      shortTokens.splice(shortTokens.findIndex( t => t?.symbol === to?.symbol), 1, to);
    else
      shortTokens.push(to);
  }
}

const test = async (item, a, b, change, openT, closeT) => {
  if( Math.abs(change) > 1 ) {
    // if( Number(item.price) >= 0.01 && Number(item.price) <= 2 ){
      const kline1d = await axios.get(`https://fapi.binance.com/fapi/v1/klines?symbol=${item?.symbol}&interval=1d&limit=1`)      //    a day kline
      if( Number(kline1d?.data[0][7]) >= 1000000 ){
        const kline1h = await axios.get(`https://fapi.binance.com/fapi/v1/klines?symbol=${item?.symbol}&interval=1h&limit=1`);   //    a hour kline
        if( b > a )
          putLongToken(putToken(item, a, b, change, kline1h, kline1d, openT, closeT));
        else
          putShortToken(putToken(item, a, b, change, kline1h, kline1d, openT, closeT));
      }
    // }
  }
}

exports.getTickerPriceForSocket = async (data) => {//Socket API.
  try {
    const tickerPriceList = await axios.get('https://fapi.binance.com/fapi/v2/ticker/price', {//entire ticker price about - 250 +.
      'Content-Type': 'application/json'
    });
    // console.log((new Date(tickerPriceList.data[0].time)).toString());
    // const tokens = tickerPriceList.data.filter(item => Number(item?.price) >= 0.01 && Number(item?.price) <= 2);// tokens between 0.01~2.
    const tokens = tickerPriceList.data.filter(item => item?.symbol === 'GALUSDT');// tokens between 0.01~2.
    await Promise.all(
      tokens.map( async (item) => {
        const kline1min = await axios.get(`https://fapi.binance.com/fapi/v1/klines?symbol=${item?.symbol}&interval=1m&limit=1`, {
          'Content-Type': 'application/json'
        });//1 minute kline per token.

        const oTime = (new Date( Number(kline1min?.data[0][0]) )).toString().slice(4,21);
        const cTime = (new Date( Number(kline1min?.data[0][6]) + 1000 )).toString().slice(4,21);
        const openPrice = Number(kline1min?.data[0][1]);
        const closePrice = Number(kline1min?.data[0][4]);
        const changeState = closePrice > openPrice ? 'increase': (closePrice === openPrice ? 'constant': 'decrease');
        const change = changePercent(openPrice, closePrice);

        if( !tokenHistory.find( t => t?.symbol === item?.symbol) ) {
          tokenHistory.push({
            symbol: item?.symbol,
            state: changeState,
            openValue: openPrice,
            closeValue: closePrice,
            openTime: oTime,
            closeTime: cTime,
            change: change,
          })
          test(item, openPrice, closePrice, change, oTime, cTime);
        }

        else {
          const index = tokenHistory.findIndex( t => t?.symbol === item?.symbol);
          if( changeState !== 'constant' ){
            if( tokenHistory[index].state === 'constant' ){
              tokenHistory[index].state = changeState;
              tokenHistory[index].change = change;
              tokenHistory[index].closeTime = cTime;
              tokenHistory[index].closeValue = closePrice;
              test(item, tokenHistory[index].openValue, tokenHistory[index].closeValue, tokenHistory[index].change, tokenHistory[index].openTime, tokenHistory[index].closeTime);
            }
            else {
              if( tokenHistory[index].state === changeState){
                tokenHistory[index].change = changePercent( tokenHistory[index].openValue , closePrice);
                tokenHistory[index].closeTime = cTime;
                tokenHistory[index].closeValue = closePrice;
                test(item, tokenHistory[index].openValue, tokenHistory[index].closeValue, tokenHistory[index].change, tokenHistory[index].openTime, tokenHistory[index].closeTime);
              }
              else {
                tokenHistory[index].state = changeState;
                tokenHistory[index].openValue = openPrice;
                tokenHistory[index].closeValue = closePrice;
                tokenHistory[index].openTime = oTime;
                tokenHistory[index].closeTime = cTime;
                tokenHistory[index].change = change;
                test(item, tokenHistory[index].openValue, tokenHistory[index].closeValue, tokenHistory[index].change, tokenHistory[index].openTime, tokenHistory[index].closeTime);
              }
            }
          }
          else {
            tokenHistory[index].closeTime = cTime;
            test(item, tokenHistory[index].openValue, tokenHistory[index].closeValue, tokenHistory[index].change, tokenHistory[index].openTime, tokenHistory[index].closeTime);
          }
        }
      })
    ).then(() => {
      tokenHistory.sort((a, b) => {
        return a.symbol.charCodeAt(0) - b.symbol.charCodeAt(0);
      })
      console.log(tokenHistory);
      longTokens.sort((a, b) => {
        return a.symbol.charCodeAt(0) - b.symbol.charCodeAt(0);
      })
      shortTokens.sort((a, b) => {
        return a.symbol.charCodeAt(0) - b.symbol.charCodeAt(0);
      })
      data({
        'longTokens' : longTokens,
        'shortTokens' : shortTokens,
        'status' : 'ok',
      });
    })
    .catch(error => {
      data({
        'longTokens' : [],
        'shortTokens' : [],
        'status' : error,
      });
    });
  } catch (error) {
    data({
      'longTokens' : [],
      'shortTokens' : [],
      'status' : error,
    });
  }
}
