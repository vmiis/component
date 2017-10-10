var _ref=0
var _first_day;
var _last_day;
$('#previous__ID').on('click',function(){   _ref--;	_set_ref();	_request_and_render();	})
$('#this__ID').on('click',    function(){	_ref=0; _set_ref();	_request_and_render();	})
$('#next__ID').on('click',    function(){	_ref++;	_set_ref();	_request_and_render();	})
$('#refresh__ID').on('click', function(){	_request_and_render();	})
var _request_and_render=function(){};
var _set_ref=function(){
    var d=$vm.first_day_of_current_month();
    d.setMonth(d.getMonth()+_ref);
    var s=(d.getMonth()+1)+'/'+d.getFullYear();
    $('#month_year__ID').text(s);

    var d=new Date();
    var y=d.getFullYear()
    var m=d.getMonth()+_ref;
    var d0=new Date(y,m,1,0,0,0,0);
    var e=d0.getDay(); if(e===0) e=7;
    e=e-1; //0,1,...6 --- Monday....Sunday
    var x=$vm.date_add_days(d0,-e);	    _first_day=$vm.date_to_string_dmy(x);
    var y=$vm.date_add_days(d0,-e+41);  _last_day= $vm.date_to_string_dmy(y);
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
var _ids='';
//-----------------------------------------------
if(_mobj.op!=undefined && _mobj.op.sys!=undefined){
	_sys=_mobj.op.sys;
	_ids=_sys.config.module_ids;
}
var _module=$vm.module_list[$vm.vm['__ID'].name];
//-----------------------------------------------
