const websocekt = require('./ws');
const websocektKline = require('./websocket_klines');

let token1min = {};
let realTimeTokens = {}; 
const getData = (data) => {
    token1min = data;
}

const getRealData = (data) => {
    realTimeTokens = data;
}

websocekt.getRealTimeData(getRealData);
websocektKline.getRealTimeData(getData);

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