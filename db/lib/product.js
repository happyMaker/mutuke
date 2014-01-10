var Common=require("./common");
var mongodb=require("mongodb"),
    objectId=mongodb.ObjectID;

    var _createObjectId=Common.createObjectId;

function checkProductDocExist(jsonReq,callback){
    var database=jsonReq.database;
    var studioId=jsonReq.studioId;
    var col=database.collection("productList");
    col.findOne({"studioId":studioId},function(err,result){
        callback(err,result);
    });
}

function AddRowToProductList(jsonReq,callback){
    var database=jsonReq.database;
    var studioId=jsonReq.studioId;
    var uid=_createObjectId(jsonReq.userId);
    var col=database.collection("productList");
        col.insert({"studioId":studioId,userId:uid,products:[]},function(err,doc){
           callback(err,doc); 
        });
};

//创建产品
function addProductToList(jsonReq,callback){
    var database=jsonReq.database;
    var name=jsonReq.name;
    var studioId=jsonReq.studioId;
    var col=database.collection("productList");
    var _id=new objectId();
        col.update({"studioId":studioId},{$addToSet:{products:{$each:[{"_id":_id,"name":name,"imgCount":1}]}}},{w:1},function(err){
            callback(err,_id);
        });
}

function removeProductFromList(jsonReq,callback){
    var database=jsonReq.database;
    var name=jsonReq.name;
    var studioId=jsonReq.studioId;
    var col=database.collection("productList");
    var pid=_createObjectId(jsonReq.productId);
        col.update({"studioId":studioId},{$pull:{products:{"_id":pid}}},function(err,result){
            callback(err,result);
        });
}


function getProductById(jsonReq,callback){
    var database=jsonReq.database,
        userId=jsonReq.userId,
        productId=jsonReq.productId;
    var studioId=jsonReq.studioId;
    var uid=_createObjectId(userId);
    var pid=_createObjectId(productId);
    var col=database.collection("productList");
        col.findOne({"studioId":studioId,"products._id":pid},function(err,doc){
            var ary=doc.products;
            for(var i=0,l=ary.length;i<l;i++){
                if(ary[i]["_id"]==pid.toString()){
                    return callback(err,ary[i]);
                }
            }
            callback(err,null);
        });

}

//
function getProductsByUserId(jsonReq,callback){
    var database=jsonReq.database;
    var studioId=jsonReq.studioId;
    var col=database.collection("productList");
        //col.find({"cusInfoId":cid}).toArray(function(err,itemArray){
        col.findOne({"studioId":studioId},{},function(err,itemArray){
            if(itemArray){
                return callback(err,itemArray.products);
            }
            callback(err,[]);
        });
}


//修改产品
function changeProduct(jsonReq,callback){
    var database=jsonReq.database;
    var studioId=jsonReq.studioId;
    var name=jsonReq.name,
        userId=jsonReq.userId,
        base64Img=jsonReq.base64Img||null,
        imgPath=jsonReq.imgPath||null,
        size=jsonReq.size,
        price=jsonReq.price,
        productId=jsonReq.productId,
        description=jsonReq.description;
        imgCount=jsonReq.imgCount;
    var pid=_createObjectId(productId);
    var uid=_createObjectId(userId);
        if(!(uid&&pid)){return callback("create objectId err db/lib/products changeParoduct")}
    var col=database.collection("productList");
    var setObject={};
        base64Img?setObject["products.$.base64Img"]=base64Img:"";
        imgCount?setObject["products.$.imgCount"]=imgCount:"";
        name?setObject["products.$.name"]=name:"";
        imgPath?setObject["products.$.imgPath"]=imgPath:"";
        size?setObject["products.$.size"]=size:"";
        price?setObject["products.$.price"]=price:"";
        description?setObject["products.$.description"]=description:"";
        col.update({"studioId":studioId,"products._id":pid},{ "$set":setObject },function(err,item){
            callback(err,item);
        });
}


exports.addProductToList=addProductToList;
exports.getProductsByUserId=getProductsByUserId;
exports.checkProductDocExist=checkProductDocExist;
exports.AddRowToProductList=AddRowToProductList;
exports.changeProduct=changeProduct;
exports.getProductById=getProductById;
exports.removeProductFromList=removeProductFromList;
