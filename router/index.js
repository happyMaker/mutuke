var getReq=require("./lib/get_request");
var postReq=require("./lib/post_request");


exports.init=function(app){
    getReq.initApp(app);
    postReq.initApp(app);
}

