var Common=require("./common");
var mongodb=require("mongodb"),
    objectId=mongodb.ObjectID;

    var _createObjectId=Common.createObjectId;

var addOrder=function(jsonReq,callback){
        var database=jsonReq.database;
        var uid= _createObjectId(jsonReq.userId);
        var name=jsonReq.name;
        var cusInfoId=_createObjectId(jsonReq.cusInfoId);
        var date=new Date();
        var dateStr=date.getYear()+"-"+date.getMonth()+"-"+date.getDate();
            if(!uid){return callback("err")};
        var col=database.collection("order");
        var date=new Date().toISOString();
            col.insert({"studioId":jsonReq.studioId,"userId":uid,"cusInfoId":cusInfoId,"createDate":date},function(err,docAry){
                if(docAry){
                    callback(err,docAry[0]); 
                }else{
                    callback(err,null);
                }
            });
};

var getOrderList=function(jsonReq,callback){
        var database=jsonReq.database;
        var cusInfoId=_createObjectId(jsonReq.cusInfoId);
        var col=database.collection("order");
        var date=new Date().toISOString();
            col.find({"cusInfoId":cusInfoId}).toArray(function(err,data){
                callback(err,data);
            });
};



//给用户绑定product
function addProductToOrder(jsonReq,callback){
    var database=jsonReq.database;
    var cid=_createObjectId(jsonReq.cusInfoId);
    var oid=_createObjectId(jsonReq.orderId);
    var pid=_createObjectId(jsonReq.productId);

    if(!(cid&&pid)){return callback("create object Id error");}
    var col=database.collection("order");
        col.findOne({"_id":oid,"cusInfoId":cid,"products._id":pid},function(err,doc){
            if(doc){
                col.update( {"_id":cid,"products._id":pid},{ "$inc":{"products.$.count":1}},function(err,item){
                    callback(err,item);
                });
            }else{
                Product.getProductById(jsonReq,function(err,doc){
                    var productObj=doc;
                        productObj.count=1;
                        col.update({"_id":oid,"cusInfoId":cid},{$addToSet:{products:{$each:[productObj]}}},function(err,result){
                            callback(err,result);
                        });
                });
            }
        });
}

function getProductsFromOrder(jsonReq,callback){
    var database=jsonReq.database;
    var cid=_createObjectId(jsonReq.orderId);
    if(!(cid)){return callback("create object Id error");}
    var col=database.collection("order");
        col.findOne({"_id":cid},{"products":1},function(err,result){
            if(result){
                return callback(err,result.products);
            }
            callback(err,null);
        });
}

exports.addOrder=addOrder;
exports.getOrderList=getOrderList;
exports.addProductToOrder=addProductToOrder;
exports.getProductsFromOrder=getProductsFromOrder;

