// Tiny static server for local preview: node serve.js
const http=require("http"),fs=require("fs"),path=require("path");
const T={".html":"text/html",".js":"text/javascript",".css":"text/css"};
http.createServer((q,s)=>{let f=path.join(__dirname,"www",q.url.split("?")[0]==="/"?"index.html":q.url.split("?")[0]);
fs.readFile(f,(e,d)=>{if(e){s.writeHead(404);return s.end("404")}s.writeHead(200,{"Content-Type":(T[path.extname(f)]||"text/plain")+"; charset=utf-8"});s.end(d)})}).listen(5188);
