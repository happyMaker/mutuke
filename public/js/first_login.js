var page={};
$(document).ready(function(){
    $("#newId").click(function(){
        page.ajax_newThirdparty(); 
    });
});

page.ajax_newThirdparty=function(){
    $.ajax({
        type:"post", 
        url:"/ajax_newThirdparty",
        dataType:"json",
        success:function(data){
            if(data.status=="ok"){
                window.location="/album_list";
            }else{
                alert(data.message);
            }
        }
    });
}
