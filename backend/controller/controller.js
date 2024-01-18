const axios = require('axios');

const putToken = (item, _3mKline, _1hKline, _1dKline) => {
  let token = {};
  token.symbol = item?.symbol.toLowerCase().slice(0, -4);
  token.price = Number(item?.price).toFixed(3);
  token.volume = Number(_1dKline?.data[0][7]).toFixed(3);
  token._3minchange = ((Number(_3mKline?.data[0][4]) - Number(_3mKline?.data[0][1])) * 100 / Number(_3mKline?.data[0][1])).toFixed(3);
  token._1hHige = Number(_1hKline?.data[0][2]).toFixed(3);
  token._1hLow = Number(_1hKline?.data[0][3]).toFixed(3);

  return token;
}

exports.getTickerPrice = async (req, res) => {//API for axios request from client.
  
}

exports.getTickerPriceForSocket = async (data) => {//Socket API
  try {
    const tickerPriceList = await axios.get('https://fapi.binance.com/fapi/v2/ticker/price', {//entire ticker price about - 250 +
      'Content-Type': 'application/json'
    });
    
    const tokensBetween = tickerPriceList.data.filter(item => Number(item.price) >= 0.01 && Number(item.price) <= 2);// tokens between 0.01~2
    let longTokens = [];
    let shortTokens = [];
    let hotTokens = [];
    await Promise.all(
      tokensBetween.map(async (item) => {
        const _3mKline = await axios.get(`https://fapi.binance.com/fapi/v1/klines?symbol=${item.symbol}&interval=3m&limit=1`, {//kline per ticker
          'Content-Type': 'application/json'
        });

        const _1dKline = await axios.get(`https://fapi.binance.com/fapi/v1/klines?symbol=${item.symbol}&interval=1d&limit=1`, {//kline per ticker
          'Content-Type': 'application/json'
        });

        if (Number(_1dKline.data[0][7]) >= 1000000) {//over 1 million USDT
          hotTokens.push({
            "symbol" : item?.symbol.toLowerCase().slice(0, -4),
            "price" : Number(item?.price).toFixed(3),
            "volume" : Number(_1dKline?.data[0][7]).toFixed(3),
          })
          if(  Math.abs((Number(_3mKline.data[0][4]) - Number(_3mKline.data[0][1])) * 100 / Number(_3mKline.data[0][1])) >= 2 ) {//price increase or decrease rate is bigger than 0.1 or less than 0.1.

            const _1hKline = await axios.get(`https://fapi.binance.com/fapi/v1/klines?symbol=${item.symbol}&interval=1h&limit=1`, {// High and Low price during 1 hour
              'Content-Type': 'application/json'
            });
            if( Number(_3mKline.data[0][4]) > Number(_3mKline.data[0][1]) )
              longTokens.push(putToken(item, _3mKline, _1hKline, _1dKline));
            else
              shortTokens.push(putToken(item, _3mKline, _1hKline, _1dKline));
          }
        }
      })
    ).then(() => {
      data({longTokens, shortTokens, hotTokens});
    })
    .catch(error => console.log(error));
  } catch (error) {
    data({ error: `error: ${error}`});
  }
}