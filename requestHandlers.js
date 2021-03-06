//http协议模块
var http = require('http');
//url解析模块
var url = require('url');
//文件系统模块
var fs = require("fs");
//路径解析模块
var path = require("path");
/**
 * 获取文档的内容类型
 * @param filePath
 * @returns {*}
 */
let mime={
    html:"text/html",
        js:"text/javascript",
        css:"text/css",
        gif:"image/gif",
        jpg:"image/jpeg",
        png:"image/png",
        ico:"image/icon",
        txt:"text/plain",
        json:"application/json",
        default:"application/octet-stream"
}
function getContentType(filePath){
    var contentType = mime;
    var ext = path.extname(filePath).substr(1);
    if (contentType.hasOwnProperty(ext)){
        return contentType[ext];
    }else {
        return contentType.default;
    }
}
function one (pathName, data, response) {
    var hasExt = true;
    // //获取资源文件的相对路径
    // var filePath = path.join("http/webroot","index.html");
    console.log("aaaaaaaa");
    //如果路径中没有扩展名
    if(path.extname(pathName) === ''){
        console.log("bbbbbbb");
        //如果不是以/结尾的，加/并作301重定向
        if (pathName.charAt(pathName.length-1) != "/"){
            console.log("ccccccc");
            pathName += "/";
            var redirect = "http://"+request.headers.host + pathName;
            response.writeHead(301, {
                location:redirect
            });
            response.end();
            return ; //fix bug: 执行301重定向后应终止后续流程，以防 "write after end" 异常 （2017-4-21 23:11:37）
        }
        //添加默认的访问页面,但这个页面不一定存在,后面会处理
        pathName += "index.html";
        hasExt = false; //标记默认页面是程序自动添加的
    }
    console.log("dddddd");
    //获取资源文件的相对路径
    var filePath = path.join("http/webroot",pathName);
    console.log(filePath);
    //获取对应文件的文档类型
    var contentType = getContentType(filePath);

    //如果文件名存在
    fs.exists(filePath,function(exists){
        console.log("eeeeee");
        if(exists){
            console.log("fffffff");
            response.writeHead(200, {"content-type":contentType});
            var stream = fs.createReadStream(filePath,{flags:"r",encoding:null});
            stream.on("error", function() {
                response.writeHead(500,{"content-type": "text/html"});
                response.end("<h1>500 Server Error</h1>");
            });
            //返回文件内容
            stream.pipe(response);
        }else { //文件名不存在的情况
            console.log("gggggggg");
            if(hasExt){
                console.log("hhhhhh");
                //如果这个文件不是程序自动添加的，直接返回404
                response.writeHead(404, {"content-type": "text/html"});
                response.end("<h1>404 Not Found</h1>");
            }else {
                console.log("iiiii");
                //如果文件是程序自动添加的且不存在，则表示用户希望访问的是该目录下的文件列表
                var html = "<head><meta charset='utf-8'></head>";

                try{
                    //用户访问目录
                    var filedir = filePath.substring(0,filePath.lastIndexOf('\\'));
                    //获取用户访问路径下的文件列表
                    var files = fs.readdirSync(filedir);
                    //将访问路径下的所以文件一一列举出来，并添加超链接，以便用户进一步访问
                    for(var i in files){
                        var filename = files[i];
                        html += "<div><a  href='"+filename+"'>"+filename+"</a></div>";
                    }
                }catch (e){
                    html += "<h1>您访问的目录不存在</h1>"
                }
                response.writeHead(200, {"content-type": "text/html"});
                response.end(html);
            }
        }
    });
}

const moment = require('moment');

var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');

var url = 'mongodb://root:TinyUlt920805@47.52.225.13:27017/huobi?authSource=admin';
var dbase;
MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    console.log('Connected correctly to server.');
    dbase = db.db("huobi");
    // dbase.createCollection('site', function (err, res) {
    //     assert.equal(null, err);
    //     console.log("创建集合!");
    //     db.close();
    // });
});
function getDateString(){
    var today=new Date();
    return today.getFullYear()+"_" + (today.getMonth() + 1) + "_" + today.getDate();
}
function getDataValue(){
    var today=new Date();
    return today.valueOf();
}

function find(pathName,data, response){

    var query = {};
    let startTime =parseInt(data.startTime);
    let endTime =parseInt( data.endTime);
    dbase.collection("g"). find({_id:{$gte:startTime,$lte:endTime}, [pathName]:1 }).project({_id:1, btc:1, usd:1, usdt:1,usdtbuy:1, btcminamount:1,btcminvol:1, btcmincount:1 }).sort({_id:1}).toArray(function(err, result) { // 返回集合中所有数据
        if (err) throw err;

        response.writeHead(200, {"Content-Type": "text/plain"});
        response.write(JSON.stringify(result));
        response.end();
    });
}
function getData (pathName,data, response ) {
    pathName = pathName.substring(1)
    find(pathName,data, response);
    // var body = '<html>' +
    //     '<head>' +
    //     '<meta http-equiv-"Content-Type" content="text/html;charset=UTF-8"/>' +
    //     '</head>' +
    //     '<body>' +
    //     '<a href="/one">one</a>' +
    //     '</body>'+
    //     '</html>';
    //
    // response.writeHead(200, {"Content-Type": "text/html"});
    // response.write(body);
    // response.end();
}
exports.one = one;
exports.getData = getData;
