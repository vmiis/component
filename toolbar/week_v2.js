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
$('#back__ID').on('click',function(event){
      event.stopPropagation();
      $vm.back({div:'__ID'});
});
//---------------------------------------------
var _mlist=$vm.module_list;
var _mobj=$vm.vm['__ID'];
var _sys='';
var _input='';
var _ids='';
if(_mobj.op!=undefined){
	_input=_mobj.op;
}
//-----------------------------------------------
if(_mobj.op!=undefined && _mobj.op.sys!=undefined){
	_sys=_mobj.op.sys;
	_ids=_sys.config.module_ids;
}
/*
if(_mobj.op!=undefined && _mobj.op.module!=undefined){
	_module=_mobj.op.module;
}
*/
var _module=$vm.module_list[$vm.vm['__ID'].name];
//-----------------------------------------------
