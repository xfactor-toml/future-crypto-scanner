const axios = require('axios');
exports.getRealTimeData =async (getData) => {

  //----------first request for total ticker that is between 0.01 and 2 and more than 1 million. this is called once-------------------//
  var realTimeData = [];
  const tickerPriceList = await axios.get('https://fapi.binance.com/fapi/v2/ticker/price')
  const tokensBetween = tickerPriceList.data.filter(item => Number(item.price) >= 0.01 && Number(item.price) <= 2);// tokens between 0.01~2

  await Promise.all(tokensBetween.map(async (item) => {
    const _1dKline = await axios.get(`https://fapi.binance.com/fapi/v1/klines?symbol=${item.symbol}&interval=1d&limit=1`, {//kline per ticker
          'Content-Type': 'application/json'
        });
    if (Number(_1dKline.data[0][7]) >= 1000000)
    realTimeData.push({
      'symbol': item.symbol,
      'price' : Number(item?.price).toFixed(4),
      'volume': Number(_1dKline?.data[0][7]).toFixed(4),
    });
  })).then(() => {
    realTimeData.sort((a, b) => {
      return a.symbol.charCodeAt(0) - b.symbol.charCodeAt(0);
    })
    getData({
            'realTimeData' : realTimeData,
            'status' : 'ok',
          });
  }).catch((error) => {
    console.log('first request error! so realTimeData is empty');
    getData({
      'realTimeData' : [],
      'status' : error,
    });
  })
  //--------------receive all changed ticker per 1 second and replace it to origin realTimeData.
  const WebSocket = require('ws');
  const websocketThread = () => {
    var socket = new WebSocket('wss://fstream.binance.com/stream?streams=!ticker@arr'); // all changed tickers
    socket.onopen = () => {
      console.log('binance websocket connect');
    }
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const miniTickers = data.data;
  
      Promise.all(miniTickers.map(item => {
        if(Number(item.c) > 0.01 && Number(item.c) < 2 && Number(item.q) > 1000000) {      //  if 0.01 ~ 2
        if(realTimeData.find((t) => t.symbol === item.s))   // if already exists, replace it.
            realTimeData.splice(
            realTimeData.findIndex((t) => t.symbol === item.s) 
            , 1, 
            {
              'symbol': item.s,
              'price' : Number(item.c).toFixed(4),
              'volume': Number(item.q).toFixed(4),
            });
        else //--------------------------------------------------------------------------- if not exists, push.            
            realTimeData.push(
              {
                'symbol': item.s,
                'price' : Number(item.c).toFixed(4),
                'volume': Number(item.q).toFixed(4),
              }
            )}
        else {
          if(realTimeData.find((t) => t.symbol === item.s))
          realTimeData.splice(
            realTimeData.findIndex((t) => t.symbol === item.s) , 1);
        } //------------------------------------------------------------------------------- if < 0.01 or > 2, delete item.
      }))
      .then(() => {
          getData({
            'realTimeData' : realTimeData,
            'status' : 'ok',
          });
      })
      .catch(error => {
        console.log('websocket connection error!, so realTimeDada is not changed');
          getData({
            'realTimeData' : [],
            'status' : error,
          });
      });
    }
    socket.onerror = error => {
      console.log('binance websocket error occured, so reconnect');
      socket = null;
      setTimeout(websocketThread, 1000);
    }
    socket.onclose = () => {
      console.log('binance websocket closed, so reconnect');
      socket = null;
      setTimeout(websocketThread, 1000);
    }
  }
  websocketThread();
}
