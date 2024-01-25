const axios = require('axios');

const putToken = (item, change, kline1h, kline1d) => {
  let token = {};
  token.symbol = item?.symbol;                          //              symbol
  token.price = Number(item?.price).toFixed(4);         //              price
  token.volume = Number(kline1d?.data[0][7]).toFixed(4);//              a day volume
  token.change = change;                                //              continuous change
  token.high = Number(kline1h?.data[0][2]).toFixed(4);  //              a hour high value
  token.low = Number(kline1h?.data[0][3]).toFixed(4);   //              a hour low value 

  return token;
}

const changePercent = (a, b) => {
  return Number(( ( b - a ) * 100 / a ).toFixed(4));    //              continuos change percentage
}

const test = async (item, a, b, change) => {
  if( Math.abs(change) > 2 ) {
    // if( Number(item.price) >= 0.01 && Number(item.price) <= 2 ){
      const kline1d = await axios.get(`https://fapi.binance.com/fapi/v1/klines?symbol=${item?.symbol}&interval=1d&limit=1`)      //    a day kline
      if( Number(kline1d?.data[0][7]) >= 1000000 ){
        const kline1h = await axios.get(`https://fapi.binance.com/fapi/v1/klines?symbol=${item?.symbol}&interval=1h&limit=1`);   //    a hour kline
        if( b > a )
          longTokens.push(putToken(item, change, kline1h, kline1d));
        else
          shortTokens.push(putToken(item, change, kline1h, kline1d));
      }
    // }
  }
}

let tokenHistory = [];
let longTokens = [];
let shortTokens = [];

exports.getTickerPriceForSocket = async (data) => {//Socket API.
  try {
    const tickerPriceList = await axios.get('https://fapi.binance.com/fapi/v2/ticker/price', {//entire ticker price about - 250 +.
      'Content-Type': 'application/json'
    });
    
    const tokens = tickerPriceList.data.filter(item => Number(item?.price) >= 0.01 && Number(item?.price) <= 2);// tokens between 0.01~2.
    await Promise.all(
      tokens.map( async (item) => {
        const kline1min = await axios.get(`https://fapi.binance.com/fapi/v1/klines?symbol=${item?.symbol}&interval=1m&limit=1`, {
          'Content-Type': 'application/json'
        });//1 minute kline per token.

        const openPrice = Number(kline1min?.data[0][1]);//
        const closePrice = Number(kline1min?.data[0][4]);
        const changeState = closePrice > openPrice ? 'increase': (closePrice === openPrice ? 'constant': 'decrease');
        const change = changePercent(openPrice, closePrice);

        if( !tokenHistory.find( t => t?.symbol === item?.symbol) ) {
          tokenHistory.push({
            symbol: item?.symbol,
            state: changeState,
            openValue: openPrice,
            change: change,
          })
          test(item, openPrice, closePrice, change);
        }

        else {
          const index = tokenHistory.findIndex( t => t?.symbol === item?.symbol);
          if( changeState !== 'constant' ){
            if( tokenHistory[index].state === 'constant' ){
              tokenHistory[index].state = changeState;
              tokenHistory[index].change = change;
              test(item, tokenHistory[index].openValue, closePrice, tokenHistory[index].change);
            }
            else {
              if( tokenHistory[index].state === changeState){
                tokenHistory[index].change = changePercent( tokenHistory[index].openValue , closePrice);
                test( item, tokenHistory[index].openValue, closePrice, tokenHistory[index].change );
              }
              else {
                tokenHistory[index].state = changeState;
                tokenHistory[index].openValue = openPrice;
                tokenHistory[index].change = change;
                test( item, tokenHistory[index].openValue, closePrice, tokenHistory[index].change );
              }
            }
          }
        }
      })
    ).then(() => {

      // tokenHistory.sort((a, b) => {
      //   return a.symbol.charCodeAt(0) - b.symbol.charCodeAt(0);
      // })
      // console.log(tokenHistory);

      data({
        'longTokens' : longTokens,
        'shortTokens' : shortTokens,
        'status' : 'ok',
      });
      longTokens = [];
      shortTokens = [];
    })
    .catch(error => {
      data({
        'longTokens' : [],
        'shortTokens' : [],
        'status' : error,
      });
      longTokens = [];
      shortTokens = [];
    });
  } catch (error) {
    data({
      'longTokens' : [],
      'shortTokens' : [],
      'status' : error,
    });
  }
}
