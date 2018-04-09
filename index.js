var http = require('./http/HttpServer');
var router = require("./router");
var requestHandlers = require("./requestHandlers");

var handle = {};
handle["/"] = requestHandlers.one;
handle["/one"] = requestHandlers.one;
handle["/two"] = requestHandlers.two;

http.start(router.route, handle);
