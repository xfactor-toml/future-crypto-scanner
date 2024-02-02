// const controller = require('./controller/controller');
// const controller = require('./controller/controller_continue');
const websocekt = require('./ws');
const websocektKline = require('./websocket_klines');

let token1min = {};
let realTimeTokens = {}; 
const getData = (data) => {
    // console.log('===========================================');
    // console.log('===========================================');
    // console.log('longtokens', data.longTokens);
    // console.log('shorttokens', data.shortTokens);
    // console.log('history', data.history);
    token1min = data;
}

const getRealData = (data) => {
    realTimeTokens = data;
}

websocekt.getRealTimeData(getRealData);
websocektKline.getRealTimeData(getData);

// controller.getTickerPriceForSocket(getData);
// setInterval(() => {
//     controller.getTickerPriceForSocket(getData);
// }, 10000);


exports = module.exports = server = (io) => {
    io.on('connection', (socket) => {
        console.log(`--- A socket ${socket.id} connected! ---`);
        
        socket.emit('token1min', token1min);
        setInterval(() => {
            socket.emit('token1min', token1min);
        }, 5000);

        setInterval(() => {
            socket.emit('realTimeData', realTimeTokens);
        }, 1000);

        socket.on('disconnect', () => {
            console.log('disconnected');
        });
    });
}