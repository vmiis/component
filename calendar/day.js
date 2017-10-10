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
var calendar_week=function(date_click_fun){
        $('#tbody__ID').html('');
        var d1=$vm.date_add_days($vm.date_weekfirst(new Date()),7*$('#D__ID').data("week"));
        var id=new Date().getTime();
        var row="<tr>";
        for(var j=0;j<7;j++){
              var idd='A'+id+'_'+j
              var d=$vm.date_add_days(d1,j-1)
              var N=d.getDate();
              var N="<u id="+idd+" style=cursor:pointer>"+N+"</u>";
              row+="<td style='vertical-align: top'><div style='text-align:right;'>"+N+"</div><div><ul></ul></div></td>";
        }
        row+="</tr>";
        $('#tbody__ID').append(row);
        for(var j=0;j<7;j++){
              var d=$vm.date_add_days(d1,j-1)
              var idd='A'+id+'_'+j
              $('#'+idd).data('d',d);
              $('#'+idd).on('click',function(){
                    date_click_fun( $vm.date_to_string_dmy($(this).data('d')));
              })
        }
}
//-----------------------------------
