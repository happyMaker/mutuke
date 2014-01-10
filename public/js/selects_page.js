var cusInfoId;
$(document).ready(function(){
    cusInfoId=$("#cusInfoId").val();
    ajax_getSelects($("#cusInfoId").val());
});

var ajax_getSelects=function(cusInfoId){
    $.ajax({
        type:"post",
        url:"/ajax_getSelects",
        data:{cusInfoId:cusInfoId},
        success:function(data){
            console.log(data); 
            var selects=data.data;
            for(var i=0;i<selects.length;i++){
                var show=new Show(); 
                    show.initUI(selects[i],$(".content"));
            }
        }
    });
}

var Show=(function(){
    function showBox(){
    
    }
    showBox.prototype.initUI=function(json,tage){
        var z=$("<div/>",{"class":"showBox"});
        var title=$("<div/>",{text:json.name});
        var ul=$("<ul/>",{"class":"photoList"});
        var photos=json.selectPhotos;
            console.log("ff",photos);
        for(var i=0;i<photos.length;i++){
            var li=$("<li/>",{});
            var img=$("<img/>",{src:"/photo/"+cusInfoId+"/"+photos[i]})
            ul.append(li.append(img));
        }
        z.append(title,ul);
        tage.append(z); 
    }
    return showBox;
})();

