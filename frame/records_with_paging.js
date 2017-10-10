var _db_pid;//=$vm.module_list[$vm.vm['__ID'].name][0];
if(Array.isArray($vm.module_list[$vm.vm['__ID'].name])===true){
    _db_pid=$vm.module_list[$vm.vm['__ID'].name][0];
}
else{
    _db_pid=$vm.module_list[$vm.vm['__ID'].name]['table_id'];
}
$vm.vm['__ID'].db_pid=_db_pid;
var _records;
var _display_records='';
//-------------------------------------
var _set_req=function(){
    var sql="with tb as (select Information,ID,UID,PUID,DateTime,Author,RowNum=row_number() over (order by ID DESC) from [TABLE-"+_db_pid+"-@S1] )";
    sql+="select Information,ID,UID,PUID,DateTime,Author,RowNum from tb where RowNum between @I6 and @I7";
    var sql_n="select count(ID) from [TABLE-"+_db_pid+"-@S1]";
    _req={cmd:'query_records',sql:sql,sql_n:sql_n,s1:'"'+$('#keyword__ID').val()+'"',I:$('#I__ID').text(),page_size:$('#page_size__ID').val()}
}
//-------------------------------------
var _set_req_with_sql_where=function(){
    //-------------------
    $('#multi__ID').show();
    if($vm.vm['__ID'].op.new!==undefined || ($vm.vm['__ID'].op.sql_where!==undefined && $vm.vm['__ID'].op.sql_where!=="") ){
        $('#multi__ID').hide();
    }
    //-------------------
    var sql="with tb as (select Information,ID,UID,PUID,DateTime,Author,RowNum=row_number() over (order by ID DESC) from [TABLE-"+_db_pid+"-@S1] )";
    sql+="select Information,ID,UID,PUID,DateTime,Author,RowNum from tb where RowNum between @I6 and @I7";
    var sql_n="select count(ID) from [TABLE-"+_db_pid+"-@S1]";
    //-------------------
    if($vm.vm['__ID'].op.sql_where!==undefined && $vm.vm['__ID'].op.sql_where!==""){
        var sql_where=$vm.vm['__ID'].op.sql_where;
        //$vm.vm['__ID'].op.sql_where=undefined;
        sql=sql.replace('RowNum between @I6 and @I7',sql_where);
        sql_n+=" where "+sql_where;
    }
    //-------------------
    _req={cmd:'query_records',sql:sql,sql_n:sql_n,s1:'"'+$('#keyword__ID').val()+'"',I:$('#I__ID').text(),page_size:$('#page_size__ID').val()}
}
//-------------------------------------
var _request_data=function(){
    if(_req==='') return;
    $VmAPI.request({data:_req,callback:function(res){
        $("#I__ID").text(res.I);
        $("#A__ID").text(res.A);
        $("#elapsed__ID").text(res.elapsed+'ms');
        _records=res.records;
        if(_display_records) _display_records(_records);
    }})
}
//-------------------------------------
$('#query__ID').on('click',function(){    _set_req(); _request_data(); })
$("#p__ID").on('click',function(){  var I=$("#I__ID").text();I--;$("#I__ID").text(I); _set_req(); _request_data();})
$("#n__ID").on('click',function(){  var I=$("#I__ID").text();I++;$("#I__ID").text(I); _set_req(); _request_data();})
$('#pv__ID').on('click',function(){
      var style="";
      if($('#D__ID').find('style')[0]!==undefined) style=$('#D__ID').find('style')[0].innerText+" table{font-size:10pt;font-family: Helvetica, Arial, sans-serif;}";
      $('#pvdiv__ID').vm3('popup',style);
});
$('#back__ID').on('click',function(event){
    event.stopPropagation();
    $vm.back({div:'__ID'});
});
//---------------------------------------------
var _mlist=$vm.module_list;
var _mobj=$vm.vm['__ID'];
var _sys='';
if(_mobj.op!=undefined && _mobj.op.sys!=undefined){
	_sys=_mobj.op.sys;
}
//-----------------------------------------------
