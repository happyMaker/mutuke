var d;
$(document).ready(function(){
  d=$(".date").pickadate({
       //monthsFull: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
       monthsFull: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
      weekdaysFull:["星期一","星期二","星期三","星期四","星期五","星期六","星期日"],
      weekdaysShort:["一","二","三","四","五","六","日"],
      today: '今天',
      clear: '取消',
    format:'d日,mmmm,yyyy年',
      formatSubmit:"yyyy/mm/dd"
  });  
  
});
