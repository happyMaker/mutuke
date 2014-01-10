var db=require("../../db");
var parse=require("./common").parse;
var getPool=db.Common.getPool;
var poolMain=getPool("main"); 
 
var getCustomerPermission=function(){

}
/*
**验证登录者和cusInfoId 的关系
**创建，绑定，none；
*/
function getUserAndCustomerRelation(jsonReq,callback){
    var database=jsonReq.database;
    var cusInfoId=jsonReq.cusInfoId;
    var userId=jsonReq.userId;
    var cid= _createObjectId(cusInfoId);
    var uid= _createObjectId(userId);
    if(!(cid&&uid)){return callback("err")};
    var col=database.collection("customerInfo");
        col.findOne({"_id":cid},function(err,doc){
            var ID;
            var uidStr=uid.toString();
            if(doc){
              if(doc.bindUser&&(uid.toString())==(doc.bindUser.toString())){
                    ID="binder";
                    callback(err,ID,{"userId":doc.userId});
              }else{
                var studioId=doc.studioId;
                var col=database.collection("studio");
                   var s= _createObjectId(studioId);
                    col.findOne({"_id":s},function(err,docc){
                        if(docc){
                           var admin=docc.userId;  
                           var managerAry=docc.manager;
                           if((admin.toString())==uidStr){
                                return callback(err,"creator",{"userId":uid});
                           }else{
                                if(managerAry){
                                    for(var i=0;i<managerAry.length;i++){
                                        var str= managerAry[i].userId.toString();
                                        if(str==uiStr){
                                            return callback(err,"manager");    
                                        }
                                    }
                                }
                           }
                        }else{
                            return callback(err,"none");    
                        }
                    });
              }
            }else{
                ID="none" 
                callback(err,ID);
            }
        });
}


/*
 *判断订单是否属于目前 工作室 （studio）名下
 * */
var getOrderPermission=function(jsonReq,callback){
    var database=jsonReq.database;
    var 

    var col=database.collection("order");
        
}

exports.getCustomerPermission=getCustomerPermission;
exports.getOrderPermission=getOrderPermission;


