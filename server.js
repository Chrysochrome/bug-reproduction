const http = require('http');
const fs = require('fs');
const path = require('path');

// Helper function: parse multipart form data
function parseMultipartFormData(req, callback) {
  let data = Buffer.alloc(0);

  req.on('data', chunk => {
    data = Buffer.concat([data, chunk]);
  });

  req.on('end', () => {
    const contentType = req.headers['content-type'];
    const boundary = '--' + contentType.split('boundary=')[1];
    const parts = data.toString().split(boundary)
      .filter(p => p.includes('Content-Disposition'))
      .map(p => p.trim());

    parts.forEach(part => {
      const [headers, body] = part.split('\r\n\r\n');
      if (headers.includes('filename=')) {
        const match = headers.match(/filename="(.+?)"/);
        const filename = match && match[1];
        const fileContent = body.slice(0, -2); // remove trailing \r\n
        console.log(`Received file: ${filename}`);
        console.log('File content preview:');
        console.log(fileContent);
      }
    });

    callback();
  });
}

const server = http.createServer((req, res) => {
  if (req.method === 'GET') {
    // Serve index.html
    if (req.url === '/' || req.url === '/index.html') {
      const filePath = path.join(__dirname, 'index.html');
      fs.readFile(filePath, (err, data) => {
        if (err) {
          res.writeHead(500);
          res.end('Error loading file');
        } else {
          res.writeHead(200, { 'Content-Type': 'text/html' });
          res.end(data);
        }
      });
    } else {
      res.writeHead(404);
      res.end('Not Found');
    }
  } else if (req.method === 'POST' && req.url === '/upload') {
    parseMultipartFormData(req, () => {
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end('File uploaded and printed to console');
    });
  } else {
    res.writeHead(404);
    res.end('Not Found');
  }
});

const port = 3265;
server.listen(port, () => {
  console.log(`🚀 Server started at: http://localhost:${port}`);
});
