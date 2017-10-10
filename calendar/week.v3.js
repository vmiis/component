var _ref=0
var _first_day;
var _last_day;
$('#previous__ID').on('click',function(){	_ref--;	_set_ref();		_request_and_render();	})
$('#this__ID').on('click',    function(){	_ref=0;	_set_ref();		_request_and_render();	})
$('#next__ID').on('click',    function(){	_ref++;	_set_ref();		_request_and_render();	})
$('#refresh__ID').on('click', function(){	_request_and_render();	})
var _set_ref=function(){
        var d1=$vm.date_add_days($vm.date_weekfirst(new Date()),7*_ref);
        var d2=$vm.date_add_days(d1,6)
        var s=$vm.date_to_string_dmy(d1)+' - '+$vm.date_to_string_dmy(d2)
        $('#period__ID').text(s);
        _first_day=$vm.date_to_string_dmy(d1);
        _last_day =$vm.date_to_string_dmy(d2);
}
_set_ref();
//---------------------------------------------
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
var _mlist=$vm.module_list;
var _mobj=$vm.vm['__ID'];
var _sys='';
var _config='';
var _ids='';
var _group='';
if(_mobj.op!=undefined && _mobj.op.sys!=undefined){
	_sys=_mobj.op.sys;
	if(_sys.config!=undefined){
		_config=_sys.config;
        if(_config.group!=undefined) _group=_config.group+"_";
		if(_config.module_ids!=undefined){
			_ids=_config.module_ids;
		}
	}
}
//-----------------------------------------------
