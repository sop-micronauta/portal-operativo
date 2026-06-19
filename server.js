const http = require("http");
const fs = require("fs");
const path = require("path");

const HOST = process.env.HOST || "127.0.0.1";
const PORT = Number(process.env.PORT || 8080);
const ROOT = __dirname;

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon"
};

function send(response, statusCode, body, contentType) {
  response.writeHead(statusCode, {
    "Content-Type": contentType,
    "Cache-Control": "no-store"
  });
  response.end(body);
}

function resolvePath(urlPath) {
  const sanitized = decodeURIComponent(urlPath.split("?")[0]);
  const requested = sanitized === "/" ? "/index.html" : sanitized;
  const absolutePath = path.normalize(path.join(ROOT, requested));

  if (!absolutePath.startsWith(ROOT)) {
    return null;
  }

  return absolutePath;
}

const server = http.createServer((request, response) => {
  const filePath = resolvePath(request.url || "/");
  if (!filePath) {
    send(response, 403, "Forbidden", "text/plain; charset=utf-8");
    return;
  }

  fs.stat(filePath, (statError, stats) => {
    if (statError || !stats.isFile()) {
      send(response, 404, "Not found", "text/plain; charset=utf-8");
      return;
    }

    const extension = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[extension] || "application/octet-stream";

    fs.readFile(filePath, (readError, content) => {
      if (readError) {
        send(response, 500, "Internal server error", "text/plain; charset=utf-8");
        return;
      }

      send(response, 200, content, contentType);
    });
  });
});

server.listen(PORT, HOST, () => {
  console.log(`Micronauta Ops Center disponible en http://${HOST}:${PORT}`);
});
