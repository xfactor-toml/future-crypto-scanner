const controller = require('./controller/controller');
const websocekt = require('./ws');

let token3min;
let realTimeTokens;
const getData = (data) => {
    console.log(data);
    token3min = data;
}

const getRealData = (data) => {
    console.log(data.realTimeData.length);
    realTimeTokens = data;
}

websocekt.getRealTimeData(getRealData);

controller.getTickerPriceForSocket(getData);
setInterval(() => {
    controller.getTickerPriceForSocket(getData);
}, 15000);


exports = module.exports = server = (io) => {
    io.on('connection', (socket) => {
        console.log(`--- A socket ${socket.id} connected! ---`);
        
        socket.emit('token3min', token3min);
        setInterval(() => {
            socket.emit('token3min', token3min);
        }, 5000);

        setInterval(() => {
            socket.emit('realTimeData', realTimeTokens);
        }, 1000);

        socket.on('send_data', (data) => {
            socket.emit('receive_data', data);
        });
        socket.on('disconnect', () => {
            console.log('disconnected');
        });
    });
}