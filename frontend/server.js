const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');

const port = parseInt(process.env.PORT || '3000', 10);
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev, dir: __dirname });
const handle = app.getRequestHandler();

app.prepare()
  .then(() => {
    const server = createServer((req, res) => {
      try {
        const parsedUrl = parse(req.url, true);
        handle(req, res, parsedUrl);
      } catch (err) {
        console.error('Request error:', err);
        res.statusCode = 500;
        res.end('Internal Server Error');
      }
    });

    server.keepAliveTimeout = 65000;
    server.headersTimeout = 66000;

    server.listen(port, (err) => {
      if (err) throw err;
      console.log(`> Next.js ready on port ${port} [${process.env.NODE_ENV}]`);
    });

    // Prevent crash on unhandled errors
    process.on('uncaughtException', (err) => {
      console.error('Uncaught Exception:', err);
    });

    process.on('unhandledRejection', (reason) => {
      console.error('Unhandled Rejection:', reason);
    });
  })
  .catch((err) => {
    console.error('Failed to start server:', err);
    process.exit(1);
  });
