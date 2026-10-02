# Google Apps Script launcher + Ultraviolet server

This package is the official Ultraviolet-App Node server with two small changes:

- The `uv.bundle.js` browser bundle is loaded from jsDelivr.
- The proxy app accepts an HTTP(S) destination in the `?url=` query parameter, so a Google Apps Script launcher can open a submitted URL automatically.

Google Apps Script serves the Study page only. The Node server in this package must run on a separate HTTPS host that supports WebSocket upgrades.

## Deploy the server

1. Upload this repository to a Node host that supports WebSockets.
2. Use Node.js 24 or newer.
3. Install dependencies with `pnpm install --frozen-lockfile`.
4. Start the app with `pnpm start`. The app listens on the host-provided `PORT` (or port 8080 locally).
5. Enable HTTPS and WebSocket forwarding. The host must pass WebSocket upgrade requests for `/wisp/` to this Node process.
6. Open the host's HTTPS URL and test the Ultraviolet page.

Do not deploy this as static files only. The Node process serves `/uv/`, `/baremux/`, `/epoxy/`, and the `/wisp/` WebSocket endpoint.

## Connect the Google Apps Script page

1. In Apps Script, create `Code.gs` and an HTML file named `index`.
2. Put the supplied `Code.gs` handler in `Code.gs`.
3. Put the supplied `study-proxy-google-script.html` page into `index.html`.
4. In that HTML, replace `https://YOUR-DEPLOYED-ULTRAVIOLET-APP` with the server's HTTPS URL.
5. Deploy the Apps Script as a web app.

The launcher passes the submitted search or URL to the Ultraviolet server as a `url` query parameter. The patched `public/index.js` validates it and starts the normal Ultraviolet client flow.

## CDN note

`public/index.html` loads `uv.bundle.js` from jsDelivr. Keep `uv.config.js` and the service-worker route on the Ultraviolet server. The service worker must be served from the origin that it controls, and jsDelivr cannot run the `/wisp/` WebSocket server.

## Security note

The upstream app does not add user authentication by default. Do not expose an unrestricted public proxy; add access controls and usage limits on the server before sharing it publicly.

## Upstream and license

This package is based on `titaniumnetwork-dev/Ultraviolet-App`. Keep the included upstream `LICENSE` when redistributing it. Upstream currently notes that Ultraviolet is superseded by Scramjet.