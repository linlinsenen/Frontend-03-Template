let http = require("http")
let fs = require('fs')
let archiver = require('archiver')
let child_process = require('child_process');
let querystring = require('querystring');

child_process.exec(`start chrome https://github.com/login/oauth/authorize`);

http.createServer(function (request, response) {
    let query = querystring.parse(request.url.match(/^\/\?([\s\S]+)$/)[1]);
    publish(query.token);
}).listen(8083);

function publish(token) {
    let request = http.request({
        hostname: '127.0.0.1',
        port: 8082,
        method: 'post',
        path: `/publish?token=${token}`,
        headers: {
            'Content-Type': 'application/octet-stream',
            // 'Content-Length': stats.size,
        }
    }, response => {
        console.log(response);
    });

    const archive = archiver('zip', {
        zlib: {
            level: 9
        }
    });

    archive.directory('./sample/', false)

    archive.finalize()

    archive.pipe(request)
}