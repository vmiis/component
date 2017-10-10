var _db_pid;//=$vm.module_list[$vm.vm['__ID'].name][0];
if(Array.isArray($vm.module_list[$vm.vm['__ID'].name])===true){
    _db_pid=$vm.module_list[$vm.vm['__ID'].name][0];
}
else{
    _db_pid=$vm.module_list[$vm.vm['__ID'].name]['table_id'];
}
$vm.vm['__ID'].db_pid=_db_pid;
$('#F__ID').validate();
var _db_to_form='';
var _form_to_db='';
var _req='';
var _row_data='';
var _dbv={};
var _before_submit='';
var _after_submit='';
//---------------------------------------------
var _add_record=function(){
    if(_row_data!=='' && _row_data!==false){
        var req={cmd:"add_record",db_pid:_db_pid.toString(),data:_row_data,dbv:_dbv};
        $VmAPI.request({data:req,callback:function(res){
            $('#back__ID').trigger('click');
        }});
    }
}
//---------------------------------------------
var _modify_record=function(rid){
    if(_row_data!=='' && _row_data!==false){
        var req={cmd:"modify_record",rid:rid,db_pid:_db_pid.toString(),data:_row_data,dbv:_dbv};
        $VmAPI.request({data:req,callback:function(res){
            $('#back__ID').trigger('click');
        }});
    }
}
//---------------------------------------------
var _set_req=function(){
    var pid=$vm.module_list[$vm.vm['__ID'].name][0];
    var rid=$vm.vm['__ID'].op.rid;
    var sql="select ID,UID,PUID,Information from [TABLE-"+pid+"] where id="+rid;
    _req={cmd:'query_records',sql:sql}
    if(rid===undefined) _req=''
}
//---------------------------------------------
var _request_data=function(){
    if(_req!==''){
        $VmAPI.request({data:_req,callback:function(res){
            if(res.records.length>0){
                var record=res.records[0];
                if(_db_to_form!=='') _db_to_form(record);
            }
        }})
    }
}
//-------------------------------------
var _entry_status=function(row_data){
    var S2='#FF0000';
    var N=0;
    var J=0;
    for(var p in row_data){
        N++;
        if(row_data[p]!==''){
            J++;
        }
    }
    if(N==J) S2='#00FF00';
    else if(J===0) S2='#FF0000';
    else S2='#FFFF00';
    return S2;
}
//---------------------------------------------
$('#save__ID').on('click', function(){
    var record=_form_to_db();
    if(record!==false){
        _row_data=record;
        var ok=true;
        if(_before_submit!==''){
            _dbv={};
            var r=_before_submit(record,_dbv);
            if(r===false){
                ok=false;
            }
        }
        if(ok===true){
            var rid=$vm.vm['__ID'].op.rid;
            if(rid===null || rid===undefined) _add_record();
            else _modify_record(rid);
        }
    }
})
//-------------------------------------
