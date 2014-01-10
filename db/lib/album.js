var Common=require("./common");
var mongodb=require("mongodb"),
    objectId=mongodb.ObjectID;

    var _createObjectId=Common.createObjectId;
//
//--- album list
//
    //当前用户创建一个相册
    var createAlbum=function(jsonReq,callback){
        var database=jsonReq.database;
        var uid= _createObjectId(jsonReq.userId);
        var name=jsonReq.name;
        var date=new Date();
        var dateStr=date.getYear()+"-"+date.getMonth()+"-"+date.getDate();
            if(!uid){return callback("err")};
        var col=database.collection("album");
        var date=new Date().toISOString();
            col.insert({"userId":uid,"name":name,"createDate":date},function(err,docAry){
                if(docAry){
                    callback(err,docAry[0]); 
                }else{
                    callback(err,null);
                }
            });
    };


    var getAlbumList=function(jsonReq,callback){
        var database=jsonReq.database; 
        var uid= _createObjectId(jsonReq.userId);
            if(!uid){return callback("err")};
        var col=database.collection("album");
            col.find({"userId":uid},{"userId":0}).toArray(function(err,docAry){
                callback(err,docAry);
            });
    }

    var removeAlbum=function(jsonReq,callback){
        var database=jsonReq.database; 
        var uid= _createObjectId(jsonReq.userId);
        var albumId= _createObjectId(jsonReq.albumId);
            if(!(uid&&albumId)){return callback("err")};
        var col=database.collection("album");
            col.remove({"_id":albumId,"userId":uid},function(err,result){
                callback(err,result);
            });
    }
    

    var changeAlbum=function(jsonReq,callback){
        var database=jsonReq.database; 
        var name=jsonReq.name;
        var uid= _createObjectId(jsonReq.userId);
        var albumId= _createObjectId(jsonReq.albumId);
            if(!(uid&&albumId)){return callback("err")};
        var col=database.collection("album");
            col.update({"_id":albumId,"userId":uid},{"$set":{"name":name}},function(err,result){
                callback(err,result);
            });
    }
    
//
//--- album list
//

    var getPhotosFromAlbum=function(jsonReq,callback){
        var database=jsonReq.database; 
        var name=jsonReq.name;
        var uid= _createObjectId(jsonReq.userId);
        var albumId= _createObjectId(jsonReq.albumId);
            if(!(uid&&albumId)){return callback("err")};
        var col=database.collection("album");
            col.findOne({"_id":albumId,"userId":uid},{"name":1,"photos":1},function(err,doc){
                callback(err,doc);
            });
    }

    var addPhotoIdToAlbum=function(jsonReq,callback){
        var database=jsonReq.database; 
        var name=jsonReq.name;
        var fileId=jsonReq.fileId;
        var width=jsonReq.img.width;
        var height=jsonReq.img.height;
        var uid= _createObjectId(jsonReq.userId);
        var albumId= _createObjectId(jsonReq.albumId);
            if(!(uid&&albumId)){return callback("err")};
        var col=database.collection("album");
            col.update({"_id":albumId,"userId":uid},{"$addToSet":{"photos":{"id":fileId,width:width,height:height}}},function(err,doc){
                if(doc){
                    callback(err,{"fileId":fileId});
                }else{
                    callback(err,null);
                }
            });
         
    }

    var deletePhotoIdFromAlbum=function(jsonReq,callback){
        var database=jsonReq.database; 
        var uid= _createObjectId(jsonReq.userId);
        var albumId= _createObjectId(jsonReq.albumId);
        var fileId=_createObjectId(jsonReq.fileId);
            if(!(uid&&albumId)){return callback("err")};
        var col=database.collection("album");
            col.update({"_id":albumId,"userId":uid},{$pull:{photos:{"id":fileId}}},function(err,result){
                callback(err,result);
            });
    }

    var checkAlbumAuth=function(jsonReq,callback){
        var database=jsonReq.database; 
        var name=jsonReq.name;
        var uid= _createObjectId(jsonReq.userId);
        var albumId= _createObjectId(jsonReq.albumId);
            if(!(uid&&albumId)){return callback("err")};
        var col=database.collection("album");
            col.findOne({"_id":albumId,"userId":uid},{"photos":0},function(err,doc){
                callback(err,doc);
            });
    }

    var checkPhotoInAlbum=function(jsonReq,callback){
        var database=jsonReq.database; 
        var name=jsonReq.name;
        var uid= _createObjectId(jsonReq.userId);
        var fid= _createObjectId(jsonReq.fileId);
        var albumId= _createObjectId(jsonReq.albumId);
            if(!(uid&&albumId&&fid)){return callback("err")};
        var col=database.collection("album");
            col.findOne({"_id":albumId,"userId":uid,"photos.id":fid},{"id":1},function(err,doc){
                callback(err,doc);
            });
    }



exports.createAlbum=createAlbum;
exports.getAlbumList=getAlbumList;
exports.removeAlbum=removeAlbum;
exports.changeAlbum=changeAlbum;
exports.checkAlbumAuth=checkAlbumAuth;
exports.addPhotoIdToAlbum=addPhotoIdToAlbum;
exports.getPhotosFromAlbum=getPhotosFromAlbum;
exports.checkPhotoInAlbum=checkPhotoInAlbum;
exports.deletePhotoIdFromAlbum=deletePhotoIdFromAlbum;
