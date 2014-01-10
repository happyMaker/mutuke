var Common=(function(){
    var checkType=(function(){
        var email_Flag = false;
        var phone_Flag = false;
        var mobile_Flag = false;
        var qq_Flag = false;
        var syt_Flag = false;

        //验证是否为空
        function _verifyIsNull(str){
            var flag = false;
            if(str == ""|| str == " "||str==null){
                return true;
            }
            return flag;
        }

        //验证邮箱 
        function _verifyEmail(str){
            if(_verifyIsNull(str)){
                email_Flag = false;
                return ;
            }
            var reg = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/;
            email_Flag = reg.test(str);
            if(email_Flag){
                return true;
            }else{
                return false;
            }
        }
        
        function _verifyNum(s){
            if(s!=null){
                var r,re;
                re = /\d*/i; //\d表示数字,*表示匹配多个数字
                r = s.match(re);
                return (r==s)?true:false;
            }
            return false;
        }

        //验证qq号码
        function _verifyQQ(str){
            if(_verifyIsNull(str)){
                qq_Flag = false;
                return;
            }
            var reg = /^[1-9]\d{4,9}$/;
            qq_Flag = reg.test(str);
            if(qq_Flag&&_verifyNum(str)){
                return true;
            }else{
                return false;
            }
        }
        ////验证手机号码
        function _verifyMobile(str){
            if(_verifyIsNull(str)){
                mobile_Flag = false;
                return;
            }
            var json=[
                /^13\d{9}$/,
                /^18\d{9}$/,
                /^147\d{8}$/,
                /^153\d{8}$/,
                /^150\d{8}$/,
                /^151\d{8}$/,
                /^152\d{8}$/,
                /^155\d{8}$/,
                /^156\d{8}$/,
                /^157\d{8}$/,
                /^158\d{8}$/
            ];
            for(var i=0;i<json.length;i++){
                if(json[i].test(str)){
                    return true;
                };
            }
            return false;
        }

        function _getType(str){
            if(_verifyEmail(str)){
                return "email";
            }else if(_verifyQQ(str)){
                return "qq";
            }else if(_verifyMobile(str)){
                return "mobile";
            }else{
                return "err"
            }
        }

        return {
            verifyIsNull:_verifyIsNull,
            verifyEmail:_verifyEmail,
            verifyQQ:_verifyQQ,
            verifyMobile:_verifyMobile,
            verifyNum:_verifyNum,
            getType:_getType
        }

        })();
        
    var btn=(function(){
        var _buttonOpreta=function(btn,type){
            if(type){
                btn.removeClass("disable").data("status",1);
            }else{
                btn.addClass("disable").data("status",0);
            }
        }

        return {
            buttonOpreta:_buttonOpreta
        }
    })();

    var verifyCode=(function(){
        var getVerifyCode=function(){
            var date=(new Date()).valueOf();
            var image="/verifycode?"+date;
            return image;
        }
        return {
            getVC:getVerifyCode
        }
    })();

    return {
       Type:checkType,
        VC:verifyCode,
        Btn:btn
    }
})();



jQuery.fn.smartFloat = function(){
    var position = function(element) {
        var top = element.position().top, pos = element.css("position");
        jQuery(window).scroll(function() {
            var scrolls = jQuery(this).scrollTop();
            if (scrolls > top) {
                if (window.XMLHttpRequest) {
                    element.css({
                        position: "fixed",
                        top: 0
                    });
                } else {
                    element.css({
                    top: scrolls
                    });
                }
            }else {
                element.css({
                    position: "absolute",
                    top: top
                });
            }
        });
    };
    return jQuery(this).each(function() {
        position(jQuery(this));
    });
};
var JSON=JSON||{};
JSON.stringify = JSON.stringify || function (obj) {
    var t = typeof (obj);
    if (t != "object" || obj === null) {
        // simple data type
        if (t == "string") obj = '"'+obj+'"';
        return String(obj);
    }
    else {
        // recurse array or object
        var n, v, json = [], arr = (obj && obj.constructor == Array);
        for (n in obj) {
            v = obj[n]; t = typeof(v);
            if (t == "string") v = '"'+v+'"';
            else if (t == "object" && v !== null) v = JSON.stringify(v);
            json.push((arr ? "" : '"' + n + '":') + String(v));
        }
        return (arr ? "[" : "{") + String(json) + (arr ? "]" : "}");
    }
};







//
////验证电话号码
//function verifyPhone(){
//var strPhone = document.getElementById("phone").value; 
//var phone_info = document.getElementById("phone_info");
//var reg = /^(([0\+]\d{2,3}-)?(0\d{2,3})-)?(\d{7,8})(-(\d{3,}))?$/;
//if(verifyIsNull(phone_info,strPhone)){
//phone_Flag = false;
//return ;
//}     
//phone_Flag = reg.test(strPhone);
//if(phone_Flag){
//phone_info.innerHTML = "恭喜！电话号码输入正确。";
//}else{
//phone_info.innerHTML = "对不起，您输入的电话号码格式错误。";
//}
//}
//
