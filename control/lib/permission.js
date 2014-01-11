var db=require("../../db");
var parse=require("./common").parse;
var getPool=db.Common.getPool;
var poolMain=getPool("main"); 
 
var getCustomerPermission=function(){

}


/*
 *判断订单是否属于目前 工作室 （studio）名下
 * */
var getOrderPermission=function(jsonReq,callback){
    //orderId; 
    var database=jsonReq.database;
    db.Customer.getUserAndCustomerRelation(jsonReq,function(err,result){
        if("creator"==result){
                db.Customer.subProductFromCustomer(jsonReq,function(err,res){
                    poolMain.release(database);
                    callback(err,res);
                });
        }
    });
}

exports.getCustomerPermission=getCustomerPermission;
exports.getOrderPermission=getOrderPermission;


