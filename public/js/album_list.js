var page={};
$(document).ready(function(){
    page.ajax_getAlbumList();
    page.initAddAlbumBox.init();
    page.bindEvent();
});
page.bindEvent=function(){
    $("#addAlbum").click(function(){
        page.initAddAlbumBox.open();  
    });
};
page.addAlbum=function(json,callback){
    $.ajax({
        type:"post",
        url:"/createAlbum",
        data:json,
        dataType:"json",
        success:function(data){
            console.log(data); 
            callback(data);
        }
    });
}


page.ajax_getAlbumList=function(){
    $.ajax({
        type:"post",
        url:"/getAlbumList",
        dataType:"json",
        success:function(data){
            if(data.status=="ok"){
                var ary=data.data;
                for(var i=0;i<ary.length;i++){
                    new page.album(ary[i]);
                }
            }
        }
    });
}

page.ajax_removeAlbum=function(json,callback){
    $.ajax({
        type:"post",
        url:"/removeAlbum",
        data:json,
        dataType:"json",
        success:function(data){
            callback(data);
        }
    });
}

page.ajax_changeAlbum=function(){
    var json={};
        json.albumId="5299f388167c2ace3c000001";
        json.name="test";
    $.ajax({
        type:"post",
        url:"/changeAlbum",
        data:json,
        dataType:"json",
        success:function(data){
            console.log(data); 
        }
    });
}


//
page.album=(function(){

    function album(json){
        this.body=$("<li/>",{"class":"album"});
        $(".albumList").prepend(this.body);
        this.initUI(json);
    }
    album.prototype.addAnimate=function(json){
        this.body.css({width:"0px"}).animate({"width":"140px"},500);
    }
    album.prototype.initUI=function(json){
        var that=this;
        var imgStr;
        if(json.img!="none"){
            imgStr="<img src='/album_photo/"+json._id+"/"+json.img+"?type=fill'>";
        }else{
            imgStr="<i class='fa fa-picture-o fa-6'></i>";
        }
        var htmlStr="<a href='/album/"+json._id+"'>"+
            "<div class='imgBox'>"+imgStr+
            "</div>"+
            "<div class='name textOver'>"+(json.name||"--")+"</div>"+
            "<div class='count'>"+(json.count||"")+"</div>"+
            "<div class='date'>"+(json.createDate||"--")+"</div>"+
            "<div class='remove fa fa-trash-o'></div>";
            "</a>"
        this.body.append(htmlStr);

        this.body.find(".remove").click(function(){
            var jsonReq={};
                jsonReq.albumId=json._id;
                if(confirm("确定要删除相册内所有照片？")){
                    page.ajax_removeAlbum(jsonReq,function(data){
                        that.body.hide("slow",function(){
                            that.body.remove();
                        });
                    });
                }
            return false;
        
        });
    }
    return album;
})();

page.initAddAlbumBox=(function(){
    var div=$("<div/>",{});
    var htmlStr="<div class='toolbox'>"+
                "<label>名称</label>"+
                "<input class='text' id='name'/>"+
                "<div class='btnBlue add'>添加</div>"+
                "<p class='alt'></p>"+
                "</div>";
        div.append(htmlStr);

        div.find(".add").click(function(){
            var tage=$(this);
            if(!($("#name").val().trim())){
                $(".alt").text("不能为空!");
                return false;
            }
            if(tage.data("status")){
                return false;
            }
            tage.data("status",1).addClass("disable").text("稍等...");
            var jsonReq={};
                jsonReq.name=div.find("#name").val();
            page.addAlbum(jsonReq,function(data){
                if(data.status=="ok"){
                    tage.data("status",0).removeClass("disable").text("添加");
                    div.dialog("close");
                    var album=new page.album({name:jsonReq.name,_id:data.id,img:"none"});
                        album.addAnimate();
                }
            });
        });

    return {
        init:function(){
            div.dialog({
                modal: true,
                width:350,
                autoOpen:false,
                close:function(){
                   $(".alt").text("");  
                   $("#name").val();
                }
            });
        }
        ,open:function(){
            div.dialog("open");
        }
    }
})();

















