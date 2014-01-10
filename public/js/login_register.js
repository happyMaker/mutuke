var page={};
$(document).ready(function(){
    page.bindEvent();
    page.vcode();
});

page.vcode=function(){
        $("#changeVC").click(function(){
            getVC();
        });
        getVC();
        function getVC(){
            var img=$("<img/>",{"src":Common.VC.getVC()});
                img.load(function(){
                    $("#vcBox").html("").append(img);
                })

        }
};


page.bindEvent=function(){

    $(".register #username").blur(function(){
        var val=$(this).val();
        if(!val){
            return $(".username").html("").data("status",0).append("<i class='icon_error_small'></i>不能为空!"); 
          }
        page.ajax_checkUsername({
            username:val
        });
    });
    $(".register #pass").blur(function(){
        var val=$(this).val();
        if(!val){
            return $(".pass").html("").data("status",0).append("<i class='icon_error_small'></i>不能为空!"); 
        }else{
            return $(".pass").html("").data("status",1);
           }
    });
    $(".register #vcode").blur(function(){
        var val=$(this).val();
        if(!val){
            return $(".vcodeBox").html("").data("status",0).append("<i class='icon_error_small'></i>不能为空!"); 
        }else{
            return $(".vcodeBox").html("").data("status",1);
           }
    });
    $(".register #repass").blur(function(){
        var pass=$("#pass").val();
        var repass=$(this).val();
        if(!repass){
           return $(".repass").html("").data("status",0).append("<i class='icon_error_small'></i>不能为空!"); 
        }else{
            $(".repass").html("").data("suatus",1);
        }
        page.checkPass({
            pass:pass,
            repass:repass
        }); 
    });
    //lgoin page
    $("#login").click(function(){
        page.ajax_login({
            username:$("#username").val(),
            pass:$("#pass").val(),
            path:$("#path").val()
        }); 
    }); 

    $(".login #cancel").click(function(){
    });
    //regeister page
    $("#register").click(function(){
        if(page.checkNull()){
            return false;
        }
        if(page.checkStatus()){
            return false;
        }
        page.ajax_register({
            username:$("#username").val(),
            pass:$("#pass").val(),
            vcode:$("#vcode").val()
        }); 
    });
}
page.checkStatus=function(){
    var z=0;
    $(".register .info").each(function(){
        if($(this).data("status")==0){
            z=1;
            $(this).prev().find(".text").focus();
            return z;
        }
    });
    return z;
}
page.checkNull=function(){
    var z=0;
    $(".register .text").each(function(){
        if(!$(this).val()){
            $(this).parent().next(".info").html("").data("status",0).append("<i class='icon_error_small'></i>不能为空!");    
        z=1;
        }
    });
    return z;
}

page.checkPass=function(json){
    if(json.pass!=json.repass){
        $(".repass").html("").data("status",0).append("<i class='icon_error_small'></i>两次密码不一致!"); 
    }else{
        $(".repass").html("").data("status",1).append("<i class='icon_ok_small'></i>"); 
    }
}
page.ajax_checkUsername=function(json){
    $.ajax({
        "type":"post",
        "url":"/ajax_checkUsername",
        "dataType":"json",
        "data":{"username":json.username},
        "success":function(result){
            if("ok"==result.status){
            //可以使用
               $(".username").html("").data("status",1).append("<i class='icon_ok_small'></i>"); 
            }else{
               $(".username").html("").data("status",0).append("<i class='icon_error_small'></i>用户名已经存在!"); 
            }
        },
        "error":function(){
        
        }
    });
}

page.ajax_login=function(json){
    $.ajax({
        "type":"post",
        "url":"/ajax_login",
        "dataType":"json",
        "data":{"username":json.username,"pass":json.pass,"path":json.path},
        "success":function(result){
            if("ok"==result.status){
                finish_login(result);
            }else{
                $(".alert").text(result.message);
            }
        },
        "error":function(){
        
        }
    });
    function finish_login(result){
        var path=json.path;
        if(path){
            window.location=path;
        }else{
            window.location="/";
        };
        //$("body").css({"background":"green"});
    }

};
page.ajax_register=function(json){
    $.ajax({
        "type":"post",
        "url":"/ajax_register",
        "dataType":"json",
        "data":{"vcode":json.vcode,"username":json.username,"pass":json.pass},
        "success":function(result){
            if("ok"==result.status){
                finish_register(result);
            }else{
                alert(result.message);
            }
        },
        "error":function(){
        
        }
    });
    function finish_register(result){
        var div=$("<div/>",{"class":"regOk"});
        var img=$("<div/>",{"class":"icon_ok_big okImg"});
        var text=$("<div/>",{"text":"恭喜！注册成功！","class":"title"});
        var time=$("<div/>",{"class":"info"});
        time.append("<a class='time'>5</a>秒后自动跳转到<a  href='login'>登陆<a/>页面");
        div.append(img,text,time);
    $(".content").html("").append(div);
var d=5;
        var t=setInterval(function(){
            d--;
            $(".time").text(d);
            if(d==0){
            window.location="/login";
            }
        },1000);
    }

}



