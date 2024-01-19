const axios = require('axios');
exports.getRealTimeData =async (getData) => {

  //----------first request for total ticker that is between 0.01 and 2 and more than 1 million. this is call once-------------------//
  var realTimeData = [];
  const tickerPriceList = await axios.get('https://fapi.binance.com/fapi/v2/ticker/price')
  const tokensBetween = tickerPriceList.data.filter(item => Number(item.price) >= 0.01 && Number(item.price) <= 2);// tokens between 0.01~2

  await Promise.all(tokensBetween.map(async (item) => {
    const _1dKline = await axios.get(`https://fapi.binance.com/fapi/v1/klines?symbol=${item.symbol}&interval=1d&limit=1`, {//kline per ticker
          'Content-Type': 'application/json'
        });
    if (Number(_1dKline.data[0][7]) >= 1000000)
    // {
    //   realTimeData[item.symbol.toLowerCase().slice(0, -4)] = {
    //     'price' : Number(item?.price).toFixed(4),
    //     'volume': Number(_1dKline?.data[0][7]).toFixed(4)
    //   }
    // }
    realTimeData.push({
      'symbol': item.symbol.toLowerCase().slice(0, -4),
      'price' : Number(item?.price).toFixed(4),
      'volume': Number(_1dKline?.data[0][7]).toFixed(4),
    });
  })).then(() => {
    getData({
            'realTimeData' : realTimeData,
            'status' : 'ok',
          });
  }).catch((error) => {
    getData({
      'realTimeData' : [],
      'status' : error,
    });
  })
  //--------------receive all changed ticker per 1 second and replace it to origin realTimeData.
  const WebSocket = require('ws');
  const socket = new WebSocket('wss://fstream.binance.com/stream?streams=!ticker@arr'); // all changed tickers
  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    const miniTickers = data.data;
    // console.log('count', miniTickers.length);

    // realTimeData = realTimeData.filter((i) => {

    // })

    Promise.all(miniTickers.map(item => {
      if(Number(item.c) > 0.01 && Number(item.c) < 2 && Number(item.q) > 1000000) {      //  if 0.01 ~ 2
      if(realTimeData.find((t) => t.symbol === item.s.toLowerCase().slice(0, -4)))   // if already exists, replace it.
          realTimeData.splice(
          realTimeData.findIndex((t) => t.symbol === item.s.toLowerCase().slice(0, -4)) 
          , 1, 
          {
            'symbol': item.s.toLowerCase().slice(0, -4),
            'price' : Number(item.c).toFixed(4),
            'volume': Number(item.q).toFixed(4),
          });
      else                                                                              // if not exists, push.            
          realTimeData.push(
            {
              'symbol': item.s.toLowerCase().slice(0, -4),
              'price' : Number(item.c).toFixed(4),
              'volume': Number(item.q).toFixed(4),
            }
          )}
      else {
        if(realTimeData.find((t) => t.symbol === item.s.toLowerCase().slice(0, -4)))
        realTimeData.splice(
          realTimeData.findIndex((t) => t.symbol === item.s.toLowerCase().slice(0, -4)) , 1);
      }                                                                              // if < 0.01 or > 2, delete item.
    }))
    .then(() => {
        getData({
          'realTimeData' : realTimeData,
          'status' : 'ok',
        });
    })
    .catch(error => {
        getData({
          'realTimeData' : [],
          'status' : error,
        });
    });
  }
}

//const klineStream = `${symbol.toLowerCase()}@kline_3m`;

//const klineSocket = new WebSocket(`wss://fstream.binance.com/stream?streams=${klineStream}`);

// const WebSocket = require('ws');///////////////////////////////////////////////////////////////////////////////////

// const soc = new WebSocket('wss://fstream.binance.com/ws/btcusdt@kline_1m');

// soc.onopen = () => {
//   console.log('Connected to Binance WebSocket1');
// };
// soc.onmessage = (event) => {
//   const klineData = JSON.parse(event.data);
//   console.log(klineData);
// };
// soc.onclose = () => {
//   console.log('Disconnected from Binance WebSocket1');
// };

// const soc = new WebSocket('wss://fstream.binance.com/ws/!ticker@arr');
// const soc = new WebSocket('wss://fstream.binance.com/stream?streams=!ticker@arr');
