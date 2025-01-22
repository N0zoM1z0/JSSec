const http = require('http');
const url = require('url'); // 引入 url 模块

const server = http.createServer((req, res) => {
    // 使用 url 模块解析请求路径
    const parsedUrl = url.parse(req.url, true);
    const callback = parsedUrl.query.callback; // 获取回调函数名

    const data = {
        message: "Hello, JSONP!",
        status: "success"
    };

    if (callback) {
        res.writeHead(200, { 'Content-Type': 'application/javascript' });
        res.end(`${callback}(${JSON.stringify(data)})`);
    } else {
        res.writeHead(400, { 'Content-Type': 'text/plain' });
        res.end("Missing callback parameter.");
    }
});

server.listen(3000, () => {
    console.log('JSONP server running on http://127.0.0.1:3000/');
});
