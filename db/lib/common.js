var mongodb=require("mongodb"),
    Db=mongodb.Db,
    Server=mongodb.Server,
    objectId=mongodb.ObjectID;
var db_conf=require("../../config.json").db;
var thu_conf=require("../../config.json").thumbnail;
var img_conf=require("../../config.json").image;
var poolModule=require("generic-pool");
var log=true,
    maxTime=30000,
    maxCon=50;

//表结构数据库连接
var poolMain = poolModule.Pool({
        name     : 'main',
        create   : function(callback) {
            mongodb.MongoClient.connect("mongodb://"+db_conf.ip+"/"+db_conf.dbname,{server:{poolSize:1}},function(err,database){
                    if(err){return callback(err);}
                    database.authenticate(db_conf.user,db_conf.pass,function(err,ddb){
                        callback(err,database);
                    });
            });
        },
        destroy  : function(database) { 
            database.close();
         }, //当超时则释放连接
        max      : maxCon,   //最大连接数
        idleTimeoutMillis : maxTime,  //超时时间
        log :log 
    });

//缩略图数据库连接
var poolThumbnail = poolModule.Pool({
        name     : 'thumbnail',
        create   : function(callback) {
            mongodb.MongoClient.connect("mongodb://"+thu_conf.ip+"/"+thu_conf.dbname,{server:{poolSize:1}},function(err,database){
                    if(err){return callback(err);}
                    database.authenticate(thu_conf.user,thu_conf.pass,function(err,ddb){
                        callback(err,database);
                    });
            });
        },
        destroy  : function(database) { 
            database.close();
         }, //当超时则释放连接
        max      : maxCon,   //最大连接数
        idleTimeoutMillis : maxTime,  //超时时间
        log :log 
    });

//文件数据库连接
var poolImage= poolModule.Pool({
        name     : 'image',
        create   : function(callback) {
            mongodb.MongoClient.connect("mongodb://"+img_conf.ip+"/"+img_conf.dbname,{server:{poolSize:1}},function(err,database){
                    if(err){return callback(err);}
                    database.authenticate(img_conf.user,img_conf.pass,function(err,ddb){
                        callback(err,database);
                    });
            });
        },
        destroy  : function(database) { 
            database.close();
         }, //当超时则释放连接
        max      : maxCon,   //最大连接数
        idleTimeoutMillis : maxTime,  //超时时间
        log :log 
    });


exports.getPool=function(type){
    var pool;
    switch(type){
        case "main":pool=poolMain;break;
        case "thumbnail":pool=poolThumbnail;break;
        case "image":pool=poolImage;break;
    };
    return pool;
}

exports.createObjectId=function(str){
    try{
        str=str.toString();
        return  new objectId(str);
    }catch(err){
        console.error("createObjectId:",err);
        return false;
    }
};

