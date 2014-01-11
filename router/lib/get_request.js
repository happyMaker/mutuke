var Common=require("./common");
var ejs=Common.ejs;
var config=Common.config;
var ctrl=Common.ctrl;
var js_version=config.js_version;
var css_version=config.css_version;
var upload_max_size=1024*1024*2;

var checkLogind=Common.checkLogind,
    checkStudio=Common.checkStudio;

function setApp(app){
     app.get('/', function(req, res){
            res.redirect("/album_list");
            res.render("index",{
                "js_version":js_version,
                "css_version":css_version,
                "title":"首页"
            });
    });

    //qq login  ========start

    app.get("/qqlogin",function(req,res){
        var url=ctrl.Oauth.QQ.getPath();
        res.redirect(url);
    });
    app.get("/qq_callback",function(req,res){
        var Acode=req.query.code;
        var qq=ctrl.Oauth.QQ;
        var url=qq.packagePathToGetToken(Acode);
            qq.getToken(url,function(json){
                if(json.status=="ok"){
                    qq.getOpenId(json.data,function(result){
                        if(result.status=="ok"){
                            var clientId=result.data.client_id,
                                openId=result.data.openid;
                            req.session.thirdparty={
                                openIdType:"qq",
                                openId:openId,
                                clientId:clientId
                            }
                            var jsonReq={};
                                jsonReq.openId=openId;
                            ctrl.Users.getUserByOpenId(jsonReq,function(err,result){
                                if(err){
                                    return showError({
                                        "message":"此对象已经进行过绑定，请不要重复绑定;",
                                        "res":res
                                    });
                                }
                                if(result){
                                    req.session.userId=result._id;
                                    req.session.username=result.name;
                                    req.session.studioId=result.studioId;
                                    res.redirect("/");
                                }else{
                                    res.redirect("/first_login");
                                }
                            });
                        }else{
                            res.send(result.message);
                        }
                    }); 
                }else{
                    res.send(json.message);
                }
            });
    });
    //qq login ========= end 
    app.get('/first_login', function(req,res){
        var path=req.query.path;
        if(path){path=path.toString()};
        if(!(req.session.thirdparty&&req.session.thirdparty.openId)){
            return showError({
                "message":"您没有通过第三方帐号登录;",
                "res":res
            });
        }
        res.render("first_login",{
            "js_version":js_version,
            "css_version":css_version,
            "title":"第一次登录",
        });
    });
    app.get('/logout', function(req,res){
        req.session.destroy();
        res.redirect("/login");
    });

    app.get('/login', function(req,res){
        var path=req.query.path;
        if(path){path=path.toString()};
        res.render("login",{
            "js_version":js_version,
            "css_version":css_version,
            "title":"登录",
            "path":path
        });
    });
    app.get('/register', function(req, res){
        res.render("register",{
            "js_version":js_version,
            "css_version":css_version,
            "title":"注册"
        });
    });

   function showError(json){
                    json.res.render("error",{
                        "js_version":js_version,
                        "css_version":css_version,
                        "title":"Error",
                        "message":json.message
                    });    
   } 
//---------------------------------------------------------------- user begin ---------------------------------------------------//
    app.get('/bindLink/:cusId', function(req, res){
        var jsonReq={};
        if(checkLogind(req,res,"get")){
            jsonReq.userId=req.session.userId;
            jsonReq.cusId=req.params.cusId;
            ctrl.Customer.checkBind(jsonReq,function(err,result){
                if(!result){
                    res.render("bindlink",{
                        "js_version":js_version,
                        "css_version":css_version,
                        "cusId":jsonReq.cusId,
                        "title":"绑定用户"
                    });
                }else{
                    showError({
                        "message":"此对象已经进行过绑定，请不要重复绑定;",
                        "res":res
                    });
                }
            });
        };
    });

    //选片页面
    app.get("/select_photos",function(req,res){
        if(checkLogind(req,res,"get","/select_photos")){
            //
            var jsonReq={};
                jsonReq.userId=req.session.userId;
            ctrl.Customer.getCustomerInfoIdByBindUserId(jsonReq,function(err,cusInfoId){
                var cusId=cusInfoId||"";
                res.render("select_photos",{
                    "js_version":js_version,
                    "css_version":css_version,
                    "user":{"name":req.session.username},
                    "title":"选片",
                    "cusInfoId":cusId
                });
            });
        }
    });

    //相册查看
    app.get("/album/:albumId",function(req,res){
        var albumId=req.params.albumId;
        if(checkLogind(req,res,"get","/album/"+albumId)){
            res.render("album",{
                "js_version":js_version,
                "css_version":css_version,
                "user":{"name":req.session.username},
                "albumId":albumId,
                "title":"照片"
            });
        };
    });
    
    //用户名下所有相册
    app.get("/album_list",function(req,res){
        if(checkLogind(req,res,"get","/album_list")){
            res.render("album_list",{
                "js_version":js_version,
                "css_version":css_version,
                "user":{"name":req.session.username},
                "title":"相册"
            });
        }
    });

    //------------------------  get photos start ---------------------------

    //获取公共图片
    app.get("/album_photo/:albumId/:imageId",function(req,res){
        var albumId=req.params.albumId;
        var imageId=req.params.imageId;
            imageId=imageId.split(".")[0];
        var userId=req.session.userId;
        var sizeR={"origin":"origin","800":800,"300":300,"180":180,"100":100};
        var typeR={"fill":"fill"}
        var size=sizeR[req.query.size]||180;
        var type=typeR[req.query.type]||"normal";
        var d=(new Date()).getTime();
            console.log((new Date()).getTime()+"---------------------------------------");
            ctrl.Images.getAlbumImage({
                "albumId":albumId,
                "fileId":imageId,
                "userId":userId,
                "imageType":type,
                "size":size
            },function(err,data){
                res.writeHead(200, {"Cache-Control":"max-age=86400",'Content-Type': 'image/jpg' });
                res.end(data, 'binary');
                var now=(new Date()).getTime();
                console.log((now-d)+"=================================");
            });
    });
    //
    app.get("/album_photo/download/:albumId/:imageId/:type",function(req,res){
        var albumId=req.params.albumId;
        var imageId=req.params.imageId;
        var userId=req.session.userId;
        var size="origin";
        var type="normal";
            ctrl.Images.getAlbumImage({
                "albumId":albumId,
                "fileId":imageId,
                "userId":userId,
                "imageType":type,
                "size":size
            },function(err,data){
                res.writeHead(206, 'Partial Content', { 'Content-Type' : 'application/octet-stream', });
                res.end(data,'binary');
            });
    });
    //获取公共图片
    app.get("/public_image/:imageId",function(req,res){
        var imageId=req.params.imageId;
        var userId=req.session.userId;
        var sizeR={"origin":"origin","300":300,"180":180,"100":100};
        var typeR={"fill":"fill"}
        var size=sizeR[req.query.size]||180;
        var type=typeR[req.query.type]||"normal";
            ctrl.Images.getPublicImage({
                "fileId":imageId,
                "userId":userId,
                "imageType":type,
                "size":size
            },function(err,data){
                res.writeHead(200, {"Cache-Control":"max-age=86400",'Content-Type': 'image/jpg' });
                res.end(data, 'binary');
            });
    });

    //获取客户绑定图片
    app.get('/order_photo/:cusInfoId/:orderId/:imageId', function(req, res){
        var cusInfoId=req.params.cusInfoId;
        var orderId=req.params.orderId;
        var imageId=req.params.imageId;
        var userId=req.session.userId;
        var sizeR={"origin":"origin","600":600,"300":300,"180":180,"100":100};
        var typeR={"fill":"fill"}
        var size=sizeR[req.query.size]||180;
        var type=typeR[req.query.type]||"normal";
        if(cusInfoId.toString()&&imageId.toString()){
            if(checkLogind(req,res,"get")){
                ctrl.Images.getImage({
                        "cusInfoId":cusInfoId,
                        "orderId":orderId,
                        "fileId":imageId,
                        "userId":userId,
                        "imageType":type,
                        "size":size
                },function(err,data){
                    if(err){
                        //res.redirect("/404");
                    }else{
                        res.writeHead(200, {"Cache-Control":"max-age=86400",'Content-Type': 'image/jpg' });
                        res.end(data, 'binary');
                    }
                });
            }
        }
    });
    //------------------------  get photos end ---------------------------

    //验证码图片
    app.get("/verifyCode",function(req,res){
        ctrl.VerifyCode.getVcode(function(jsonRes){
            var buf=jsonRes.buf;
            var vcode=jsonRes.vcode;
                req.session.vcode=vcode;
                res.writeHead(200, {'Content-Type': 'image/png' });
                res.end(buf, 'binary');
        });
    });

    //申请工作室
    app.get("/applystudio",function(req,res){
        if(req.session.studioId){
            res.redirect("/b/customer");
        }
        if(checkLogind(req,res,"get","/b/calendar")){
        //if(checkLogind(req,res,"get","/b/calendar")){
            res.render("applystudio",{
                "js_version":js_version,
                "css_version":css_version,
                "user":{"name":req.session.username},
                "path":"",
                "title":"工作室申请"
            });
        };
    });
//---------------------------------------------------------------- user end ---------------------------------------------------//




//---------------------------------------------------------------- studio begin ---------------------------------------------------//

    //事物管理
    app.get("/b/studio_set",function(req,res){
        if(checkLogind(req,res,"get","/b/studio_set")){
            checkStudio(req,res,"get",function(err,result){
                if(err){
                    return showError({
                        "message":err,
                        "res":res
                    });
                }
                if(result.status=="ok"){
                    res.render("studio_set",{
                        "js_version":js_version,
                        "css_version":css_version,
                        "user":{"name":req.session.username},
                        "title":"工作室设置"
                    });
                }
            });
        }
    });
    //订单页面
    app.get("/b/orderList/:cusInfoId",function(req,res){
        var cusInfoId=req.params.cusInfoId;
        if(checkLogind(req,res,"get","/b/calendar")){
            checkStudio(req,res,"get",function(err,result){
                if(err){
                    return showError({
                        "message":err,
                        "res":res
                    });
                }
                if(result.status=="ok"){
                    res.render("./studio/order",{
                        "js_version":js_version,
                        "css_version":css_version,
                        "user":{"name":req.session.username},
                        "cusInfoId":cusInfoId,
                        "title":"订单列表"
                    });
                }
            });
        }
    });
    
    //事物管理
    app.get("/b/calendar",function(req,res){
        if(checkLogind(req,res,"get","/b/calendar")){
            checkStudio(req,res,"get",function(err,result){
                if(err){
                    return showError({
                        "message":err,
                        "res":res
                    });
                }
                if(result.status=="ok"){
                    res.render("calendar",{
                        "js_version":js_version,
                        "css_version":css_version,
                        "user":{"name":req.session.username},
                        "title":"事物管理"
                    });
                }
            });
        }
    });

    app.get("/b/image_module",function(req,res){
        if(checkLogind(req,res,"get","/b/image_module")){
            checkStudio(req,res,"get",function(err,result){
                if(err){
                    return showError({
                        "message":err,
                        "res":res
                    });
                }
                if(result.status=="ok"){
                    var jsonReq={};
                        jsonReq.userId=req.session.userId;
                    ctrl.Customer.getCustomerInfoIdByBindUserId(jsonReq,function(err,cusInfoId){
                        var cusId=cusInfoId||"";
                        res.render("image_module",{
                            "js_version":js_version,
                            "css_version":css_version,
                            "user":{"name":req.session.username},
                            "title":"模板管理",
                            "cusInfoId":cusId
                        });
                    });
                }
            });
        }
    });

    app.get('/b/image_library', function(req, res){
        if(checkLogind(req,res,"get","/b/image_library")){
            checkStudio(req,res,"get",function(err,result){
                if(err){
                    return showError({
                        "message":err,
                        "res":res
                    });
                }
                if(result.status=="ok"){
                    res.render("image_library",{
                        "js_version":js_version,
                        "css_version":css_version,
                        "P_css":"image_libs",
                        "P_js":"image_libs",
                        "user":{"name":"song","qq":"20126162"},
                        "title":"图片库"
                    });
                }
        });
        }
    });
    app.get('/b/manage_image/:cusInfoId/:orderId', function(req, res){
        if(!req.params.cusInfoId){ res.redirect("/404"); };
        if(checkLogind(req,res,"get","/b/manage_image/"+req.params.id)){
            checkStudio(req,res,"get",function(err,result){
                if(err){
                    return showError({
                        "message":err,
                        "res":res
                    });
                }
                if(result.status=="ok"){
                    var jsonReq={}
                        jsonReq.cusInfoId=req.params.cusInfoId,
                        jsonReq.userId=req.session.userId;
                        jsonReq.studioId=req.session.studioId;
                        res.render("manage_image",{
                            "js_version":js_version,
                            "css_version":css_version,
                            "title":"图片管理",
                            "cusInfoId":req.params.cusInfoId,
                            "orderId":req.params.orderId
                        });
                }
            });
        }
    });
    app.get('/b/customer', function(req, res){
        if(checkLogind(req,res,"get","/b/customer")){
            checkStudio(req,res,"get",function(err,result){
                if(err){
                    return showError({
                        "message":err,
                        "res":res
                    });
                }
                if(result.status=="ok"){
                    res.render("customer",{
                        "js_version":js_version,
                        "css_version":css_version,
                        "title":"客户管理",
                        "user":{"name":req.session.username,"qq":"20126162"},
                        "id":req.query.id
                    });
                }
            });
        }
    });

    app.get("/b/selects/:cusInfoId",function(req,res){
        var cusInfoId=req.params.cusInfoId;
        if(checkLogind(req,res,"get","/select_photos")){
            checkStudio(req,res,"get",function(err,result){
                if(err){
                    return showError({
                        "message":err,
                        "res":res
                    });
                }
                if(result.status=="ok"){
                    res.render("selects",{
                        "js_version":js_version,
                        "css_version":css_version,
                        "user":{"name":req.session.username},
                        "title":"列表",
                        "cusInfoId":cusInfoId
                    });
                };
            });
        }
    });
//---------------------------------------------------------------- studio end---------------------------------------------------//



}
exports.initApp=function(app){
    setApp(app);
}
