const controller = require('./controller/controller');

let result;
const getData = (data) => {
    console.log(data);
    result = data;
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

        socket.on('send_data', (data) => {
            socket.emit('receive_data', data);
        });
        socket.on('disconnect', () => {
            console.log('disconnected');
        });
    });
}