var Common=require("./common");
var Product=require("./product");
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
                col.update( {"_id":oid,"cusInfoId":cid,"products._id":pid},{ "$inc":{"products.$.count":1}},function(err,item){
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
    var oid=_createObjectId(jsonReq.orderId);
    var cid=_createObjectId(jsonReq.cusInfoId);
    console.log(cid);
    if(!(oid)){return callback("create object Id error");}
    var col=database.collection("order");
        col.findOne({"_id":oid,"cusInfoId":cid},{"products":1},function(err,result){
            if(result){
                return callback(err,result.products);
            }
            callback(err,null);
        });
}

function getProductFromOrder(jsonReq,callback){
    var database=jsonReq.database;
    var cid=_createObjectId(jsonReq.cusInfoId);
    var oid=_createObjectId(jsonReq.orderId);
    var pid=_createObjectId(jsonReq.productId);
    var col=database.collection("order");
        col.findOne({"_id":oid,"cusInfoId":cid,"products._id":pid},function(err,doc){
            if(!doc){
               return callback(err,null);
            }
            var ary=doc.products;
            for(var i=0,l=ary.length;i<l;i++){
                if(ary[i]["_id"]==pid.toString()){
                    return callback(err,ary[i]);
                }
            }
                callback(err,null);
        });

}

function subProductFromOrder(jsonReq,callback){
    var database=jsonReq.database;
    var cid=_createObjectId(jsonReq.cusInfoId);
    var oid=_createObjectId(jsonReq.orderId);
    var pid=_createObjectId(jsonReq.productId);
    if(!(cid&&pid)){return callback("create object Id error");}
    var col=database.collection("order");
        getProductFromOrder(jsonReq,function(err,doc){
            if(!doc){return callback("no product")};
           if(doc.count&&doc.count>1){
                col.update({"_id":oid,"cusInfoId":cid,"products._id":pid},{ "$inc":{"products.$.count":-1}},function(err,item){
                    callback(err,item);
                });
           }else if(doc.count&&doc.count==1){
               removeProductFromOrder(jsonReq,function(err,result){
                   callback(err,result);
               });
           }
        });
}
//删除用户绑定的product
function removeProductFromOrder(jsonReq,callback){
    var database=jsonReq.database;
    var cid=_createObjectId(jsonReq.cusInfoId);
    var oid=_createObjectId(jsonReq.orderId);
    var pid=_createObjectId(jsonReq.productId);
    if(!(cid&&pid)){return callback("create object Id error");}
    var col=database.collection("order");
        col.update({"_id":oid,"cusInfoId":cid},{$pull:{products:{"_id":pid}}},function(err,result){
            callback(err,result);
        });
}

exports.addOrder=addOrder;
exports.getOrderList=getOrderList;
exports.addProductToOrder=addProductToOrder;
exports.getProductsFromOrder=getProductsFromOrder;
exports.removeProductFromOrder=removeProductFromOrder;
exports.subProductFromOrder=subProductFromOrder;
