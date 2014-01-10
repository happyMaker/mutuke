var db=require("../../db");
var mongodb=require("mongodb"),
    objectId=mongodb.ObjectID;
var Common=db.Common;

var testUserId=new objectId("527ce977e920d9af09000001");
var testCusId=new objectId("527cea824ae799ba0a000001");


/*
exports.createCustomerListForUser=_createCustomerListForUser;
exports.addCustomerToList=_addCustomerToList;
exports.addCustomerInfo=_addCustomerInfo;
exports.getCustomerList=_getCustomerList;

exports.getCustomerInfoById=_getCustomerInfoById;
*/
