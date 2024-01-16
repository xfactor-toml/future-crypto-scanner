const controller = require('./controller/controller');

let result;
const getData = (data) => {
    result = data;
    console.log(result);
}

controller.getTickerPriceForSocket(getData);
setInterval(() => {
    controller.getTickerPriceForSocket(getData);
}, 30000);

exports = module.exports = server = (io) => {
    io.on('connection', (socket) => {
        console.log(`--- A socket ${socket.id} connected! ---`);
        
        socket.emit('send_token', result);
        setInterval(() => {
            socket.emit('send_token', result);
        }, 5000);
        socket.on('disconnect', () => {
            console.log('disconnected');
        });
    });
}