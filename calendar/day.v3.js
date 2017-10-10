var _ref=0
$('#previous__ID').on('click',function(){   _ref--;	_set_ref();	_request_and_render();	})
$('#this__ID').on('click',    function(){	_ref=0; _set_ref();	_request_and_render();	})
$('#next__ID').on('click',    function(){	_ref++;	_set_ref();	_request_and_render();	})
$('#refresh__ID').on('click', function(){	_request_and_render();	})

$('#date__ID').datepicker({dateFormat:'dd/mm/yy'});
$('#date__ID').on('change',function(){
    _ref=$vm.date_day_diff($vm.date_today(),$vm.date_parse($('#date__ID').val()));
    _request_and_render();
});

var _request_and_render=function(){};
var _set_ref=function(){
    var d=$vm.date_to_string_dmy($vm.date_add_days($vm.date_today(),_ref))
    $('#date__ID').val(d);
}
_set_ref();
//---------------------------------------------
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
