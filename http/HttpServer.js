module.exports = (function(){

    "use strict";

    console.time('[HttpServer][Start]');

    //http协议模块
    var http = require('http');
    //url解析模块
    var url = require('url');
    //文件系统模块
    var fs = require("fs");
    //路径解析模块
    var path = require("path");

    return {
        route:null,
        handle:null,

        //启动服务
        start:function(r, h){
            this.route = r;
            this.handle = h;
            var port = this.config.port;
            var ip = this.config.ip;

            //创建一个服务
            var httpServer = http.createServer(this.processRequest.bind(this));

            //在指定的端口监听服务
            httpServer.listen(port,function(){
                console.log("[HttpServer][Start]","runing at http://"+ip+":"+port+"/");
                console.timeEnd("[HttpServer][Start]");
            });

            httpServer.on("error", function(error) {
                console.error(error);
            });
        },

        /**
         * 请求处理
         * @param request
         * @param response
         */
        processRequest:function(request,response){

            var hasExt = true;
            var requestUrl = request.url;
            var pathName = url.parse(requestUrl).pathname;
            var postData = url.parse(request.url, true).query;
            console.log(postData)
            //对请求的路径进行解码，防止中文乱码
            pathName = decodeURI(pathName);

            // //如果路径中没有扩展名
            // if(path.extname(pathName) === ''){
            //     //如果不是以/结尾的，加/并作301重定向
            //     if (pathName.charAt(pathName.length-1) != "/"){
            //         pathName += "/";
            //         var redirect = "http://"+request.headers.host + pathName;
            //         response.writeHead(301, {
            //             location:redirect
            //         });
            //         response.end();
            //         return ; //fix bug: 执行301重定向后应终止后续流程，以防 "write after end" 异常 （2017-4-21 23:11:37）
            //     }
            //     //添加默认的访问页面,但这个页面不一定存在,后面会处理
            //     pathName += "index.html";
            //     hasExt = false; //标记默认页面是程序自动添加的
            // }

            this.route(this.handle, pathName, postData, response);

        },



        ///配置信息
        config:{
            port:80,
            ip:'127.0.0.1'

        }
    }
})();
