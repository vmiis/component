//-----------------------------------
var _on_day_click_fun=function(){}
var _request_and_render=function(){}
//-----------------------------------
var _get_cell_div=function(d,classname){
    var R=undefined;
    $('#tbody__ID u').each(function(){
        var ddd=$(this).data('d');
        if(ddd!==undefined){
            var sd=$vm.date_to_string_dmy(ddd)
            if(sd===d){
               if(classname!==undefined){
                   R=$(this).parent().parent().find('.'+classname);
               }
               else{
                   R=$(this).parent().next();
               }
               return false;
            }
        }
    })
    if(R!==undefined) return $(R);
    return R;
}
//-----------------------------------
var _calendar_render=function(html){
    $('#tbody__ID').html('');
    var d1=$vm.date_add_days($vm.date_weekfirst(new Date()),7*_ref); //_ref is a number from toolbar
    var id=new Date().getTime();
    var row="<tr>";
    for(var j=0;j<7;j++){
          var idd='A'+id+'_'+j
          var d=$vm.date_add_days(d1,j)
          var N=d.getDate();
          var N="<u id="+idd+" style=cursor:pointer>"+N+"</u>";
          row+="<td style='vertical-align: top'><div style='text-align:right;'>"+N+"</div><div>"+html+"</div></td>";
    }
    row+="</tr>";
    $('#tbody__ID').append(row);
    for(var j=0;j<7;j++){
          var d=$vm.date_add_days(d1,j)
          var idd='A'+id+'_'+j
          $('#'+idd).data('d',d);
          $('#'+idd).on('click',function(){
                _on_day_click_fun( $vm.date_to_string_dmy($(this).data('d')));
          })
    }
}
//-----------------------------------
