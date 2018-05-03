/**
 * BARE MINIMAL SRV to free the user to create virtual hosts
 */
var http = require('http'),
    url = require('url'),
    fs = require('fs'),
    path = require('path'),
    // you can pass the parameter in the command line. e.g. node static_server.js 3000
    //
    ext;

http.createServer(function (req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Request-Method', '*');
    res.setHeader('Access-Control-Allow-Methods', '*');
    res.setHeader('Access-Control-Allow-Headers', '*');

    // parse URL
    let parsedUrl = url.parse(req.url),
        // extract URL path
        pathname = path.resolve(path.dirname(__filename) + parsedUrl.pathname),
        // maps file extention to MIME types
        mimeType = {
            ".ico": "image/x-icon",
            ".html": "text/html",
            ".js": "text/javascript",
            ".json": "application/json",
            ".css": "text/css",
            ".png": "image/png",
            ".jpg": "image/jpeg",
            ".wav": "audio/wav",
            ".mp3": "audio/mpeg",
            ".svg": "image/svg+xml",
            ".pdf": "application/pdf",
            ".doc": "application/msword",
            ".eot": "appliaction/vnd.ms-fontobject",
            ".ttf": "aplication/font-sfnt"
        },
        do404 = () => {
            res.statusCode = 404;
            res.end("File " + path.basename(pathname) + '  not found!');
            return;
        };
    
    if (parsedUrl.pathname.match(/^\/(package.json|srv.js|ws_srv.js|actions|core)/)) {
        return do404();
    }

    fs.exists(pathname, function (exist) {
        if (!exist) {
            return do404();
        }
        // if is a directory, then look for index.html
        if (fs.statSync(pathname).isDirectory()) {
            pathname += "/index.html";
        }
        // read file from file system
        fs.readFile(pathname, function (err, data) {
            if (err) {
                res.statusCode = 500;
                res.end("Error getting the file");
            } else {
                // based on the URL path, extract the file extention. e.g. .js, .doc, ...
                ext = path.parse(pathname).ext;
                // if the file is found, set Content-type and send data
                res.setHeader("Content-type", mimeType[ext] || "text/plain");
                res.end(data);
            }
        });
    });
}).listen(parseInt(port));

console.log(msg);