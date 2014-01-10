var db=require("../../db");
var parse=require("./common").parse;
var Images=require("./images");
var getPool=db.Common.getPool;
var poolMain=getPool("main");
var Thumbnail=require("./thumbnail");

//

var createAlbum=function(jsonReq,callback){
    poolMain.acquire(function(err,database){
        jsonReq.database=database;
        db.Album.createAlbum(jsonReq,function(err,result){
            if(err){ poolMain.release(database); return callback(err) };
            poolMain.release(database);
            callback(err,result);
        });
    });

}

var getAlbumList=function(jsonReq,callback){
    poolMain.acquire(function(err,database){
        jsonReq.database=database;
        db.Album.getAlbumList(jsonReq,function(err,resultAry){
            if(err){ poolMain.release(database); return callback(err) };
            var resAry=[];
            for(var i=0;i<resultAry.length;i++){
                var tempObj=resultAry[i];
                var resObj={};
                    resObj.count=tempObj.photos?tempObj.photos.length:0;
                    resObj.img=tempObj.photos&&tempObj.photos.length>0?tempObj.photos[0].id:"none";
                    resObj._id=tempObj._id;
                    resObj.name=tempObj.name;
                    resAry.push(resObj);
            } 
            poolMain.release(database);
            callback(err,resAry);
        });
    });
}

var removeAlbum=function(jsonReq,callback){
    poolMain.acquire(function(err,database){
        jsonReq.database=database;
        getPhotosFromAlbum(jsonReq,function(err,result){
            if(result&&result.photos&&result.photos.length>0){
                jsonReq.photoIdAry=result.photos;
                deletePhotosFromAlbum(jsonReq,function(err,failAry){
                    if(failAry.length>0){
                        console.log("delete Album error fail list",failAry);
                        poolMain.release(database);
                        callback("delete image error",failAry); 
                    }else{
                        _removeAlbum(jsonReq,callback);     
                    }
                });
            }else{
                console.log("album no image");
                _removeAlbum(jsonReq,callback);     
            }
        });
        function _removeAlbum(jsonReq,callback){
            db.Album.removeAlbum(jsonReq,function(err,result){
                poolMain.release(database);
                if(err){ poolMain.release(database); return callback(err) };
                callback(err,result);
            });
        }
    });
}

var changeAlbum=function(jsonReq,callback){
    poolMain.acquire(function(err,database){
        jsonReq.database=database;
        db.Album.changeAlbum(jsonReq,function(err,result){
            if(err){ poolMain.release(database); return callback(err) };
            poolMain.release(database);
            callback(err,result);
        });
    });
}

//
//------------- album list
//
var uploadPhotoToAlbum=function(jsonReq,callback){
    poolMain.acquire(function(err,database){
        jsonReq.database=database;
        db.Album.checkAlbumAuth(jsonReq,function(err,result){
            if(result){
                jsonReq.img=Thumbnail.getImagesSize(jsonReq.files[0]);
                Images.uploadOriginImage(jsonReq,function(err,fileId){
                    if(err){
                        poolMain.release(database);
                        return callback(err);
                    }
                    jsonReq.fileId=fileId;
                    jsonReq.database=database;
                    //把添加的图片Id添加到imagesLib中；
                    db.Album.addPhotoIdToAlbum(jsonReq,function(err,result){
                        poolMain.release(database);
                        if(err){
                            return callback(err);
                        }
                        result.img=jsonReq.img;
                        callback(err,result);
                    });
                });       
                
            }else{
                poolMain.release(database);
                callback(err,result);
            }
        });
        return;
    });
}
//删除多个照片
var deletePhotosFromAlbum=function(jsonReq,callback){
    poolMain.acquire(function(err,database){
        jsonReq.database=database;
        var photoIdAry=jsonReq.photoIdAry;
        var length=photoIdAry.length;
        var count=0;
        var failAry=[];
        for(var i=0;i<length;i++){
            var temp={};
            //不能多次使用同一个jsonReq对象，所以clone一下
            for(var key in jsonReq){
                temp[key]=jsonReq[key];
            }
            temp.fileId=photoIdAry[i].id;
            remove(temp,function(err,result,fileId){
                 count++;
                 if(!result){
                    failAry.push(fileId);
                 }
                 console.log(count,result);
                 if(count==length){
                    callback(null,failAry);
                    poolMain.release(database);
                 }
            });
        }
        function remove(jsonReq,callback){
            db.Album.checkAlbumAuth(jsonReq,function(err,result){
                if(result){
                    Images.deleteOriginImage(jsonReq,function(err,fileId){
                        if(err){ poolMain.release(database); return callback(err)}
                        db.Album.deletePhotoIdFromAlbum(jsonReq,function(err,result){
                            callback(err,result);
                            Thumbnail.removeThumbnailByOriginId(jsonReq);
                        });
                    });
                }else{
                    callback(err,result,jsonReq.fileId);
                }
            });
        }
    }); 
}


var deleteOnePhotoFromAlbum=function(jsonReq,callback){
    poolMain.acquire(function(err,database){
        jsonReq.database=database;
        db.Album.checkAlbumAuth(jsonReq,function(err,result){
            if(result){
                Images.deleteOriginImage(jsonReq,function(err,fileId){
                    if(err){ poolMain.release(database); return callback(err)}
                    db.Album.deletePhotoIdFromAlbum(jsonReq,function(err,result){
                        poolMain.release(database);
                        callback(err,result);
                        Thumbnail.removeThumbnailByOriginId(jsonReq);
                    });
                });
            }else{
                poolMain.release(database);
                callback(err,result);
            }
        });
    }); 
}

var getPhotosFromAlbum=function(jsonReq,callback){
    poolMain.acquire(function(err,database){
        jsonReq.database=database;
        db.Album.getPhotosFromAlbum(jsonReq,function(err,result){
            poolMain.release(database);
            if(err){return callback(err) };
            callback(err,result);
        });
    });
}




exports.createAlbum=createAlbum;
exports.getAlbumList=getAlbumList;
exports.removeAlbum=removeAlbum;
exports.changeAlbum=changeAlbum;
exports.uploadPhotoToAlbum=uploadPhotoToAlbum;
exports.getPhotosFromAlbum=getPhotosFromAlbum;
exports.deleteOnePhotoFromAlbum=deleteOnePhotoFromAlbum;
exports.deletePhotosFromAlbum=deletePhotosFromAlbum;
