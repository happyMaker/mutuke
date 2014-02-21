var page=window.page||{};
$(document).ready(function(){
    page.cusInfoId=$("#cusInfoId").val();
   page.bindPageEvent(); 
   page.ajax_getOrderList();
    ProductBox.init();
});

page.bindPageEvent=function(){
    $("#addCustomer").click(function(){
        //page.ajax_createOrder();
        var d=create();
        d.dialog({
            autoOpen:true,
            modal: true,
            width:590,
            resizable:false,
            close:function(){
                $(this).remove();
            }
        });
    });  
}

var create=function(){
   var htmlStr="<div>"+
                    "<ul class='createOrderBox'>"+
                        "<li><div class='key'>名称</div><div class='infoBox'><input class='text' /></div></li>"+
                        "<li><div class='key'>拍照时间</div><div class='infoBox'><input class='text' /></div></li>"+
                        "<li><div class='key'>结婚时间</div><div class='infoBox'><input class='text' /></div></li>"+
                        "<li><div class='key'>拍照人</div><div class='infoBox'><input class='text' /></div></li>"+
                        "<li><div class='key'>金额</div><div class='infoBox'><input class='text' /></div></li>"+
                        "<li><div class='key'>备注</div><div class='infoBox'><textarea class='text remarks' ></textarea></div></li>"+
                        "<li><div class='btnBlue submit'>提交</div></li>"+
                    "</ul>"+
                "</div>"; 
    var d=$(htmlStr);
        d.find(".submit").click(function(){
            alert("bcd");
        });
   return d;

}

page.ajax_createOrder=function(json){
    $.ajax({
        url:"/ajax_addOrder",
        type:"post",
        data:{cusInfoId:page.cusInfoId},
        dataType:"json",
        success:function(data){
            console.log(data); 
        }
    });
}

page.ajax_removeProduct=function(json,callback){
    var pid=json.pid,
        oid=json.oid,
        cid=json.cid;
        $.ajax({
            "type":"post",
            "url":"/ajax_removeProductFromOrder",
            "dataType":"json",
            "data":{
                "orderId":oid,
                "cusInfoId":cid,
                "productId":pid
            },
            "success":function(data){
                if(data.status=="ok"){
                    callback();
                }else{
                    alert(data.message);
                }
            }
        });
    }
page.ajax_subProduct=function(json,callback){
    var pid=json.pid,
        oid=json.oid,
        cid=json.cid;
        $.ajax({
            "type":"post",
            "url":"/ajax_subProductFromOrder",
            "dataType":"json",
            "data":{
                "orderId":oid,
                "cusInfoId":cid,
                "productId":pid
            },
            "success":function(data){
                if(data.status=="ok"){
                    callback();
                }else{
                    alert(data.message);
                }
            }
        });
    }
page.ajax_bindProduct=function(json,callback){
    var pid=json.pid,
        cid=json.cid,
        oid=json.oid;
    console.log(oid);
        $.ajax({
            "type":"post",
            "url":"/ajax_bindProductToOrder",
            "dataType":"json",
            "data":{
                "orderId":oid,
                "cusInfoId":cid,
                "productId":pid
            },
            "success":function(data){
                if(data.status=="ok"){
                    callback();
                }else{
                    alert(data.message);
                }
            }
        });
    }

page.ajax_getCusProducts=function(orderId,callback){
    $.ajax({
        "type":"post",
        "url":"/ajax_getProductsFromOrder",
        "dataType":"json",
        "data":{
            "orderId":orderId,
            "cusInfoId":page.cusInfoId
        },
        "success":function(data){
            if(data.status=="ok"){
                callback(data.data);
            }
        }
    });
}

page.ajax_getAllProducts=function(callback){
    $.ajax({
        type:"post",
        url:"/getAllProduct",
        dataType:"json",
        success:function(data){
            if(data.status=="ok"){
                callback(data.data);
            }
        }
    });
}

page.ajax_getOrderList=function(json){
    $.ajax({
        url:"/ajax_getOrderList",
        type:"post",
        data:{cusInfoId:page.cusInfoId},
        dataType:"json",
        success:function(data){
            console.log(data); 
            if(data.status=="ok"){
                var tempData=data.data;
                for(var i=0;i<tempData.length;i++){
                    page.OrderFactory.createOrder(tempData[i]);
                
                }
            
            }

        }
    });
}

page.OrderFactory=(function(){
    function order(data){
        this.data=data;
        this.initUI();
    }
    order.prototype.initUI=function(){
        var data=this.data;
        var li=$("<li/>",{"class":"li"}); 
        $(".orderList").append(li);
        var bar=page.LibBar;
            new bar(li,data);

    }

    return {
        createOrder:function(data){
            var o=new order(data);
        }
    }
})();

page.LibBar=(function(){
    function bar(tage,libJson){
        this.orderId=libJson._id;
        this.jsonData=libJson;
        this.initUI(tage);
    };
    bar.prototype.initUI=function(tage){
        var that=this;
        var date=new Date(that.jsonData.createDate);
        var dateUI=$("<span/>",{"class":"date","text":date.toLocaleDateString()});
        var remove=$("<a/>",{"text":"删除"});
        var setModle=$("<a/>",{"text":"添加模板"});
        var setImage=$("<a/>",{"href":"/b/manage_image/"+page.cusInfoId+"/"+that.orderId,"text":"管理图片"});
        var selectsList=$("<a/>",{"target":"_blank","href":"/b/selects/"+that.orderId,"text":"查看选片"});
        var detail=$("<a/>",{"target":"_blank","href":"/b/order_detail/"+page.cusInfoId+"/"+that.orderId,"text":"订单详情"});
            var htmla="<div class='do_progress'>"+
                        "<div class='barBGb'></div>"+
                        "<div class='barBGa'></div>"+
                        "<div class='point p1'><span>1</span><div class='tt'>待上传</div></div>"+
                        "<div class='point p2'><span>2</span><div class='tt'>选片中</div></div>"+
                        "<div class='point p3'><span>3</span><div class='tt'>待设计</div></div>"+
                        "<div class='point p4'><span>4</span><div class='tt'>审核中</div></div>"+
                        "<div class='point p5'><span>5</span><div class='tt'>设计完成</div></div>"+
                        "<div class='point p6'><span>6</span><div class='tt'>交易完成</div></div>"+
                    "</div>";
        var box=$("<div/>",{"class":"playBox"});
            box.append(remove,setModle,setImage,selectsList,detail);
            tage.append(dateUI,htmla,box);
            this.bindEvent({
                setModle:setModle
            });
            for(var i=1;i<6;i++){
                var temp=tage.find(".p"+i);
                    temp.addClass("active").find("span").text("").addClass("fa fa-check-circle");
            }
                var temp=tage.find(".barBGa").css({"width":2*60+"px"});
    };
    bar.prototype.bindEvent=function(json){
        var that=this;
            json.setModle.click(function(){
                ProductBox.open(that.orderId);
            });
    };
    return bar;
})();



var ProductBox=(function(){
    var orderId=null;
    var html="<div class='product'>"+
                "<div class='overDiv'><i class='fa fa-spinner fa-spin'></i><p>初始化...</p></div>"+
                "<div class='allProduct'>"+
                    "<ul class='pList'></ul>"+
                "</div>"+
                "<div class='cusProduct'>"+
                    "<ul class='pList'></ul>"+
                "</div>"+
            "</div>";
    var body=$(html);
    var pList=body.find(".cusProduct .pList");
    var aList=body.find(".allProduct .pList");
    function _init(){
        body.dialog({
            autoOpen:false,
            resizable: true,
            width:800,
            modal: true,
            "close":function(){
                aList.html("");
                pList.html("");
            },
            "beforeclose":function(){
            }
        });
    }
    body.find(".cusProduct").on({
        drop:function(e){
            var obj=ProductFactory.getActiveProduct();
                obj.add();
        },
        dragover:function(e){
            e.preventDefault();
        }
    });
    
    function _createCusProduct(data){
        $(body).find(".overDiv").hide();
        var ary=data||[];
            for(var i=0,l=ary.length;i<l;i++){
                var json=ary[i];
                    json.cusInfoId=page.cusInfoId;
                    json.orderId=orderId;
                    json.type="pList";
                    json.tage=pList;
                    ProductFactory.createProduct(json);
            };
    }

    function _createAllProduct(data){
        var ary=data;
            for(var i=0,l=ary.length;i<l;i++){
                var json=ary[i];
                    json.cusInfoId=page.cusInfoId;
                    json.orderId=orderId;
                    json.type="aList";
                    json.tage=aList;
                    ProductFactory.createProduct(json);
            };
            page.ajax_getCusProducts(orderId,_createCusProduct);
        }

    return {
        init:function(){
            _init();
        },
        open:function(_orderId){
            orderId=_orderId;
            page.ajax_getAllProducts(_createAllProduct);
            body.dialog("open");
        },
        cList:pList,
        aList:aList
    } 
})();
var ProductFactory=(function(){
    var originList={};
    var cusList={};

    var ActiveProduct;
    function OriginProduct(json){
        this.id=json["_id"];
        this.orderId=json.orderId;
        originList[this.id]=this;
        this.json=json;
        this.cusInfoId=json.cusInfoId;
        this.initUI(json);
    }
    OriginProduct.prototype.setCount=function(count){
        this.count=count||0;
        if(this.count==0){
            this.body.find(".countBox").hide();
        }else{
            this.body.find(".countBox").show().find(".setCount").text(count);
        }
    };
    OriginProduct.prototype.initUI=function(json){
        var that=this;
            var img=$("<img>",{src:"/public_image/"+json.imgPath+"?type=fill"});
                img.load(function(){
                    that.body.find(".thu").html("").append(img);
                });
        var html="<li class='productLi' draggable=true>"+
                    "<div class='countBox'><i class='fa fa-check check'></i><div class='setCount'></div></div>"+
                    "<div class='btnBlue add'><i class='fa fa-angle-double-right'></i>添加</div>"+
                    "<div class='thu'><i class='fa fa-picture-o'></i></div>"+
                    //"<div class='thu'><img src='/public_image/"+json.imgPath+"?type=fill' /></div>"+
                   // "<div class='thu'><img src='data:image/gif;base64,"+json.base64Img+"' /> </div>"+
                    "<div class='name'>"+json.name+"</div>"+
                    "<div class='size'>"+json.size+"</div>"+
                    "<div class='imgCount'>"+(json.imgCount||"1")+"</div>"+
                    "<div class='description'>"+json.description+"</div>"+
                "</li>";
           this.body=$(html); 
           this.body.on({
            dragstart:function(e){
                ActiveProduct=that;
                //e.preventDefault();
            }
           });
           var add=this.body.find(".add");
           add.click(function(){
               that.add();
           });
        ProductBox.aList.append(this.body);
    }
    OriginProduct.prototype.add=function(){
        var that=this;
       var jsonReq={};
            jsonReq.pid=that.id;
            jsonReq.cid=that.cusInfoId;
            jsonReq.oid=that.orderId;
        page.ajax_bindProduct(jsonReq,function(){
            if(!that.count){
                that.json.type="pList"
                that.json.count=1;
                ProductFactory.createProduct(that.json);
            }else{
                that.count++;
                cusList[that.id].setCount(that.count); 
            }
        }); 
    }
    
    function CusProduct(json){
        this.id=json["_id"];
        this.orderId=json.orderId;
        this.count=parseInt(json.count)||0;
        this.cusInfoId=json.cusInfoId;
        this.initUI(json);
        cusList[this.id]=this;
        originList[this.id]?originList[this.id].setCount(this.count):"";
    }
    CusProduct.prototype.setCount=function(count){
        originList[this.id].setCount(count);
        this.count=count||0;
        this.body.find(".count").text(count);
    };
    CusProduct.prototype.initUI=function(json){
        var that=this;
        var img;
        if(json.base64Img){
            img="<div class='thu'><img src='data:image/gif;base64,"+json.base64Img+"' /> </div>";
        }else{
            img="<div class='thu'><i class='fa fa-picture-o'></i></div>";
        }
        var html="<li class='productLi'>"+
                    "<div class='countBox'><i class='fa fa-minus-square subOne'></i><div class='count'>"+(that.count||"NAN")+"</div><i class='fa fa-plus-square addOne'></i></div>"+
                    "<div class='btnRed remove'><i class='fa fa-trash-o'></i>移除</div>"+img+
                    //"<div class='thu'><img src='/public_image/"+json.imgPath+"?type=fill' /></div>"+
                    "<div class='name'>"+json.name+"</div>"+
                    "<div class='size'>"+json.size+"</div>"+
                    "<div class='imgCount'>"+(json.imgCount||"1")+"</div>"+
                    "<div class='description'>"+json.description+"</div>"+
                "</li>";
           this.body=$(html); 
            ProductBox.cList.append(this.body);
           var remove=this.body.find(".remove");
           var addOne=this.body.find(".addOne");
           var subOne=this.body.find(".subOne");
           var countUI=this.body.find(".count");

           var jsonReq={};
                jsonReq.pid=that.id;
                jsonReq.cid=that.cusInfoId;
                jsonReq.oid=that.orderId;

           remove.click(function(){
                page.ajax_removeProduct(jsonReq,function(){
                    that.body.remove();
                    _changeCount(0);
                }); 
           });
           addOne.click(function(){
                page.ajax_bindProduct(jsonReq,function(){
                    that.count++;
                    _changeCount(that.count);
                }); 
           });
           subOne.click(function(){
                page.ajax_subProduct(jsonReq,function(){
                    that.count--;
                    if(that.count==0){
                        that.body.remove();
                    }
                    _changeCount(that.count);
                }); 
           });

           function _changeCount(count){
                countUI.text(count);
                originList[that.id].setCount(count);
           }
    }

   // return product;
    return {
        createProduct:function(json){
            if(json.type=="aList"){
               var p=new OriginProduct(json);
            }else{
               var p=new CusProduct(json);
            }
        }
        ,getActiveProduct:function(){
            var temp=ActiveProduct;
            ActiveProduct=null;
            return temp;
        }
    }
})();
