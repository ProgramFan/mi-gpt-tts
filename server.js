import http from "http";
import apiSpeakers from "./api/speakers.js";
import apiTTS from "./api/tts.mp3.js";
import { createReadStream, statSync } from "fs";

const exists = (path) => {
  try {
    return statSync(path).isFile();
  } catch (e) {
    return false;
  }
};

const server = http.createServer((req, res) => {
  req.url = req.url.replace("+text=", "&text="); // 修正请求 URL
  const { pathname } = new URL("http://127.0.0.1" + req.url);
  const filePath = `public${pathname}`;

  console.log("🔥 " + decodeURI(req.url));

  if (pathname.startsWith("/api/speakers")) {
    apiSpeakers(req, res);
  } else if (pathname.startsWith("/api/tts.mp3")) {
    apiTTS(req, res);
  } else if (exists(filePath)) {
    res.writeHead(200, {
      "Transfer-Encoding": "chunked",
      "Content-Type": "audio/mpeg",
    });
    const readStream = createReadStream(filePath);
    readStream.pipe(res);
  } else {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("404");
  }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
