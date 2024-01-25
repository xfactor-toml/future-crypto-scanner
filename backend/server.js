// const controller = require('./controller/controller');
const controller = require('./controller/controller_continue');
const websocekt = require('./ws');

let token1min;
let realTimeTokens;
const getData = (data) => {
    // console.log(data);
    token1min = data;
}

const getRealData = (data) => {
    // console.log(data.realTimeData.length);
    realTimeTokens = data;
}

websocekt.getRealTimeData(getRealData);

controller.getTickerPriceForSocket(getData);
setInterval(() => {
    controller.getTickerPriceForSocket(getData);
}, 60000);


exports = module.exports = server = (io) => {
    io.on('connection', (socket) => {
        console.log(`--- A socket ${socket.id} connected! ---`);
        
        socket.emit('token1min', token1min);
        setInterval(() => {
            socket.emit('token1min', token1min);
        }, 15000);

        setInterval(() => {
            socket.emit('realTimeData', realTimeTokens);
        }, 1000);

        socket.on('disconnect', () => {
            console.log('disconnected');
        });
    });
}