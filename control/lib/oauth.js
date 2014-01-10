var HttpGet=require("./httpget");
        //var client_id="100550929";
var qqClient_id="100586908";
var qqRedirect_uri="http://mutuke.com/qq_callback";
var qqClient_secret="9cfe91826773a1be9295a6343e3fcf59";
var _qq={
    // getPath 根据 申请的appId等 获取Authorization Code，返回给 callBack页面，
    // callBack 页面得到 返回的 Authorization Code，给getTokenByAcode 方法，https请求回Token 数据包
    // 把数据包给parseToken 方法，得到Token的json类型数据；
    // 把json数据拼装地址，请求OpenId，返回后，给ParseOpenId 解析出 openId json类型数据；
    getPath:function(){
        var path="https://graph.qq.com/oauth2.0/authorize";
        var response_type="code";
        //var client_id="100550929";
        //var redirect_uri="http://makejs.com/qq_callback";
        var client_id=qqClient_id;
        var redirect_uri=qqRedirect_uri;
            redirect_uri=encodeURIComponent(redirect_uri);
        var state="1";
        var url=path+"?response_type="+response_type+"&client_id="+client_id+"&redirect_uri="+redirect_uri+"&state="+state;
        return url;
    },
    packagePathToGetToken:function(Acode){
        var that=this;
        var path="https://graph.qq.com/oauth2.0/token";
        var grant_type="authorization_code";
        var client_secret=qqClient_secret;//"88641a170b4d51d2b47bc33ddaf0dcdd";
        var code=Acode;
        //var redirect_uri="http://makejs.com/qq_callback";
        var redirect_uri=qqRedirect_uri;
        var client_id=qqClient_id;
        var url=path+"?grant_type="+grant_type+"&client_id="+client_id+"&client_secret="+client_secret+"&code="+code+"&redirect_uri="+redirect_uri;
        //res.redirect(url);
        return url;
    },
    getToken:function(url,callback){
        var that=this;
        HttpGet.sendRequest(url,function(data){
            try{
                var json=that.parseToken(data.toString());
                callback({"status":"ok","data":json});
            }catch(e){
                callback({"status":"err","message":e});
            }
        });
    
    },
    getOpenId:function(json,callback){
        var that=this;
        HttpGet.sendRequest("https://graph.qq.com/oauth2.0/me?access_token="+json.access_token,function(data){
            try{
                var jsonData=that.parseOpenId(data.toString());
                callback({"status":"ok","data":jsonData});
            }catch(e){
                callback({"status":"err","message":e});
            }
        });
    },
    parseOpenId:function (str){
        var start=str.indexOf("{");
        var end=str.indexOf("}");
        var jsonStr=str.substring(start,end+1);
        var json= JSON.parse(jsonStr);
        return json;
    },
    parseToken:function (str){
        var tempA=str.split("&");
        var AtokenAry=tempA[0].split("=");
        var BtokenAry=tempA[1].split("=");
        var json={};
            json[AtokenAry[0]]=AtokenAry[1];
            json[BtokenAry[0]]=BtokenAry[1];
        return json;
    }
}
exports.QQ=_qq;
