var Common=require("./common");
var ejs=Common.ejs;
var config=Common.config;
var ctrl=Common.ctrl;
var js_version=config.js_version;
var css_version=config.css_version;
var upload_max_size=1024*1024*10;

var checkLogind=Common.checkLogind,
    checkStudio=Common.checkStudio;

function setApp(app){
    app.post('/bindLink', function(req, res){
        var jsonReq={};
        var cusId=req.body.cusId;
        var reserverMessage=req.body.reserverMessage;
        var reqVcode=req.body.vcode;
        if(!(reserverMessage&&cusId&&reqVcode)){
            res.send({"status":"error","message":"params error"});
            return ;
        }
        if(checkLogind(req,res)){
            jsonReq.cusId=cusId;
            jsonReq.userId=req.session.userId;
            jsonReq.reserverMessage=reserverMessage;
            if(reqVcode.toLowerCase()!=req.session.vcode){
                res.send({"stuats":"sorry","message":"vcode error"});
                return
            }
            ctrl.Customer.bindUser(jsonReq,function(err,json){
                if(err){
                    res.send({"status":"sorry","message":err});
                    return
                }
                if(json>0){
                    res.send({"status":"ok"});
                }else{
                    res.send({"status":"sorry","message":"code error"});
                }
            });
        };
    });

//================================================  product ================//
    app.post('/removeProduct', function(req, res){
        var reqBody=req.body;
        var jsonReq={};
            jsonReq.userId=req.session.userId;
            jsonReq.studioId=req.session.studioId;
            jsonReq.productId=req.body.productId;
        if(checkLogind(req,res)){
            checkStudio(req,res,"post",function(err,result){
                if(err){
                    res.send({"status":"error","message":err});
                }
                if(result.status=="ok"){
                    ctrl.Product.removeProduct(jsonReq,function(err,json){
                        if(err){
                            res.send({"status":"error","message":err});
                            return
                        }
                        res.send({"status":"ok","id":json});
                    });
                }
            });
        };
    });
    app.post('/addProduct', function(req, res){
        var reqBody=req.body;
        var jsonReq={};
            jsonReq.userId=req.session.userId;
            jsonReq.studioId=req.session.studioId;
            jsonReq.name=reqBody.productName;
        if(checkLogind(req,res)){
            checkStudio(req,res,"post",function(err,result){
                if(err){
                    res.send({"status":"error","message":err});
                }
                if(result.status=="ok"){
                    ctrl.Product.addProduct(jsonReq,function(err,json){
                        if(err){
                            res.send({"status":"error","message":err});
                            return
                        }
                        res.send({"status":"ok","id":json});
                    });
                }
            });
        };
    });

    app.post('/getAllProduct', function(req, res){
        var reqBody=req.body;
        var jsonReq={};
            jsonReq.userId=req.session.userId;
            jsonReq.studioId=req.session.studioId;
        if(checkLogind(req,res)){
            checkStudio(req,res,"post",function(err,result){
                if(err){
                    res.send({"status":"error","message":err});
                }
                if(result.status=="ok"){
                    ctrl.Product.getProductsByUserId(jsonReq,function(err,json){
                        if(err){
                            res.send({"status":"error","message":err})
                            return
                        }
                        res.send({"status":"ok","data":json});
                    });
                }
            });
        };
    });

    app.post('/changeProduct', function(req, res){
        var reqBody=req.body;
        var jsonReq={};
            jsonReq.studioId=req.session.studioId;
            jsonReq.userId=req.session.userId;
            jsonReq.name=reqBody.productName;
            jsonReq.size=reqBody.size;
            jsonReq.description=reqBody.description;
            jsonReq.imgPath=reqBody.imagePath;
            jsonReq.price=reqBody.price;
            jsonReq.productId=reqBody.productId;
            jsonReq.imgCount=reqBody.imgCount;

            if(checkLogind(req,res)){
            checkStudio(req,res,"post",function(err,result){
                if(err){
                    res.send({"status":"error","message":err});
                }
                if(result.status=="ok"){
                    ctrl.Product.changeProduct(jsonReq,function(err,json){
                        if(json>0){
                            res.send({"status":"ok"});
                        }else{
                            res.send({"status":"sorry"});
                        }
                    });
                }
            });
            };
    });

    app.post("/uploadProductHeadImage",function(req,res){
        var jsonReq={};
        jsonReq.files=req.files.files;
        jsonReq.productId=req.body.productId;
        jsonReq.userId=req.session.userId;
        jsonReq.studioId=req.session.studioId;
        if(checkLogind(req,res)){
            checkStudio(req,res,"post",function(err,result){
                if(err){
                    res.send({"status":"error","message":err});
                }
                if(result.status=="ok"){
                    ctrl.Product.uploadProductHeadImage(jsonReq,function(err,result){
                        if(result){
                            res.send({"status":"ok","data":result});      
                        }
                    });
                }
            });
        };
    });


//-------------------------------------- product end --------------------------//

    //查找用户 user
    app.post('/ajax_searchUser', function(req, res){
        if(checkLogind(req,res)){
            return false;
            ctrl.Users.searchUser({keyword:req.body.keyword},function(json){
                if(err){return res.send({"status":"sorry","message":err})}
                res.send(json);
            });
        };
    });

    //查找客户
    app.post('/ajax_searchCustomer', function(req, res){
        if(checkLogind(req,res)){
            ctrl.Customer.searchCustomer({keyword:req.body.keyword},function(json){
                if(err){
                    res.send({"status":"error","message":err})
                    return;
                }
                res.send(json);
            });
        };
    });

    //提交选片列表
    app.post('/ajax_uploadSelectPhotoList', function(req, res){
        if(checkLogind(req,res)){
            var jsonReq={};
                jsonReq.objStr=req.body.objStr;
                jsonReq.userId=req.session.userId; 
            ctrl.Customer.uploadSelectPhotoList(jsonReq,function(err,result){
                if(err){
                    res.send({"status":"error","message":err})
                    return;
                }
                res.send({"status":"ok"});
            });
        };
    });

    app.post('/ajax_getSelects', function(req, res){
        var jsonReq={};
            jsonReq.objStr=req.body.objStr;
            jsonReq.userId=req.session.userId; 
            jsonReq.cusInfoId=req.body.cusInfoId;
        if(checkLogind(req,res)){
            checkStudio(req,res,"post",function(err,result){
                if(result.status=="ok"){
                    ctrl.Customer.getSelects(jsonReq,function(err,result){
                        if(err){
                            res.send({"status":"error","message":err})
                            return;
                        }
                        res.send({"status":"ok","data":result});
                    });
                }else{
                        res.send({"status":"sorry","message":err})
                }
            });
        };
    });

    //添加客户
    app.post('/ajax_addCustomer', function(req, res){
        var reqBody=req.body;
        var jsonReq={};
            jsonReq.username=req.session.username;
            jsonReq.userId=req.session.userId;
            jsonReq.studioId=req.session.studioId;

            jsonReq.boyName=reqBody.boyName;
            jsonReq.boyPhone=reqBody.boyPhone;
            jsonReq.boyOther=reqBody.boyOther;
            jsonReq.girlName=reqBody.girlName;
            jsonReq.girlPhone=reqBody.girlPhone;
            jsonReq.girlOther=reqBody.girlOther;
            jsonReq.message=reqBody.message;
            jsonReq.address=reqBody.address;

        if(checkLogind(req,res)){
            checkStudio(req,res,"post",function(err,result){
                if(err){
                    res.send({"status":"error","message":err})
                    return;
                }
                if(result.status=="ok"){
                    ctrl.Customer.addCustomer(jsonReq,function(err,json){
                        res.send({"status":"ok","data":json});
                    });
                }else{
                        res.send({"status":"sorry"});
                }
            });
        };
    });

    /* =========================     order start  -----------------------------*/ 

    app.post("/ajax_getOrderList",function(req,res){
        var jsonReq={};
            jsonReq.userId=req.session.userId;
            jsonReq.cusInfoId=req.body.cusInfoId;
        if(checkLogind(req,res)){
            checkStudio(req,res,"post",function(err,result){
                if(result.status=="ok"){
                    ctrl.Order.getOrderList(jsonReq,function(err,result){
                        if(err){
                            res.send({"status":"error","message":err})
                            return;
                        }
                        res.send({"status":"ok","data":result});
                    });
                }
            })
        }
    });
    app.post("/ajax_addOrder",function(req,res){
        var jsonReq={};
            jsonReq.userId=req.session.userId;
            jsonReq.cusInfoId=req.body.cusInfoId;
            jsonReq.studioId=req.session.studioId;
        if(checkLogind(req,res)){
            checkStudio(req,res,"post",function(err,result){
                if(result.status=="ok"){
                    ctrl.Order.addOrder(jsonReq,function(err,result){
                        if(err){
                            res.send({"status":"error","message":err})
                            return;
                        }
                        res.send({"status":"ok","data":result});
                    });
                }
            })
        }
    });
    
    //给customerInfo 绑定 product
    app.post("/ajax_bindProductToOrder",function(req,res){
        var userId=req.session.userId;
        var jsonReq={};
            jsonReq.userId=userId;
            jsonReq.orderId=req.body.orderId;
            jsonReq.productId=req.body.productId;
            jsonReq.cusInfoId=req.body.cusInfoId;
            jsonReq.studioId=req.session.studioId;
        if(checkLogind(req,res)){
            checkStudio(req,res,"post",function(err,result){
                if(result.status=="ok"){
                    ctrl.Order.addProductToOrder(jsonReq,function(err,result){
                        if(err){
                            res.send({"status":"error","message":err})
                            return;
                        }
                        res.send({"status":"ok"});
                    });
                }else{
                        res.send({"status":"sorry"});
                }
            });
        }
    });
    
    //获取customerInfo下得所有模板 product
    app.post("/ajax_getProductsFromOrder",function(req,res){
        var userId=req.session.userId;
        var jsonReq={};
            jsonReq.userId=userId;
            jsonReq.cusInfoId=req.body.cusInfoId;
            jsonReq.orderId=req.body.orderId;
        if(checkLogind(req,res)){
            checkStudio(req,res,"post",function(err,result){
                 ctrl.Order.getProductsFromOrder(jsonReq,function(err,result){
                    if(err){
                        res.send({"status":"error","message":err});
                        return;
                    }
                    res.send({"status":"ok","data":result});
                 });
            });
        }
    });
   
    //从customerInfo中删除product；
    app.post("/ajax_removeProductFromOrder",function(req,res){
        var userId=req.session.userId;
        var jsonReq={};
            jsonReq.userId=userId;
            jsonReq.productId=req.body.productId;
            jsonReq.orderId=req.body.orderId;
            jsonReq.cusInfoId=req.body.cusInfoId;
            jsonReq.studioId=req.session.studioId;
        if(checkLogind(req,res)){
            checkStudio(req,res,"post",function(err,result){
                if(result.status=="ok"){
                    ctrl.Order.removeProductFromOrder(jsonReq,function(err,result){
                        if(err){
                            res.send({"status":"error","message":err})
                            return;
                        }
                        res.send({"status":"ok"});
                    });
                }else{
                        res.send({"status":"sorry"});
                }
            });
        }
    });
    
    //减少1个，如果为0则会删除；
    app.post("/ajax_subProductFromOrder",function(req,res){
        var userId=req.session.userId;
        var jsonReq={};
            jsonReq.userId=userId;
            jsonReq.productId=req.body.productId;
            jsonReq.orderId=req.body.orderId;
            jsonReq.cusInfoId=req.body.cusInfoId;
            jsonReq.studioId=req.session.studioId;
        if(checkLogind(req,res)){
            checkStudio(req,res,"post",function(err,result){
                if(result.status=="ok"){
                    ctrl.Order.subProductFromOrder(jsonReq,function(err,result){
                        if(err){
                            res.send({"status":"error","message":err})
                            return;
                        }
                        res.send({"status":"ok"});
                    });
                }else{
                        res.send({"status":"sorry"});
                }
            });
        }
    });

    /* =========================     order end       =============================*/
    



    //获取客户列表
    app.post('/ajax_getCustomer', function(req, res){
        var username=req.session.username;
        var jsonReq={};
            jsonReq.userId=req.session.userId;
            jsonReq.studioId=req.session.studioId;
        if(checkLogind(req,res)){
            checkStudio(req,res,"post",function(err,result){
                if(result.status=="ok"){
                    ctrl.Customer.getCustomerList(jsonReq,function(err,json){
                        if(err){
                            res.send({"status":"error","message":err})
                            return;
                        }
                        res.send(json);
                    });
                }
            })
        };
    });
    //删除上传照片
    app.post('/deleteCustomerPhoto', function(req, res){
        var cusInfoId=req.body.cusInfoId;
        var fileId=req.body.fileId;
        if(checkLogind(req,res)){
            checkStudio(req,res,"post",function(err,result){
                if(result.status=="ok"){
                    ctrl.ImageLibs.deletePhoto({
                        cusInfoId:cusInfoId,
                        fileId:fileId,
                        userId:req.session.userId
                    },function(err,result){
                        if(err){
                            res.send({"status":"error","message":err})
                            return;
                        }
                        res.send({"status":"ok","cusInfoId":cusInfoId}); 
                    });
                }
            });
        }
    });
    //上传图片
    app.post('/uploadImageToImagesLib', function(req, res){
        var jsonReq={};
            jsonReq.files=req.files.files;
            jsonReq.cusInfoId=req.body.cusInfoId;
            jsonReq.userId=req.session.userId;
            var ImageSize=jsonReq.files[0].size;
            if(parseInt(ImageSize)>upload_max_size){
                res.send({"stuats":"sorry","message":"Image too large"});
                return 
            }
        if(checkLogind(req,res)){
            checkStudio(req,res,"post",function(err,result){
                if(err){
                    res.send({"status":"error","message":err})
                    return;
                }
                ctrl.ImageLibs.uploadImageToImagesLib(jsonReq,function(err,json){
                    res.send({"status":"ok","data":json})
                });
            });
        };
    });
    //根据图片库Id获取图片列表
    app.post('/getCustomerImages', function(req, res){
        if(checkLogind(req,res)){
            var jsonReq={};
                jsonReq.cusInfoId=req.body.cusInfoId;
                jsonReq.userId=req.session.userId;
            ctrl.ImageLibs.getCustomerImages(jsonReq,function(err,result){
                if(err){
                    res.send({"status":"error","message":err})
                    return;
                }
                if(result&&result.status=="ok"){
                    res.send({"status":"ok","data":result.data});
                }else{
                    res.send({"status":"sorry","data":[]});
                }
            });
        };
    });

    app.post("/applystudio",function(req,res){
        var jsonReq={};
            jsonReq.name=req.body.name;
        if(checkLogind(req,res)){
            if(req.session.studioId){
                res.send({"status":"sorry","message":"已经存在!"});
            };
            jsonReq.userId=req.session.userId;
            ctrl.Customer.applyStudio(jsonReq,function(err,result){
                if(err){
                    res.send({"status":"error","message":err})
                    return;
                }
                if(result.status=="ok"){
                    req.session.studioId=result.studioId;
                    res.send({"status":"ok"});
                }else{
                    res.send(result);
                }
            });
        };
    });
    app.post('/ajax_newThirdparty', function(req, res){
        var jsonReq={};
            jsonReq.idType=req.session.thirdparty.openIdType;
            jsonReq.openId=req.session.thirdparty.openId;
        ctrl.Users.newThirdparty(jsonReq,function(err,result){
            if(err){
                res.send({"status":"error","message":err})
                return;
            }
            if(result.status=="ok"){
                console.log(result.userId);
                req.session.userId=result.userId;
            }
            res.send(result);
        });
    });

    //登录
    app.post('/ajax_login', function(req, res){
            var path=req.body.path;
        ctrl.Users.login({
            "username":req.body.username,
            "pass":req.body.pass
        },function(err,json){
            if("ok"==json.status){
                req.session.username=req.body.username;
                req.session.userId=json.data._id;
                req.session.studioId=json.data.studioId||null;
                req.session.thirdparty={};
                res.send({"status":"ok","message":"登陆成功!"}); 
            }else{
                res.send({"status":"sorry","message":"用户名和密码不正确"}); 
            }
        });
    });
    //检测用户名 
    app.post('/ajax_checkUsername', function(req, res){
        var username=req.body.username;
        if(!username){
            res.send({"status":"sorry","message":"参数不完整!"});
            return 
        }
        var jsonReq={};
            jsonReq.username=username;
        ctrl.Users.checkUsername(jsonReq,function(err,result){
            if(err){
                res.send({"status":"error","message":err});
                return ;
            } 
            if(result){
                res.send({"status":"sorry","message":"用户名已经存在"});
            }else{
                res.send({"status":"ok","message":"可以使用"});
            }
        }); 
    });
    //注册
    app.post('/ajax_register', function(req, res){
        if(!(req.body.username&&req.body.pass&&req.body.vcode)){
            res.send({"status":"sorry","message":"参数不完整!"});
            return;
        }
        var reqVcode=req.body.vcode;
        if(reqVcode.toLowerCase()!=req.session.vcode){
            res.send({"status":"sorry","message":"验证码错误!"});
            return;
        }

        var jsonReq={};
            jsonReq.username=req.body.username;
            jsonReq.pass=req.body.pass
        ctrl.Users.checkUsername(jsonReq,function(err,result){
            if(err){
                res.send({"status":"error","message":err});
                return
            } 
            if(result){
                res.send({"status":"sorry","message":"用户名已经存在"});
                return 
            }else{
                ctrl.Users.insertUserName(jsonReq,function(err,json){
                    res.send(json); 
                });
            }
        });
    });



    //---------------------------------- album ------------------------------------//
    //创建相册
    app.post('/createAlbum', function(req, res){
        var name=req.body.name;
        if(!name){
            res.send({"status":"sorry","message":"参数不完整!"});
            return ;
        }
        if(checkLogind(req,res)){
            var jsonReq={};
                jsonReq.name=name;
                jsonReq.userId=req.session.userId;
            ctrl.Album.createAlbum(jsonReq,function(err,result){
                if(err){
                    res.send({"status":"error","message":err})
                    return;
                }
                if(result){
                    res.send({"status":"ok","id":result._id});
                }else{
                    res.send({"status":"sorry"});
                };
            }); 
        }
    });
    
    //获取相册列表
    app.post('/getAlbumList', function(req, res){
        if(checkLogind(req,res)){
            var jsonReq={};
                jsonReq.userId=req.session.userId;
            ctrl.Album.getAlbumList(jsonReq,function(err,result){
                if(err){
                    res.send({"status":"error","message":err})
                    return;
                }
                if(result){
                    res.send({"status":"ok","data":result});
                }else{
                    res.send({"status":"sorry"});
                };
            }); 
        }
    });

    //删除相册
    app.post('/removeAlbum', function(req, res){
        var jsonReq={};
            jsonReq.albumId=req.body.albumId;
            jsonReq.userId=req.session.userId;
        if(checkLogind(req,res)){
            ctrl.Album.removeAlbum(jsonReq,function(err,result){
                if(err){
                    res.send({"status":"error","message":err})
                    return;
                }
                if(result){
                    res.send({"status":"ok","data":result});
                }else{
                    res.send({"status":"sorry"});
                };
            }); 
        }
    });
    
    //删除相册
    app.post('/changeAlbum', function(req, res){
        var jsonReq={};
            jsonReq.albumId=req.body.albumId;
            jsonReq.userId=req.session.userId;
            jsonReq.name=req.body.name;
        if(checkLogind(req,res)){
            ctrl.Album.changeAlbum(jsonReq,function(err,result){
                if(err){
                    res.send({"status":"error","message":err})
                    return;
                }
                if(result){
                    res.send({"status":"ok","data":result});
                }else{
                    res.send({"status":"sorry"});
                };
            }); 
        }
    });

    app.post("/uploadPhotoToAlbum",function(req,res){
        var jsonReq={};
        jsonReq.files=req.files.files;
        jsonReq.albumId=req.body.albumId;
        jsonReq.userId=req.session.userId;
        if(checkLogind(req,res)){
            ctrl.Album.uploadPhotoToAlbum(jsonReq,function(err,result){
                if(err){
                    res.send({"status":"error","message":err})
                    return;
                }
                if(result){
                    res.send({"status":"ok","data":result});      
                }else{
                    res.send({"status":"sorry"});      
                }
            });
        };
    });

    app.post("/deleteOnePhotoFromAlbum",function(req,res){
        var jsonReq={};
        jsonReq.albumId=req.body.albumId;
        jsonReq.userId=req.session.userId;
        jsonReq.fileId=req.body.fileId;
        if(checkLogind(req,res)){
            ctrl.Album.deleteOnePhotoFromAlbum(jsonReq,function(err,result){
                if(err){
                    res.send({"status":"error","message":err})
                    return;
                }
                if(result){
                    res.send({"status":"ok"});      
                }else{
                    res.send({"status":"sorry"});      
                }
            });
        };
    });


    app.post("/getPhotosFromAlbum",function(req,res){
        var jsonReq={};
        jsonReq.albumId=req.body.albumId;
        jsonReq.userId=req.session.userId;
        if(checkLogind(req,res)){
            ctrl.Album.getPhotosFromAlbum(jsonReq,function(err,result){
                if(err){
                    res.send({"status":"error","message":err})
                    return;
                }
                if(result){
                    res.send({"status":"ok","data":result});      
                }else{
                    res.send({"status":"sorry"});      
                }
            });
        };
    });


    //-------------------------------------  album end --------------------------------//

}
exports.initApp=function(app){
    setApp(app);
}























