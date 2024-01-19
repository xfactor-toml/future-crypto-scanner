exports.getRealTimeData = (getData) => {
  const WebSocket = require('ws');
  const socket = new WebSocket('wss://fstream.binance.com/stream?streams=!ticker@arr');
      var realTimeData = [];
      socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        const miniTickers = data.data;

        Promise.all(miniTickers.map(item => {
          if(Number(item.c) > 0.01 && Number(item.c) < 2 && Number(item.q) > 1000000)
          realTimeData.push({
            'symbol': item.s.toLowerCase().slice(0, -4),
            'price' : item.c.toFixed(4),
            'volume': item.q.toFixed(4),
          });
        })).then(() => {
          getData({
            'realTimeData' : realTimeData,
            'status' : 'ok',
          });
          realTimeData = [];
        })
        .catch(error => {
          getData({
            'realTimeData' : [],
            'status' : error,
          });
          realTimeData = [];
        });
  }
}
      // for (const miniTicker of tokenMoreThan1m) {
      //   const symbol = miniTicker.symbol;
      //   // const averagePrice = miniTicker.w;
      //   const klineStream = `${symbol.toLowerCase()}@kline_3m`;

        // const klineSocket = new WebSocket(`wss://fstream.binance.com/stream?streams=${klineStream}`);
        // klineSocket.onmessage = (klineEvent) => {
        //   const klineData = JSON.parse(klineEvent.data);
        //   const kline = klineData.data.k;
        //   console.log(klineData.length);
        //   const openTime = kline.t;
        //   const closeTime = kline.T;
        //   const openPrice = kline.o;
        //   const closePrice = kline.c;
        // //   const lowPrice = kline.l;
        //   const volume = kline.v;

        //   console.log(`Kline Data for ${symbol}`);
        // //   console.log('Open Time:', openTime);
        // //   console.log('Close Time:', closeTime);
        //   console.log('Open Price:', openPrice);
        //   console.log('Close Price:', closePrice);
        //   console.log('average Price:', averagePrice);
        // //   console.log('High Price:', highPrice);
        // //   console.log('Low Price:', lowPrice);
        //   console.log('Volume:', volume);
      //   };
      // }
//  const func = async () => {
//         const tickerPriceList = await axios.get('https://fapi.binance.com/fapi/v2/ticker/price', {//entire ticker price about - 250 +
//         'Content-Type': 'application/json'
//         });

//         const tokensBetween = tickerPriceList.data.filter(item => Number(item.price) >= 0.01 && Number(item.price) <= 2);// tokens between 0.01~2
//         const tokensSocket = [];
//         tokensBetween.map(token => {
//                 tokensSocket.push(token.symbol);
//         })
//         await Promise.all(tokensBetween.map( async (t, key) => {
//                 tokensSocket[key] = new WebSocket(`wss://fstream.binance.com/ws/${t.symbol}@kline_1d`);

//                 tokensSocket[key].onopen = () => {
//                   console.log(`connected to ${t.symbol}`);
//                 };
//                 tokensSocket[key].onmessage = (event) => {
//                 //   const klineData = JSON.parse(event.data);
//                   console.log(event);
//                 };
//                 // tokensSocket[key].onclose = () => {
//                 //   console.log(`disconnected to ${t.symbol}`);
//                 // };
//                 // console.log(tokensSocket[key]);
//         }));
//         // tokensBetween.map((token, key) => {
//         //         console.log(typeof(tokensSocket[key]));
//         // })
       
        
// };

// func();
// const WebSocket = require('ws');///////////////////////////////////////////////////////////////////////////////////

// const soc = new WebSocket('wss://fstream.binance.com/ws/btcusdt@kline_1m');
// const soc2 = new WebSocket('wss://fstream.binance.com/ws/btcusdt@kline_1h');
// const soc3 = new WebSocket('wss://fstream.binance.com/ws/btcusdt@kline_1d');

// soc.onopen = () => {
//   console.log('Connected to Binance WebSocket1');
// };
// soc.onmessage = (event) => {
//   const klineData = JSON.parse(event.data);
//   console.log(klineData);
//   // Now you can perform your desired operations with the kline data
// };
// soc.onclose = () => {
//   console.log('Disconnected from Binance WebSocket1');
// };


// soc2.onopen = () => {
//   console.log('Connected to Binance WebSocket2');
// };
// soc2.onmessage = (event) => {
//   const klineData = JSON.parse(event.data);
//   console.log(klineData);
//   // Now you can perform your desired operations with the kline data
// };
// soc2.onclose = () => {
//   console.log('Disconnected from Binance WebSocket2');
// };


// soc3.onopen = () => {
//   console.log('Connected to Binance WebSocket3');
// };
// soc3.onmessage = (event) => {
//   const klineData = JSON.parse(event.data);
//   console.log(klineData);
//   // Now you can perform your desired operations with the kline data
// };
// soc3.onclose = () => {
//   console.log('Disconnected from Binance WebSocket3');
// };

// const WebSocket = require('ws');

// // const soc = new WebSocket('wss://fstream.binance.com/ws/!ticker@arr');
// const soc = new WebSocket('wss://fstream.binance.com/stream?streams=!ticker@arr');
// soc.onopen = () => {
//   console.log('Connected to Binance Futures WebSocket');
// };

// soc.onmessage = (event) => {
//   const tickerData = JSON.parse(event.data);
//   console.log(tickerData);
//   // Now you can perform your desired operations with the ticker data
// };

// soc.onclose = () => {
//   console.log('Disconnected from Binance Futures WebSocket');
// };