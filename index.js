import { createBareServer } from '@tomphttp/bare-server-node';
import http from 'node:http';

const bare = createBareServer('/bare/');
const server = http.createServer();

server.on('request', (req, res) => {
  if (bare.shouldRoute(req)) {
    bare.routeRequest(req, res);
  } else {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Bare Transport Server Online');
  }
});

server.on('upgrade', (req, socket, head) => {
  if (bare.shouldRoute(req)) {
    bare.routeUpgrade(req, socket, head);
  } else {
    socket.end();
  }
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`Bare server listening on port ${PORT}`);
});
