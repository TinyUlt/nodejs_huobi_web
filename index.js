var http = require('./http/HttpServer');
var router = require("./router");
var requestHandlers = require("./requestHandlers");

var handle = {};
handle["/"] = requestHandlers.one;
handle["/loader.js"] = requestHandlers.one;
handle["/jquery.min.js"] = requestHandlers.one;
handle["/jquery-1.4.2.min.js"] = requestHandlers.one;
handle["/second"] = requestHandlers.getData;
handle["/halfMinute"] = requestHandlers.getData;
handle["/minute"] = requestHandlers.getData;
handle["/fiveMinute"] = requestHandlers.getData;
handle["/tenMinute"] = requestHandlers.getData;
handle["/halfHour"] = requestHandlers.getData;
handle["/hour"] = requestHandlers.getData;

http.start(router.route, handle);
