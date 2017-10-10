//-----------------------------------
var calendar_ul=function(d){
      var R=undefined;
      $('#tbody__ID u').each(function(){
            var ddd=$(this).data('d');
            if(ddd!==undefined){
                  var td=$vm.date_to_string_dmy(ddd)
                  if(td===d){
                        R=$(this).parent().next().find('ul')[0];
                        return false;
                  }
            }
      })
      if(R!==undefined) return $(R);
      return R;
}
//-----------------------------------
var calendar_div=function(d){
      var R=undefined;
      $('#tbody__ID u').each(function(){
            var ddd=$(this).data('d');
            if(ddd!==undefined){
                  var td=$vm.date_to_string_dmy(ddd)
                  if(td===d){
                        R=$(this).parent().next();
                        return false;
                  }
            }
      })
      if(R!==undefined) return $(R);
      return R;
}
//-----------------------------------
var calendar_month=function(date_click_fun){
      $('#tbody__ID').html('');
      var d=new Date();
      var y=d.getFullYear()
      var m=d.getMonth()+$('#D__ID').data("month");
      var d0=new Date(y,m,1,0,0,0,0);
      var m0=d0.getMonth();
      var e=d0.getDay(); if(e===0) e=7;
      e=e-1; //0,1,...6 --- Monday....Sunday
      var n=d0.getDate()
      var id=new Date().getTime();
      for(var i=0;i<6;i++){
            var row="<tr>";
            for(var j=0;j<7;j++){
                  var idd='A'+id+'_'+i+'_'+j
                  var d=$vm.date_add_days(d0,-e+7*i+j)
                  var N=d.getDate();
                  var lcolor="";
                  if( (i==0 && N>20) || ((i==5 || i==4) && N<15) ) lcolor="color:#999";
                  var N="<u id="+idd+" style=cursor:pointer>"+N+"</u>";
                  row+="<td style='vertical-align: top'><div style='text-align:right;"+lcolor+"'>"+N+"</div><div><ul></ul></div></td>";
            }
            row+="</tr>";
            $('#tbody__ID').append(row);
            for(var j=0;j<7;j++){
                  var d=$vm.date_add_days(d0,-e+7*i+j)
                  var idd='A'+id+'_'+i+'_'+j
                  $('#'+idd).data('d',d);
                  $('#'+idd).on('click',function(){
                        date_click_fun( date_to_string_dmy($(this).data('d')));
                  })
            }
      }
}
//-----------------------------------
