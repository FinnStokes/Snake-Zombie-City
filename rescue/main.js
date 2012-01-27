var socket = io.connect('/:49990');

jQuery(document).ready(function () {
    socket.emit('getcity');
    socket.on('city', function (newCity) {
        console.log(newCity);
    })
});
