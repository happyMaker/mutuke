var page={};
var pTop;
$(document).ready(function(){
    pTop=$(".content").position().top;
    page.cusInfoId=$("#cusInfoId").val();
    showSelectList.init();
    ajax_get(); 

    $("#createList").click(function(){
        ProductThumbList.createSelectPhoto();
    });
});
$(window).scroll(function(evt){
    if($(this).scrollTop()>pTop){
        $(".productBox").css({"position":"fixed","top":0});
    }else{
        $(".productBox").css({"position":"absolute","top":0});
    };
});

window.onbeforeunload=function(){
        return confirm("保存？");
}

var ajax_get=function(){
    $.ajax({
        "type":"post",
        "url":"/getCustomerImages",
        "datatype":"json",
        "data":{"cusInfoId":page.cusInfoId},
        "success":function(json){
            if("sorry"==json.status){alert(json.message);return false;};
            var data=json.data;
            for(var l=-1,i=data.length-1;i>l;i--){
                    var json=data[i];
                    var imgObj=imageFactory.createImg(json);
            };
                        ajax_getCusProducts();
        }
    });
};

var ajax_upload=function(data){
    $.ajax({
        "url":"ajax_uploadSelectPhotoList",
        "type":"post",
        "data":data,
        "success":function(data){
        }
    });
}

var ajax_getCusProducts=function(){
    $.ajax({
        "type":"post",
        "url":"/ajax_getProductsFromCustomer",
        "dataType":"json",
        "data":{
            "cusInfoId":page.cusInfoId
        },
        "success":function(data){
            if(data.status=="ok"&&data.data){
            var ary=data.data;
                ProductThumbList.init(ary);
            }
        }
    });
}



var imageFactory=(function(){
    var ActiveImage=null;
    var imgList=[];
    var slideshowData=[];

                page.ss=SlideShow.getPageSS({
                    images:slideshowData
                    ,sort:true
                });
                page.ss.bind("change",function(activeIndex){
                    var that=imgList[activeIndex];
                    var pThumb=ThumbBar.getThumbTool(that); 
                        $(".productBox").append(pThumb);
                        ActiveImage=that;
                        this.body.find(".imgBox").on({
                            dragstart:function(){
                                ActiveImage=that;
                            }
                        });
                });

    function _addSlideshowData(json){
            var tempObj=json;
            var tempJson={};
            var src="/photo/"+page.cusInfoId+"/"+tempObj.fileId+"?size=600";
            tempJson.src=src;
            tempJson.max=600;
            tempJson.id=tempObj.fileId;
            tempJson.width=tempObj.width;
            tempJson.height=tempObj.height;
            slideshowData.push(tempJson);
    }
    
    function _removeMe(){
        var that=this;
        var index=_getMeIndex.call(that);
        imgList.splice(index,1);
        slideshowData.splice(index,1);
    }

    function _getMeIndex(){
        var that=this;
        for(var i=0;i<imgList.length;i++){
            if(imgList[i]==that){
                return i;
            }
        }
    }

    function image(json){
        this.body=$("<li/>",{"class":"photo"});
        this.body.data("id",json.fileId);
        _addSlideshowData(json);
        this.id=json.fileId;
        this.initUI(json); 
    };
    image.prototype.subOverDiv=function(pro){
        this.body.find(".over."+pro.text).remove();
        this.imgBox.removeClass("type"+pro.text);
    }
    image.prototype.addOverDiv=function(pro){
        this.imgBox.addClass("type"+pro.text);
        var that=this;
        var overSign=$("<div/>",{"class":"over "+pro.text,"text":pro.text})
        var close=$("<div/>",{"class":"close fa fa-times"})
            close.data("pro",pro);
        this.overBox.append(overSign.append(close));

        close.click(function(){
            var pro=$(this).data("pro");
            pro.subThu(that); 
            overSign.remove();
            return false;
        });
    };
    image.prototype.insertAnimate=function(){
        this.body.css({"width":"0px"}).animate({"width":"160px"},1500);
    };
    image.prototype.initUI=function(json){
        var that=this;
        var imgBox=$("<div/>",{"class":"imgBox"});
            var img=$("<img/>",{"src":"/photo/"+page.cusInfoId+"/"+that.id+"?size=300"});
            var name=$("<div/>",{"class":"nameBox"});
                name.append();
            var overBox=$("<div/>",{"class":"overBox"});
            imgBox.append(img,overBox);
        this.body.append(imgBox,name);
        this.overBox=overBox;
        this.imgBox=imgBox;
        this.bindEvent({"imgBox":imgBox});
    }
    image.prototype.bindEvent=function(json){
        var that=this;
        json.imgBox.click(function(){
            var index=_getMeIndex.call(that);
            page.ss.show().to(index);
            
            var proBox=$(".productBox");
            var po=proBox.css("position")||"absolute";
            proBox.css({"position":"fixed"});
            page.ss.bind("close",function(){
                proBox.css({"position":po});
                proBox.removeClass("slide");
            });
            imageFactory.cancelShowImages();
            proBox.addClass("slide");
        });

        this.body.hover(function(){
            var pThumb=ThumbBar.getThumbTool(that); 
            $(this).find(".nameBox").append(pThumb);
        },function(){
            //z.remove();
        });

        json.imgBox.on({
            dragstart:function(e){
                ActiveImage=that;
                //e.preventDefault();
            }
        });

    }
    var over=$("<div/>",{"class":"overDiv"});
    return {
        getActiveImage:function(){
            var temp=ActiveImage;
                ActiveImage=null;
            return temp;
        },
        createImg:function(json){
            var imgObj=new image(json);
                var index=imgList.length%4;
                imgList.push(imgObj);
                var c=["a","b","c","d"];
                $("."+c[index]).append(imgObj.body);
                return imgObj;
        },
        cancelShowImages:function(text){
            $(".top").removeClass("top");
            $(".over").show("slow");
            over.remove();
        },
        showImages:function(text){
            var that=this;
            $("body").append(over);
            over.css({"height":$(document).height()})
            $(".over").hide("slow");
            $(".imgBox.type"+text).addClass("top");

            over.click(function(){
                that.cancelShowImages();
            });
        },
        getImgObjById:function(id){
            for(var i=0;i<imgList.length;i++){
                var tempObj=imgList[i];
                    if(tempObj.id==id){
                        return tempObj;
                    }
            }
            return null;
        }
    }
})();








var ThumbBar=(function(){
    var signAry=[];
    var signList=$("<ul/>",{"class":"signList"})
    var hoverImage;

    function selectBtn(thum){
        this.body=$("<li/>",{"class":"btnBlue sign","text":thum.text});
        this.fatherThumb=thum;
        signList.append(this.body);
        this.bindEvent();
    }
    selectBtn.prototype.bindEvent=function(){
        var that=this;
        this.body.click(function(){
            if($(this).data("enable")){
                that.fatherThumb.subThu(hoverImage);
            }else{
                that.fatherThumb.addThu(hoverImage);
            };
        });
    }

    selectBtn.prototype.stats=function(stats){
        var btn=this.body;
        if(stats){
            btn.addClass("fa fa-check");
            btn.data("enable",1);
        }else{
            btn.data("enable",0);
            btn.removeClass("fa fa-check");
        }
    };

    function _btnStatus(imgObj){
        for(var i=0;i<signAry.length;i++){
            var index=signAry[i].fatherThumb.getChildIndex(imgObj);
            if(index>-1){
                signAry[i].stats(1);
            }else{
                signAry[i].stats(0);
            }
        }
    }

    return {
       createSign:function(thum){
           var that=this;
           signAry.push(new selectBtn(thum));
       }
        ,btnStatus:_btnStatus
        ,getThumbTool:function(imgObj){
            this.btnStatus(imgObj);
            hoverImage=imgObj;
            return signList;
        }
    }
})();

var ProductThumbList=(function(){
    var charAry=["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","O","R","S","T","U","V","W","X","Y","Z"];
    var thumList=[];
    var productList=$("<ul/>",{"class":"productList"});
    var overFlowDiv=$("<div/>",{"class":"overFlowDiv"});
        overFlowDiv.append(productList);

    function Thum(json){
        this.id=json._id;
        this.data=json;
        this.name=this.data.name;
        this.list=[];
        this.body=$("<li/>",{"class":"productLi","title":this.data.name});
        this.text=charAry[this.data.index];
        this.initUI();
        this.bindEvent();
    } 
   Thum.prototype.bindEvent=function(){
       var that=this;
       this.body.click(function(){
           imageFactory.showImages(that.text);
       });
       this.body.on({
            drop:function(e){
                var obj=imageFactory.getActiveImage();
                that.addThu(obj);
            },
            dragover:function(e){
                e.preventDefault();
            }
       });
   }
   Thum.prototype.initUI=function(){
       var name=$("<div/>",{"class":"textOver name","text":this.name});
       var sign=$("<div/>",{"class":"sign","text":this.text});
       this.count=$("<div/>",{"class":"count","text":0+"/"+this.data.imgCount});
       var img=$("<img/>",{"class":"headImage","src":"/public_image/"+this.data.imgPath+""})
       this.body.append(img,sign,this.count,name);
       productList.append(this.body);
   }
   Thum.prototype.subThu=function(imgObj){
       var list=this.list;
       var index=this.getChildIndex(imgObj);
        list.splice(index,1);
        this.count.text(this.list.length+"/"+this.data.imgCount);
        ThumbBar.btnStatus(imgObj);
        imgObj.subOverDiv(this);
   }
   Thum.prototype.addThu=function(imgObj){
       var index=this.getChildIndex(imgObj);
       if(index>-1){
           return false;
       }
       var that=this;
       this.list.push(imgObj.id);
        this.count.text(this.list.length+"/"+this.data.imgCount)
        var text=charAry[this.data.index];
        imgObj.addOverDiv(this);
        ThumbBar.btnStatus(imgObj);
   }
   Thum.prototype.getChildIndex=function(imgObj){
       var list=this.list;
       var length=list.length;
        for(var i=0;i<length;i++){
            if(list[i]==imgObj.id){
                return i;
            }
        }; 
        return -1;
   }

    
   function _createThumbList(ary){
        for(var i=0;i<ary.length;i++){
            var json=ary[i];
                json.index=i;
            var thum=new Thum(json);
            thumList.push(thum);
            ThumbBar.createSign(thum);
        } 
   }


   return {
        init:function(ary){
            var prev=$("<div/>",{"class":"prev"});
                prev.append("<i class='fa fa-arrow-left'></i>");
            var next=$("<div/>",{"class":"next"});
                next.append("<i class='fa fa-arrow-right'></i>");
            $(".productBox").append(prev,overFlowDiv,next);
            _createThumbList(ary);

            this.bind(ary);
        }
        ,bind:function(ary){
            for(var i=0;i<ary.length;i++){
                var tempJson=ary[i]; 
                var tempThum=this.getThumById(tempJson._id);
                    for(var z=0;z<tempJson.selectPhotos.length;z++){
                        var imgObj=imageFactory.getImgObjById(tempJson.selectPhotos[z]);
                        console.log(imgObj);
                        tempThum.addThu(imgObj);
                    }
            }
        }
        ,createSelectPhoto:function(){
            var obj={};
            for(var i=0;i<thumList.length;i++){
                var list=thumList[i].list;
                var productId=thumList[i].id;
                obj[productId]=list;
            };
            showSelectList.parseData(obj);
        }
        ,getThumById:function(id){
            for(var i=0;i<thumList.length;i++){
                var tempThum=thumList[i];
                if(tempThum.id==id){
                    return tempThum;
                }
            } 
            return null;
        }
   }
})();

var showSelectList=(function(){
    var d;
    var obj;
    function initDialog(){
        d=$("<div/>",{});
            d.dialog({
                autoOpen:false
                ,model:true
                ,buttons:{
                    s:function(){
                        var c=JSON.stringify(obj)
                        ajax_upload({"objStr":c});
                    }
                }
            });
    }

    function createUI(data){
        for(var i in data){
            var z=$("<div/>");
            var headline=$("<div/>",{"text":i})
            var ul=$("<ul/>",{});
                var li=$("<li/>",{"text":data[i].name});
                ul.append(li);
            for(var j=0;j<data[i].length;j++){
                var li=$("<li/>",{"text":data[i][j]});
                ul.append(li);
            }
            d.append(z,headline,ul);
        }
    }

    return {
        init:function(){
            initDialog();
        },
        parseData:function(data){
            obj=data;
            createUI(data);
            d.dialog("open");
        }
    }
})();

