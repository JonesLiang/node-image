const http = require('http');

const PORT = 8431;

const server = http.createServer((req, res) => {
    // 1. 健康检查接口 (给腾讯云看的)
    if (req.url === '/health' && req.method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        return res.end('OK');
    }

    // 2. 业务执行接口 (给你的 Agent 调用的)
    if (req.url === '/execute' && req.method === 'POST') {
        let body = '';

        // 接收 Agent 传过来的参数
        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', () => {
            try {
                // 打印接收到的参数（会被记录在腾讯云的日志里）
                console.log('收到执行请求，参数:', body);

                // 这里写你的真实业务逻辑，比如：
                // const params = JSON.parse(body);
                // const result = doSomething(params);

                // 模拟业务执行耗时 1 秒
                setTimeout(() => {
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({
                        status: 'success',
                        message: 'Node 脚本执行成功！',
                        receivedData: body || '无参数'
                    }));
                }, 1000);

            } catch (error) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ status: 'error', message: error.message }));
            }
        });
        return;
    }

    // 3. 其他请求返回 404
    res.writeHead(404);
    res.end('Not Found');
});

// 关键：必须监听 0.0.0.0，不能用 localhost，否则云平台访问不到
server.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ Node.js Sandbox Service is running on port ${PORT}`);
});