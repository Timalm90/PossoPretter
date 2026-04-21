const http = require("http");
const https = require("https");

http.createServer((req, res) => {
  const target = decodeURIComponent(req.url.slice(1)); // strip leading /
  if (!target.startsWith("https://image.tmdb.org/")) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }

  https.get(target, (proxyRes) => {
    res.writeHead(200, {
      "Content-Type": proxyRes.headers["content-type"] || "image/jpeg",
      "Access-Control-Allow-Origin": "*",
    });
    proxyRes.pipe(res);
  }).on("error", (e) => {
    res.writeHead(500);
    res.end(e.message);
  });
}).listen(5501, () => console.log("Proxy running on http://localhost:5501"));