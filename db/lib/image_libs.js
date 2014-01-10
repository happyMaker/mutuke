var Common=require("./common");
var mongodb=require("mongodb"),
    objectId=mongodb.ObjectID;

    var _createObjectId=Common.createObjectId;

    var _addImageIdToLibs=function(jsonReq,callback){
        var database=jsonReq.database;
        var userId=jsonReq.userId;
        var cusInfoId=jsonReq.cusInfoId;
        var fileId=jsonReq.fileId;
            cusInfoId= _createObjectId(cusInfoId);
            userId= _createObjectId(userId);
            if(!(userId&&cusInfoId)){return callback("err")};
        var filename=jsonReq.files[0].name;
    //    var col=database.collection("image_libs");
        var col=database.collection("customerInfo");
            col.update({"_id":cusInfoId},{$addToSet:{images:{$each:[{"fileId":fileId,"filename":filename,"width":jsonReq.img.width,"height":jsonReq.img.height}]}}},{w:1},function(err,doc){
                    callback(err,doc);
                });
    };

    //通过 cusInfoId 获取 图片列表；
    var getCustomerImages=function(jsonReq,callback){
        var database=jsonReq.database;
        var userId=jsonReq.userId;
        var cusInfoId=jsonReq.cusInfoId;
        var cid= _createObjectId(cusInfoId);
        if(!cid){return callback("err")};
        var col=database.collection("customerInfo");
            col.findOne({"_id":cid},{"_id":0,"images":1},function(err,doc){
                console.log(doc,"fefe");
                if(doc){
                  callback(err,doc.images);    
                }else{
                  callback(err,null);    
                };
            });
    }

    var checkImageInCustomer=function(jsonReq,callback){
        var database=jsonReq.database;    
        var cid=_createObjectId(jsonReq.cusInfoId);
        var fid=_createObjectId(jsonReq.fileId);
            if(!(fid&&cid)){return callback("err")};
        var col=database.collection("customerInfo");
            col.findOne({"_id":cid,"images":{$elemMatch:{"fileId":fid}}},function(err,doc){
               if(err){return callback(err)} 
               callback(err,doc);
            });
    }    

    var removeImageFromImagelibs=function(jsonReq,callback){
       var database=jsonReq.database; 
        var userId=jsonReq.userId;
        var cid= _createObjectId(jsonReq.cusInfoId);
        var fid= _createObjectId(jsonReq.fileId);
        if(!(cid&&fid)){return callback("err")};
        var col=database.collection("customerInfo");
            col.update({"_id":cid},{$pull:{images:{"fileId":fid}}},function(err,result){
                if(err){return callback(err)} 
                callback(err,result);
            });
    }

exports.addImageIdToLibs=_addImageIdToLibs;
exports.getCustomerImages=getCustomerImages;
exports.checkImageInCustomer=checkImageInCustomer;
exports.removeImageFromImagelibs=removeImageFromImagelibs;
