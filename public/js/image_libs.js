var page={};
$(document).ready(function(){
    page.bindEvent();
    page.ajax_getImageLibs();
    return false;
});



page.bindEvent=function(){
    $("#create_lib").click(function(){
        page.ajax_createImageLibs({
            "name":$("#lib_name").val()
        });
    });
}

page.ajax_createImageLibs=function(json){
    $.ajax({
        "type":"post",
        "url":"/ajax_createImageLibs",
        "dataType":"json",
        "data":{"libname":json.name},
        "success":function(result){
            if("ok"==result.status){
                alert("create ok");
            }else{
            }
        },
        "error":function(){
        
        }
    });
};
page.ajax_getImageLibs=function(json){
    $.ajax({
        "type":"post",
        "url":"/ajax_getImageLibs",
        "dataType":"json",
        "data":{},
        "success":function(result){
            if("ok"==result.status){
                createList(result.data);
            }else{

            }
        },
        "error":function(){
        
        }
    });
    function createList(data){
        var Lib=page.Lib
        for(var i=0;i<data.length;i++){
            var lib=new Lib(data[i]);
            $(".libsBox").append(lib.body);
        } 
    }
}

page.Lib=(function(){
    function lib(json){
        this.initUI(json);
        this.createBar(json);
    }
    lib.prototype.initUI=function(json){
        var li=$("<li/>",{}); 
            var name=$("<div/>",{"class":"td name","text":json.name});
            var cus=$("<div/>",{"class":"td cus","text":"--"});
            var date=$("<div/>",{"class":"td date","text":"--"});
            var play=$("<div/>",{"class":"td play"});
            li.append(name,cus,date,play);
        this.body=li;
        this.playBox=play;
    }
    lib.prototype.createBar=function(json){
        var bar=page.LibBar;
            this.bar=new bar(this.playBox,json);
    }
    return lib;
})();
page.LibBar=(function(){
    function bar(tage,libJson){
        this.initUI(tage,libJson);
        this.id=libJson.id;
    };
    bar.prototype.initUI=function(tage,libJson){
        var share=$("<a/>",{"text":"公开"});
        var remove=$("<a/>",{"text":"删除"});
        var setModle=$("<a/>",{"text":"添加模板"});
        var setImage=$("<a/>",{"href":"/b/manage_image/"+libJson.id,"target":"_blank","text":"管理图片"});
            tage.append(share,remove,setModle,setImage);
            this.bindEvent(share);
    };
    bar.prototype.bindEvent=function(share){
        var that=this;
            share.click(function(){
                alert(that.id);
            
            });
    };
    return bar;
})();


page.publisBox=(function(){
    var box=$("<div/>",{});
        box
})();



