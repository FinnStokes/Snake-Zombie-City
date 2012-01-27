var socket = io.connect('/rescue');

jQuery(document).ready(function () {
    socket.emit('getcity');
    socket.on('city', function (newCity) {
        console.log(newCity);
    })
});
