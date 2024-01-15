// app.listen(PORT_ClIENT, () => {
//     console.log(`Server listening on ${PORT_ClIENT}`);}
// );

// const WebSocket = require('ws');///////////////////////////////////////////////////////////////////////////////////

// const soc = new WebSocket('wss://fstream.binance.com/ws/btcusdt@kline_1m');

// soc.onopen = () => {
//   console.log('Connected to Binance WebSocket');
// };

// soc.onmessage = (event) => {
//   const klineData = JSON.parse(event.data);
//   console.log(klineData);
//   // Now you can perform your desired operations with the kline data
// };

// soc.onclose = () => {
//   console.log('Disconnected from Binance WebSocket');
// };

// const WebSocket = require('ws');

// const soc = new WebSocket('wss://fstream.binance.com/ws/!ticker@arr');

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