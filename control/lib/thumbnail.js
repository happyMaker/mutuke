var db=require("../../db");
var Images=require("./images");
var fs=require("fs");
var Canvas=require("canvas");
    var Image=Canvas.Image;
var getPool=db.Common.getPool;
var poolMain=getPool("main");
var poolThumbnail=getPool("thumbnail");

//获取缩略图
var _getThumbnailImage=function(jsonReq,callback){
    poolThumbnail.acquire(function(err,database){
        jsonReq.database=database;
        jsonReq.queryObj={
            "metadata.size":jsonReq.size,
            "metadata.originalImageId":jsonReq.fileId,
            "metadata.type":jsonReq.imageType
        }
        db.Images.getImageInfo(jsonReq,function(err,imageInfo){
            if(err){
                poolThumbnail.release(database);
                return callback(err)
            };
            if(!(imageInfo&&imageInfo[0])){
                poolThumbnail.release(database);
                return _getOriginalImageAndCrop(jsonReq,function(err,buf){
                    callback(err,buf);
                }); 
            }
            var id=imageInfo[0]["_id"];
            jsonReq.fileId=id;
            //在缩略图数据库中获取图片
            db.Images.getImage(jsonReq,function(err,buf){
                poolThumbnail.release(database);
                if(err){return callback(err)};
                if(buf){
                    console.log("cache");
                    callback(err,buf);
                }else{
                    console.log("crop");
                    _getOriginalImageAndCrop(jsonReq,function(err,buf){
                        callback(err,buf);
                    }); 
                }
            });
        });
    });
};

//把缩略图插入本地数据库
var _insertThumbnailToDB=function(jsonReq,callback){
    poolThumbnail.acquire(function(err,database){
        jsonReq.database=database;
        jsonReq.attr={
            "metadata":{
                "originalImageId":jsonReq.fileId,
                "size":jsonReq.size,
                "type":jsonReq.imageType
            }
        }
        db.Images.uploadBuffer(jsonReq,function(err,result){
            poolThumbnail.release(database);
            callback(err,result);
        });
    });
}


//
var removeThumbnailByOriginId=function(jsonReq){
    poolThumbnail.acquire(function(err,database){
        jsonReq.database=database;
        jsonReq.queryObj={
            "metadata.originalImageId":jsonReq.fileId
        }
        db.Images.getImageInfo(jsonReq,function(err,imageInfo){
            poolThumbnail.release(database);
            var l=imageInfo.length;
            var z=0;
            for(var i=0;i<l;i++){
                jsonReq.fileId=imageInfo[i]["_id"];
                Images.deleteOriginImage(jsonReq,function(err,result){
                    z++;
                    console.log("remove a thumbnail");
                    if(z==l){
                        console.log("remove all thumb");
                    }
                });
            }
        });
    });
}




//获取原始图片
var _getOriginalImageAndCrop=function(jsonReq,callback){
    Images.getOriginImage(jsonReq,function(err,buf){
            if(err){return callback(err)};
            jsonReq.buf=buf;
            _crop(jsonReq,function(err,cropBuf){
                if(err){return callback(err)};
                callback(err,cropBuf);
                jsonReq.buf=cropBuf;
                _insertThumbnailToDB(jsonReq,function(err,doc){
                    console.log(err,"create a new Thu image");
                });
            });
        });
}
//压缩图片
function _crop(jsonReq,callback){
    var buf=jsonReq.buf;
    var size=parseInt(jsonReq.size)||100;
    var img=new Image;
        img.src=buf;
    var w=img.width, 
        h=img.height;
    var smallH,smallW;
        if(jsonReq.imageType=="fill"){
            var canvas=new Canvas(size,size);
            var ctx=canvas.getContext("2d");
            if(w>h){
                smallH=size;
                smallW=(size/h)*w;
                ctx.drawImage(img,-(smallW-size)/2,0,smallW,smallH);
            }else{
                smallW=size;
                smallH=(size/w)*h;
                ctx.drawImage(img,0,-(smallH-size)/2,smallW,smallH);
            }
        }else{
            if(w>h){
                smallW=size;
                smallH=(size/w)*h;
            }else{
                smallH=size;
                smallW=(size/h)*w;
            }
            var canvas=new Canvas(smallW,smallH);
            var ctx=canvas.getContext("2d");
            ctx.drawImage(img,0,0,smallW,smallH);
        }
        //canvas.toBuffer(callback);
        /*
        ctx.fillStyle = "#fff";
        ctx.font ='bold 20px Arial';
        ctx.fillText("PICONLINE",canvas.width-100,canvas.height-50);
        */

        save1(canvas,callback);
}


function testFs(buf){
    var canvas=new Canvas(100,100);
    var img=new Image;
        img.src=buf;
    var ctx=canvas.getContext("2d");
        ctx.drawImage(img,0,0,50,50);
}
function save1(canvas,callback){
    var stream = canvas.createJPEGStream({
              bufsize : 204800,
              quality :90 
        });
    var length=0;
    var chunkAry=[];
    stream.on('data', function(chunk){
        length+=chunk.length;
        chunkAry.push(chunk);
    });

    stream.on('end', function(){
        var buf=new Buffer(length);
        for(var i=0;i<chunkAry.length;i++){
            if(i==0){
                chunkAry[i].copy(buf,0);
            }else{
                chunkAry[i].copy(buf,chunkAry[i-1].length);
            }
        }
        callback(null,buf);
    });
}

function save2(canvas){
    var out = fs.createWriteStream(__dirname + '/zcropt1.png');
    var stream = canvas.createPNGStream({
              bufsize : 2048,
              quality : 10
            });
        stream.pipe(out);
}

function _cropImage(){
}


exports.getImagesSize=function(file){
    var img=new Image;
        img.src=file.path;
        var size={"width":img.width,"height":img.height};
        return size;
}
exports.getThumbnailImage=_getThumbnailImage;
exports.removeThumbnailByOriginId=removeThumbnailByOriginId;
