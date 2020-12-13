let http = require('http')
let https = require('https')
let fs = require('fs')
let unzipper = require('unzipper')
let querystring = require('querystring');

function auth(request, response) {
    let query = querystring.parse(request.url.match(/^\/auth\?([\s\S]+)$/)[1]);
    getToken(query.code, function (info) {
        response.write(`<a href="http://localhost:8083/?token=${info.access_token}">publish</a>`);
        response.end();
    });

}

function getToken(code, callback) {
    let request = https.request({
        hostname: 'github.com',
        path: `/login/oauth/access_token?code=${code}&client_id=Iv1.38820eca71b52415&client_secret=7ded01adf2e4a9e61bafba960bbdd4813ca1f0b0`,
        port: 443,
        method: 'post',
    }, function (response) {
        let body = '';
        response.on('data', chunk => {
            body += (chunk.toString());
        });

        response.on('end', () => {
            callback(querystring.parse(body));
        });
    });
    request.end();
}

function publish(request, response) {
    // 登录一次
    let query = querystring.parse(request.url.match(/^\/publish\?([\s\S]+)$/)[1]);
    if (query.token) {
        getUser(query.token, function (userInfo) {
            if (userInfo.login === 'alvin') {
                request.pipe(unzipper.Extract({
                    path: '../server/public/'
                }));
                request.on('end', function () {
                    response.end('Success!');
                })
            }
        });
    }
}

function getUser(token, callback) {
    let request = https.request({
        hostname: 'api.github.com',
        path: `/user`,
        port: 443,
        method: 'get',
        headers: {
            'Authorization': `token ${token}`,
            'User-Agent': 'toy-publish'
        }
    }, function (response) {
        let body = '';
        response.on('data', chunk => {
            body += (chunk.toString());
        });

        response.on('end', () => {
            callback(JSON.parse(body));
        });
    });
    request.end();
}

http.createServer(function (request, response) {

    if (request.url.match(/^\/auth\?/)) {
        return auth(request, response);
    }

    if (request.url.match(/^\/publish\?/)) {
        return publish(request, response);
    }

    // let outFile = fs.createWriteStream("./tmp.zip")
    // request.pipe(outFile)

    request.pipe(unzipper.Extract({
        path: './public/'
    }))

}).listen(8082)