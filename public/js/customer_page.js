var page={};
$(document).ready(function(){
    page.bindEvent();
    page.ajax_getCusList();
    page.customer.init();
});

page.bindEvent=function(){
    $("#add").click(function(){
        //page.ajax_addCustomer($("#customer_name").val());
    });
    $("#addCustomer").click(function(){
        page.customer.openAddBox();
    });
};


page.ajax_addCustomer=function(data,fun){
    $.ajax({
        "type":"post",
        "url":"/ajax_addCustomer",
        "dataType":"json",
        "data":data,
        "success":function(result){
            if("ok"==result.status){
                fun(result.data[0]);
            }else{
            }
        },
        "error":function(){
        
        }
    });
};

page.ajax_searchUser=function(username,callback){
    $.ajax({
        "type":"post",
        "url":"/ajax_searchUser",
        "dataType":"json",
        "data":{"keyword":username},
        "success":function(result){
            callback(result);
        },
        "error":function(){
        
        }
    });
}


page.ajax_getCusList=function(cusId){
    $.ajax({
        "type":"post",
        "url":"/ajax_getCustomer",
        "dataType":"json",
        "data":{"cusId":cusId},
        "success":function(data){
            if(data&&data.length>0){
                var Lib=page.Lib
                for(var i=0;i<data.length;i++){
                    var json=data[i];
                    var lib=new Lib(json);
                    $(".list").append(lib.body);
                } 
            }
        },
        "error":function(){
        
        }
    });
};

page.Lib=(function(){
    function lib(json){
        this.boy=json.member.boy;
        this.girl=json.member.girl;
        this.initUI(json);
        this.createBar(json);
    }
    lib.prototype.initUI=function(json){
        var li=$("<li/>",{}); 
            var name=$("<div/>",{"class":"td name"});
                name.append("<a class='boy bname'>"+(this.boy.name||"--")+"</a>");
                name.append("<a class='girl gname'>"+(this.girl.name||"--")+"</a>");
            var tel=$("<div/>",{"class":"td tel"});
                tel.append("<a class='boy phone'>"+(this.boy.phone||"--")+"</a>");
                tel.append("<a class='girl phone'>"+(this.girl.phone||"--")+"</a>");
            var play=$("<div/>",{"class":"td play"});
            li.append(name,tel,play);
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
        this.cusId=libJson._id;
        this.bindUserId=libJson.bindUser;
        this.jsonData=libJson;
        this.initUI(tage,libJson);
    };
    bar.prototype.initUI=function(tage,libJson){
        var that=this;
        var order=$("<a/>",{"text":"订单管理","href":"/b/orderList/"+that.cusId});
        var share=$("<a/>",{"text":"绑定链接"});
        this.bindUserId?share.addClass("active")&&share.text("已绑定")&&share.data("bd",true):"";
        var detail=$("<a/>",{"text":"详细","class":"detail","href":"/b/customer_detail/"+that.cusId});
        var remove=$("<a/>",{"text":"删除"});
            tage.append(share,order,remove,detail);
            this.bindEvent({
                share:share
            });
    };
    bar.prototype.bindEvent=function(json){
        var that=this;
            json.share.click(function(){
                if($(this).data("bd")){return false;};
                var box=$("<box/>",{"class":"bindPathBox"});
                var src="http://chart.apis.google.com/chart?chs=200x200&cht=qr&chld=|1&chl="+location.host+"/bindlink/"+that.cusId;
                var imgBox=$("<div/>",{"class":"imgBox"});
                var img=$("<img/>",{"src":src});
                var load=$("<i/>",{"src":src,"class":"fa fa-spinner fa-spin load"});
                var loadInfo=$("<p/>",{"class":"loadInfo","text":"加载二维码..."});
                imgBox.append(load,loadInfo);
                    img.load(function(){
                        load.remove();
                        loadInfo.remove();
                        imgBox.append(img); 
                    });

                var htmlStr="<h3>使用指南</h3>"
                            +"<p>请用手机扫描此二维码获取绑定地址，或者复制输入框中的地址发给用户。用户通过预留信息来绑定到客户信息，从而获取对应功能。</p>"
                            +"<p class='resMes'>用户预留信息: "+that.jsonData.reserverMessage+"</p>"
                var input=$("<input/>",{"class":"text pathInput","value":"http://"+location.host+"/bindlink/"+that.cusId});
                box.append(imgBox,htmlStr,input);
                box.dialog({
                    width:450,
                    resizable:false,
                    modal: true,
                    close:function(){
                        box.remove();
                    }
                });
            });
    };
    return bar;
})();

page.customer=(function(){
    var addCustomerBox;
    var _initCustomerAddDialog=function(){
        var box=$("<div/>",{"class":"addCustomerBox"});
        var boy="<div class='boyBox'>"+
                    "<div>帅哥</div>"+
                    "<input placeholder='姓名' class='text name' />"+
                    "<input placeholder='电话' class='text phone' />"+
                    "<textarea class='text otherInfo'></textarea>"+
                "</div>";
        var girl="<div class='girlBox'>"+
                    "<div>美女</div>"+
                    "<input placeholder='姓名' class='text name' />"+
                    "<input placeholder='电话' class='text phone' />"+
                    "<textarea class='text otherInfo'></textarea>"+
                "</div>";
        var otherMessage="<div class='otherMessage'>"+
                            "<div></div>"+
                            "<input placeholder='预留信息' class='text message'/>"+
                            "<input placeholder='地址' class='text address'/>"
        box.append(boy,girl,otherMessage);
        box.dialog({
             autoOpen:false,
            // resizable:false,
            width:590,
            height:450,
            modal: true,
            buttons:{
                "提交":function(){
                    var value=getValue(); 
                    if(value){
                        page.ajax_addCustomer(value,function(dataReq){
                            addCustomerBox.dialog("close");
                            var Lib=page.Lib
                            var lib=new Lib(dataReq);
                            $(".list").append(lib.body);
                        });
                    }
                }
            }
        });
        function getValue(){
            var member={};
            member={
                boyName:box.find(".boyBox .name").val(),
                boyPhone:box.find(".boyBox .phone").val(),
                boyOther:box.find(".boyBox .otherInfo").val(),
                girlName:box.find(".girlBox .name").val(),
                girlPhone:box.find(".girlBox .phone").val(),
                girlOther:box.find(".girlBox .otherInfo").val(),
                message:box.find(".message").val(),
                address:box.find(".address").val()
            }
            var boyInfo=!!(member.boyName&&member.boyPhone);
            var girlInfo=!!(member.girlName&&member.girlPhone);
            if(!(boyInfo||girlInfo)){
                    alert("最少输入一个姓名和电话");
                return false; 
            }
            if(!member.message){
                    alert("必须预留信息，用来登录绑定图片库!");
                return false; 
            }
            return member;
        }
        addCustomerBox=box;
    }
    return {
        init:function(){
            _initCustomerAddDialog();
        },
        openAddBox:function(){
            addCustomerBox.dialog("open");
        }
    }
})();





