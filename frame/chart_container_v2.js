var _db_pid;//=$vm.module_list[$vm.vm['__ID'].name][0];
if(Array.isArray($vm.module_list[$vm.vm['__ID'].name])===true){
    _db_pid=$vm.module_list[$vm.vm['__ID'].name][0];
}
else{
    _db_pid=$vm.module_list[$vm.vm['__ID'].name]['table_id'];
}
$vm.vm['__ID'].db_pid=_db_pid;
var data_sql='';
var _fields;
var _fields_e='';
var _filename='F'+_db_pid+'.csv';
var _headers;
var _columns;
var _records;
var _req='';
var _set_req=''
var _set_sql_export=''
var _busy_query='';
var _records_process=''
var _set_headers=function(){
    _headers=[];
    _columns=[];
    var ay=_fields.split(',');
    for(var i=0;i<ay.length;i++){
        var a=ay[i].split('|')[0].replace(/_/g,' ');
        var b=ay[i].split('|').pop();
        if(a!=='Hidden'){
            _headers.push(a);
            _columns.push({data:b});
        }
    }
}
var _request_data=function(){
    if(_req==='') return;
    _set_headers();
    if(_busy_query!=='') $vm.open_dialog({name:'busy_dialog_module'});
    $VmAPI.request({data:_req,callback:function(res){
        if(_busy_query!=='') $vm.close_dialog({name:'busy_dialog_module'});
        _records=res.records;
        if(_records_process!==''){ _records_process(_records); }
        $('#chart__ID').html('');
        var top1=$('#chart__ID').offset().top;
        $('#chart__ID').css("height",($(window).height()-top1-30)+'px');
        if(_chart!=='') _chart(res.records);
    }})
}
var _request_data_export=function(){
    if(_req==='') return;
    _set_headers();
    if(_busy_query!=='') $vm.open_dialog({name:'busy_dialog_module'});
    $VmAPI.request({data:_req,callback:function(res){
        if(_busy_query!=='') $vm.close_dialog({name:'busy_dialog_module'});
        $("#elapsed__ID").text(res.elapsed+'ms');
        _records=res.records;
        if(_records_process!==''){ _records_process(_records); }
        _export_data(_filename);
    }})
}
//-------------------------------------
var _export_data=function(file_name){
    if(_records!==undefined){
        if(_fields_e==='') _fields_e=_fields;
        $vm.download_csv({name:file_name,data:_records,fields:_fields_e});
    }
    else alert('No data')
}
//-------------------------------------
$('#query__ID').on('click',function(){    _set_req(); _request_data(); })
$('#export__ID').on('click',function(){   _set_req(); _request_data_export();  })
$('#pv__ID').on('click',function(){
      var style="";
      if($('#D__ID').find('style')[0]!==undefined) style=$('#D__ID').find('style')[0].innerText+" table{font-size:10pt;font-family: Helvetica, Arial, sans-serif;}";
      $('#pvdiv__ID').vm3('popup',style);
});
$('#back__ID').on('click',function(event){
    event.stopPropagation();
    $vm.back({div:'__ID'});
});
//-------------------------------------
