var page={};
$(document).ready(function(){
    $("#submit").click(function(){
        var name=$("#name").val();
        if(name){
            page.applystudio({
                "name":name
            });
        }
    });
});

page.applystudio=function(json){
    $.ajax({
        "type":"post",
        "url":"/applystudio",
        "data":json,
        "dataType":"json",
        "success":function(data){
            if(data.status=="ok"){
                applySuccess();    
            }else{
                alert(data.message);
            }
        }
    })

    function applySuccess(){
        var div=$("<div/>",{"class":"regOk"});
        var img=$("<div/>",{"class":"icon_ok_big okImg"});
        var text=$("<div/>",{"text":"申请成功","class":"title"});
        var time=$("<div/>",{"class":"info"});
        time.append("您可以在<a href='/b/studio_set'>工作室设置</a>页面添加详细信息!");
        div.append(img,text,time);
        $(".content").html("").append(div);
    }
}

