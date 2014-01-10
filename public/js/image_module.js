var pageSpace={};
$(document).ready(function(){
    var addBox=$("#addBox");
    $(".add").click(function(){
        pageSpace.createAddBox(addBox);
    });
    pageSpace.ajax_getProductList();
});


pageSpace.createAddBox=function(addBox){
    addBox.slideDown("slow");
    var div=$("<div/>",{"class":"inputBox"});    
    var tab=$("<lable/>",{"text":"名称","class":"lab_name"});
    var moduleName=$("<input/>",{"class":"text"})
    var ok=$("<div/>",{"class":"btnBlue","text":"提交"});
    var cancel=$("<div/>",{"class":"btnBlue","text":"取消"});
        div.append(tab,moduleName,ok,cancel);
        addBox.append(div);

        ok.click(function(){
            pageSpace.ajax_addProduct(moduleName.val(),function(){
                _close();
            });
        });
        cancel.click(function(){
            _close();
        });

        function _close(){
            addBox.slideUp("slow",function(){
                div.remove(); 
            });
        }
}

pageSpace.ajax_getProductList=function(){
    $.ajax({
        type:"post",
        url:"/getAllProduct",
        dataType:"json",
        success:function(data){
            if(data.status=="ok"){
                var ary=data.data;
                var product=pageSpace.Product;
                //for(var i=0,l=ary.length;i<l;i++){
                for(var i=ary.length-1;i>-1;i--){
                    var d=new product(ary[i]);
                    $(".moduleList").append(d.body);
                }
            }
        }
    });
}

pageSpace.ajax_removeProduct=function(productId,callback){
    $.ajax({
        type:"post",
        url:"/removeProduct",
        dataType:"json",
        data:{productId:productId},
        success:function(data){
            if(data.status=="ok"){
                callback();
            }else{
                alert("sorry"+data.message);
            }
        }
    });
}
pageSpace.ajax_addProduct=function(name,callback){
    $.ajax({
        type:"post",
        url:"/addProduct",
        dataType:"json",
        data:{productName:name},
        success:function(data){
            if(data.status=="ok"){
                var product=pageSpace.Product;
                var d=new product({"_id":data.id,"name":name});
                $(".moduleList").prepend(d.body);
                callback();
            }else{
                alert("sorry"+data.message);
            }
        }
    });
}

pageSpace.ajax_saveChange=function(jsonReq,callback){
    $.ajax({
        type:"post",
        url:"/changeProduct",
        dataType:"json",
        data:jsonReq,
        success:function(data){
            callback(data);
        },
        error:function(error){
            callback(error);
        }
    });
}

pageSpace.Product=(function(){
    function product(json){
        this.id=json["_id"];
        this.body=$("<li/>",{"class":"module"});
        this.initUI(json);
    }
    product.prototype.bindUploadEvent=function(imageEdit){
        var that=this;
        imageEdit.fileupload({
            autoUpload: true,//是否自动上传
            url:"/uploadProductHeadImage",//上传地址
            acceptFileTypes: /(\.|\/)(gif|jpeg|png)$/i,
            dataType: 'json',
            formData:{"productId":that.id,"filename":"na"},
            done: function (e, data) {//设置文件上传完毕事件的回调函数
            },
            fail:function(e,data){
                var upl=data.context.data("object");
                    console.log("fail");
                    upl.fail();
            },
            add:function(e,data){
                data.submit();
                data.jqXHR.done(function(reqData){
                    if(reqData.status=="ok"){
                        that.body.find(".imgBox img").attr("src","/public_image/"+reqData.data);        
                    }
                });
            },
            progress: function (e, data) {//设置上传进度事件的回调函数
            },
            progressall: function (e, data) {//设置上传进度事件的回调函数
                var progress = parseInt(data.loaded / data.total * 100, 10);
            }
        });
    };
    product.prototype.initUI=function(json){
        var that=this;
            var nameInput=$("<input/>",{"class":"text editInput"});
            var sizeInput=$("<input/>",{"class":"text editInput"});
            var imgCountInput=$("<input/>",{"class":"text editInput"});
            var descriptionInput=$("<textarea/>",{"class":"text editInput"});


            var save=$("<div/>",{"class":"btnBlue save hide","text":"保存"});
                save.click(function(){
                    $(this).hide(); 
                    edit.show();
                    cancel.hide();
                    btnDelete.show();
                    var jsonReq={
                        productId:that.id,
                        productName:nameInput.val(),
                        imgCount:imgCountInput.val(),
                        size:sizeInput.val(),
                        description:descriptionInput.val()
                    };
                        
                    pageSpace.ajax_saveChange(jsonReq,function(data){
                        var body=that.body;
                        body.find(".show").show();
                        body.find(".editInput").remove();
                        body.find(".name .show").text(jsonReq.productName);
                        body.find(".size .show").text(jsonReq.size);
                        body.find(".description .show").text(jsonReq.description);
                        body.find(".imgCount .show").text(jsonReq.imgCount);
                    });
            });

            var cancel=$("<div/>",{"class":"btnBlue cancel hide","text":"取消"});
                cancel.click(function(){
                        $(this).hide();
                        that.body.find(".editInput").remove();
                        edit.show();
                        btnDelete.show();
                        that.body.find(".show").show();
                        save.hide();
                });

            var edit=$("<div/>",{"class":"btnBlue edit","text":"编辑"});

                edit.click(function(){
                    $("body").append("<div class='overDiv'></div>");
                    that.body.addClass("editBox").find(".show").hide();
                    $(this).hide();
                    save.show();
                    btnDelete.hide();
                    cancel.show();
                   var body=that.body;
                   var name=body.find(".name");
                   name.append(nameInput.val(name.find(".show").text()));
                   var size=body.find(".size");
                   size.append(sizeInput.val(size.find(".show").text()));
                   var imgCount=body.find(".imgCount");
                   imgCount.append(imgCountInput.val(imgCount.find(".show").text()));
                   var description=body.find(".description");
                   description.append(descriptionInput.val(description.find(".show").text()));
                });
            var imageEdit=$("<input/>",{"class":"imageEdit","type":"file"});
            that.bindUploadEvent(imageEdit);

            var btnDelete=$("<div/>",{"class":"btnRed delete","text":"删除"});
                btnDelete.click(function(){
                    if(confirm("确定删除此模板？`")){
                        pageSpace.ajax_removeProduct(json._id,function(){
                            that.body.slideUp(200,function(){
                                that.body.remove();
                            });         
                        });
                    }
                });


            var html="<div class='imgBox'><img src='/public_image/"+json.imgPath+"' /> </div>"+
            //var html="<div class='imgBox'><img src='data:image/gif;base64,"+json.base64Img+"' /> </div>"+
                        "<div class='rightBox'>"+
                            "<div class='name'><lable>名称:</lable><label class='show'> "+(json.name||"- -")+"</label></div>"+
                                "<div class='size'><lable>尺寸: </lable><label class='show'> "+(json.size||"- -")+"</label></div>"+
                                "<div class='imgCount'><lable>图片数量: </lable><label class='show'> "+(json.imgCount||"- -")+"</label></div>"+
                                "<div class='description'><lable>描述: </lable><p class='show'>"+(json.description||"- -")+"</p></div>"+
                            "</div> "+
                            "<div class='btnBar'></div>"+
                            "</div>";
        this.body.append($(html));
        this.body.find(".imgBox").append("<i class='fa fa-pencil editIcon'></i>",imageEdit);
        this.body.find(".btnBar").append(save,cancel,edit,btnDelete);
    }
    return product;
})();
