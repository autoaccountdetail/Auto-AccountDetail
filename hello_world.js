//http 프로토콜
var http = require('http');
var fs = require('fs'); // File System의 약어
var url = require('url');

var server = http.createServer(function (req, res) {
    console.log("Create Server");
    var pathName = url.parse(req.url).pathname;
    console.log(pathName);

    if(pathName == '/'){
        fs.readFile('helloworld.html', function (err, data) {
            res.writeHead(200, {'Content-Type': 'text.html'});
            res.end(data)
        })
    } else {
        res.writeHead(200, {'Content-Type': 'text.html'});
        res.end('<h1>Page Not Fountd! </h1>');
    }
});

server.listen(3000,function () {
    console.log("Server Reunning");
});