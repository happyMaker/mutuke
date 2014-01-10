var Common=require("./common");
var mongodb=require("mongodb"),
    objectId=mongodb.ObjectID,
    gridStore=mongodb.GridStore;
var fs = require('fs');

    var _createObjectId=Common.createObjectId;


var _getImageInfoById=function(jsonReq,callback){
    var database=jsonReq.database;
    var col=database.collection("fs.files");
    var id=_createObjectId(jsonReq.fileId);
    if(!id){return callback("error")}
        col.findOne({"_id":id},function(err,result){
            callback(err,result);
        });;

}

//images libs
var _getImageInfo=function(jsonReq,callback){
    var database=jsonReq.database;
    var col=database.collection("fs.files");
        var queryObj=jsonReq.queryObj;
        col.find(queryObj).toArray(function(err,result){
            callback(err,result);
        });

}
//通过Id读取图片
var _getImage=function(jsonReq,callback){
    var database=jsonReq.database;
    var fileId=jsonReq.fileId;
    var id= _createObjectId(fileId);
    if(!id){return callback("err")};
    var gs=new gridStore(database,id,"r");
        gs.open(function(err,gss){
            if(err){gs.close();return callback(err);};
            gs.read(function(err,doc){
                gs.close();
                callback(err,doc);
            });
        });
};

var _uploadBuffer=function(jsonReq,callback){
    var database=jsonReq.database;
    var oid=new objectId();
    var buf=jsonReq.buf;
    var attr=jsonReq.attr||{};
        attr.content_type="image/png";
        attr.chunkSize=jsonReq.buf.length;
    var gs=new gridStore(database,oid,"w",attr);
    gs.open(function(err,gss){
        gs.write(buf.toString("binary"),function(err,doc){
            if(err){return callback(err);}
            var fileId=doc.fileId;
            gs.close(function(err,result){
                callback(err,fileId);
            });
        });
    });
};
//上传图片，并且把图片ID存放到相应 图片库文件夹下
function uploadImage(jsonReq,callback){
    var database=jsonReq.database;
    var file=jsonReq.files[0];
    var attr=jsonReq.attr||{};
        attr.content_type="image/png";
        attr.chunkSize=file.size;
    var gs=new gridStore(database,new objectId(),"w",attr);
    gs.open(function(err,gs){
        gs.writeFile(file.path,function(err,doc){
            //删除临时文件
            fs.unlink(file.path, function (err) {
                  if (err) throw err;
                    console.log('successfully deleted /tmp/hello');
            });
            if(err){return callback(err);}
            var fileId=doc.fileId; 
            gs.close(function(err,result){
                callback(err,fileId);
            });
            //将图片 id 存入到 相应图片库下；
        });
    });
}


function deleteImage(jsonReq,callback){
    var database=jsonReq.database;
    var fileId=jsonReq.fileId; 
    var fid= _createObjectId(fileId);
    if(!fid){return callback("err")};
    gridStore.unlink(database,fid,function(err,result){
        callback(err,result);
    });
};

exports.uploadImage=uploadImage;
exports.uploadBuffer=_uploadBuffer;
exports.getImage=_getImage;
exports.getImageInfo=_getImageInfo;
exports.deleteImage=deleteImage;
exports.getImageInfoById=_getImageInfoById;
