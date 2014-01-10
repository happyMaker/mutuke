/*
 *control lib customer.js
 * */

var db=require("../../db");
var parse=db.Common.parse;
var Type=db.Common.Type;
var getPool=db.Common.getPool;
var poolMain=getPool("main");
var Thumbnail=require("./thumbnail");

function _getCustomerInfoIdByBindUserId(jsonReq,callback){
    poolMain.acquire(function(err,database){
        jsonReq.database=database;
        jsonReq.queryObj={
            bindUser:jsonReq.userId
        }
       db.Customer.getCustomerInfoData(jsonReq,function(err,doc){
            poolMain.release(database);
           if(doc){
                callback(err,doc["_id"]); 
           }else{
                callback(err,null); 
           }
       });
   });
}

//绑定用户到客户关系；
function _bindUser(jsonReq,callback){
    poolMain.acquire(function(err,database){
        jsonReq.database=database;
        db.Customer.bindUser(jsonReq,function(err,item){
            poolMain.release(database);
            callback(err,item);
        }); 
   }); 
};

//检测客户关系是否已经绑定过
function _checkBind(jsonReq,callback){
    poolMain.acquire(function(err,database){
        jsonReq.database=database;
        db.Customer.checkBind(jsonReq,function(err,item){
            poolMain.release(database);
            callback(err,item);
        }); 
   }); 
};

function _addCustomer(jsonReq,callback){
    poolMain.acquire(function(err,database){
        jsonReq.database=database;
        //创建图片库
        db.Customer.addCustomerInfo(jsonReq,function(err,result){
           jsonReq.cusInfoId=result.cusInfoId;
           jsonReq.imageLibId=result.imageLibId;
            poolMain.release(database);
            if(err){
                return callback(err);
            }
            callback(err,result);
       });
    });

};



//申请工作室
function _applyStudio(jsonReq,callback){
    poolMain.acquire(function(err,database){
        jsonReq.database=database;
        db.Users.getUserInfoById(jsonReq,function(err,doc){
            if(doc&&doc.studioId){
                poolMain.release(database);
                return callback(null,{"status":"sorry","message":"已经存在!","studioId":doc.studioId});
            }else{
                db.Customer.addStudio(jsonReq,function(err,result){
                    jsonReq.studioId=result;
                    db.Users.addStudioId(jsonReq,function(err,result){
                        poolMain.release(database);
                        callback(err,{"status":"ok","studioId":jsonReq.studioId}); 
                    });
                });
            }
        });
        return;
    });
}

//获取账户下所有客户
function _getCustomerList(jsonReq,callback){
    poolMain.acquire(function(err,database){
        jsonReq.database=database;
        db.Customer.getCustomerList(jsonReq,function(err,json){
            poolMain.release(database);
            if(err){
                return callback(err);
            }
            callback(err,json);
       }); 
    });
}
//搜索客户
function _searchCustomer(json,callback){
    poolMain.acquire(function(err,database){
        db.Customer.searchCustomer({
            database:database,
            "keyword":json.keyword
        },function(json){
            poolMain.release(database);
            if(err){
                return callback(err);
            }
            callback(json);
        });
    });
}




/**
 *product 
 */

function uploadSelectPhotoList(jsonReq,callback){
    poolMain.acquire(function(err,database){
        jsonReq.database=database;
            var objStr=jsonReq.objStr;
            var obj=JSON.parse(objStr);
            if(!obj){
                return callback("error object string");
            }
            var count=0;
            var length=0;
            for(var i in obj){
                length++;
            }
            for(var i in obj){
               jsonReq.productId=i; 
               jsonReq.photoAry=obj[i];
                db.Customer.uploadSelectPhotoList(jsonReq,function(err,result){
                    count++;  
                    if(err){
                        poolMain.release(database);
                        return callback("some one error");
                    }
                    if(count==length){
                        poolMain.release(database);
                        callback(err,{"status":"ok`"});
                    }
                });
            }
    });

}


//给用户绑定模板
function addProductToCustomer(jsonReq,callback){
    poolMain.acquire(function(err,database){
        jsonReq.database=database;
        db.Customer.getUserAndCustomerRelation(jsonReq,function(err,result){
            if(err){ poolMain.release(database); return callback(err) };
            if("creator"==result){
                db.Customer.addProductToCustomer(jsonReq,function(err,res){
                    poolMain.release(database);
                    callback(err,res);
                });
            }
        });
    });
}

function subProductFromCustomer(jsonReq,callback){
    poolMain.acquire(function(err,database){
        jsonReq.database=database;
        jsonReq.database=database;
        db.Customer.getUserAndCustomerRelation(jsonReq,function(err,result){
            if(err){ poolMain.release(database); return callback(err) };
            if("creator"==result){
                db.Customer.subProductFromCustomer(jsonReq,function(err,res){
                    poolMain.release(database);
                    callback(err,res);
                });
            }
        });
    });
};

//删除用户绑定的模板
function removeProductFromCustomer(jsonReq,callback){
    poolMain.acquire(function(err,database){
        jsonReq.database=database;
        db.Customer.getUserAndCustomerRelation(jsonReq,function(err,result){
            if(err){ poolMain.release(database); return callback(err) };
            if("creator"==result){
                db.Customer.removeProductFromCustomer(jsonReq,function(err,res){
                    poolMain.release(database);
                    callback(err,res);
                });
            }
        });
    });
}


function getSelects(jsonReq,callback){
    poolMain.acquire(function(err,database){
        jsonReq.database=database;
        db.Customer.getUserAndCustomerRelation(jsonReq,function(err,result,resJson){
            if("creator"!=result){
                poolMain.release(database);
                return callback("no auth");
            }
            db.Customer.getProductsFromCustomer(jsonReq,function(err,result){
                    poolMain.release(database);
                    if(err){return callback(err);};
                    callback(err,result);
            });
        });
    });
}


exports.addCustomer=_addCustomer;
exports.getCustomerList=_getCustomerList;
exports.searchCustomer=_searchCustomer;
exports.bindUser=_bindUser;
exports.checkBind=_checkBind;
exports.getCustomerInfoIdByBindUserId=_getCustomerInfoIdByBindUserId;
exports.addProductToCustomer=addProductToCustomer;
exports.removeProductFromCustomer=removeProductFromCustomer;
exports.subProductFromCustomer=subProductFromCustomer;
exports.uploadSelectPhotoList=uploadSelectPhotoList;
exports.getSelects=getSelects;
exports.applyStudio=_applyStudio;
