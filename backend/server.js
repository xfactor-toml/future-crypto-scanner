const controller = require('./controller/controller');

exports = module.exports = server = (io) => {
    io.on('connection', (socket) => {
        console.log(`--- A socket ${socket.id} connected! ---`);
        
        const getData = (data) => {
            socket.emit('send_token', data);
        }
        controller.getTickerPriceForSocket(getData);
        setInterval(() => {
            controller.getTickerPriceForSocket(getData);
        }, 30000);
        socket.on('send_data', (data) => {
            socket.emit('receive_data', data);
        });
        socket.on('disconnect', () => {
            console.log('disconnected');
        });
    });
}