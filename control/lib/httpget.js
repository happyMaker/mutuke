var https=require('https');
  
var options = {
    host: 'https://graph.qq.com',
    port: 80,
    path: '/oauth2.0/me?access_token=794222613A59B3221BEB25C29F5D93BB',
    method: 'GET'
};
  

exports.sendRequest=function(path,callback){
    https.get(path, function(res) {
        var pageData = "";
        res.setEncoding('UTF-8');

        res.on('data', function (chunk) {
            pageData += chunk;
        });
      
        res.on('end', function(){
            console.log(pageData);
            callback(pageData);
        });
    });
};

