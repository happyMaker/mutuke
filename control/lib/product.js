var db=require("../../db");
var Images=require("./images");
var parse=db.Common.parse;
var Type=db.Common.Type;
var getPool=db.Common.getPool;
var poolMain=getPool("main");
var fs = require('fs');

//添加一个Product
function addProduct(jsonReq,_callback){
    poolMain.acquire(function(err,database){
        jsonReq.database=database;
        //查看产品列表 productList 中是否存在 此userId的doc；如果有，直接插入，如没有，创建后插入；
        db.Product.checkProductDocExist(jsonReq,function(err,result){
            if(result==null){
                db.Product.AddRowToProductList(jsonReq,function(err,callback){
                    _addProduct(jsonReq,_callback);
                });
            }else{
                _addProduct(jsonReq,_callback);
            }
        });

        function _addProduct(err,callback){
           db.Product.addProductToList(jsonReq,function(err,id){
                poolMain.release(database);
                callback(err,id); 
           });
        }
   });
}

function removeProduct(jsonReq,callback){
    poolMain.acquire(function(err,database){
        jsonReq.database=database;
        //查看产品列表 productList 中是否存在 此userId的doc；如果有，直接插入，如没有，创建后插入；
       db.Product.removeProductFromList(jsonReq,function(err,id){
            poolMain.release(database);
            callback(err,id); 
       });
   });
}
/*
function uploadProductHeadImage(jsonReq,callback){
    poolMain.acquire(function(err,database){
        jsonReq.database=database;
            var file=jsonReq.files[0];
            fs.readFile(file.path, 'binary', function(err, original_data){
                var base64Image = new Buffer(original_data, 'binary').toString('base64');
                var decodedImage = new Buffer(base64Image, 'base64');//.toString('binary');
                //console.log(decodedImage);
                jsonReq.imgPath=base64Image;
                db.Product.changeProduct(jsonReq,function(err,result){
                    callback(err,result);    
                    poolMain.release(database);
                });
            });
    });
}
*/
function uploadProductHeadImage(jsonReq,callback){
    poolMain.acquire(function(err,database){
        jsonReq.database=database;
        db.Product.getProductById(jsonReq,function(err,productObj){
            if(err){return callback(err)};
            if(productObj&&productObj.imgPath){
                jsonReq.fileId=productObj.imgPath;
                Images.deleteOriginImage(jsonReq,function(err,result){
                    if(err){return callback(err)} 
                    uploadImg(jsonReq,callback);
                })
            }else{
                uploadImg(jsonReq,callback);
            };
        });
        function uploadImg(jsonReq,callback){
            jsonReq.attr={
                "metadata":{
                    property:"public"
                }
            }
            Images.uploadOriginImage(jsonReq,function(err,_id){
                jsonReq.database=database;
                jsonReq.imgPath=_id;
                jsonReq.fileId=_id;
                //a thumbnail image base64 str insert to customer products
                jsonReq.size=180;
                Images.getPublicImage(jsonReq,function(err,buf){
                    jsonReq.base64Img= new Buffer(buf, 'binary').toString('base64');
                    jsonReq.database=database;
                    db.Product.changeProduct(jsonReq,function(err,result){
                        callback(err,_id);    
                        poolMain.release(database);
                    });
                });
            });
        }
    });
} 

function getProductsByUserId(jsonReq,callback){
    poolMain.acquire(function(err,database){
        jsonReq.database=database;
        db.Product.getProductsByUserId(jsonReq,function(err,doc){
            poolMain.release(database);
           if(doc){
                callback(err,doc); 
           }else{
                callback(err,null); 
           }
       });
   });
}

function changeProduct(jsonReq,callback){
    poolMain.acquire(function(err,database){
        jsonReq.database=database;
        db.Product.changeProduct(jsonReq,function(err,result){
            callback(err,result);  
            poolMain.release(database);
        });
    });
};

exports.addProduct=addProduct;
exports.getProductsByUserId=getProductsByUserId;
exports.changeProduct=changeProduct;
exports.uploadProductHeadImage=uploadProductHeadImage;
exports.removeProduct=removeProduct;
