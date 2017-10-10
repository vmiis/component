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
//-----------------------------------
_on_day_click_fun=function(){}
_request_and_render=function(){}
//-----------------------------------
var _get_cell_div=function(d){
      var R=undefined;
      $('#tbody__ID u').each(function(){
            var ddd=$(this).data('d');
            if(ddd!==undefined){
                  var sd=$vm.date_to_string_dmy(ddd)
                  if(sd===d){
                        R=$(this).parent().next();
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
    var d=new Date();
    var y=d.getFullYear()
    var m=d.getMonth()+_ref;    //_ref is a number from toolbar
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
                row+="<td style='vertical-align: top'><div style='text-align:right;"+lcolor+"'>"+N+"</div><div>"+html+"</div></td>";
          }
          row+="</tr>";
          $('#tbody__ID').append(row);
          for(var j=0;j<7;j++){
                var d=$vm.date_add_days(d0,-e+7*i+j)
                var idd='A'+id+'_'+i+'_'+j
                $('#'+idd).data('d',d);
                $('#'+idd).on('click',function(){
                      _on_day_click_fun( $vm.date_to_string_dmy($(this).data('d')));
                })
          }
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
