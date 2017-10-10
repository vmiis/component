var _db_pid;//=$vm.module_list[$vm.vm['__ID'].name][0];
if(Array.isArray($vm.module_list[$vm.vm['__ID'].name])===true){
    _db_pid=$vm.module_list[$vm.vm['__ID'].name][0];
}
else{
    _db_pid=$vm.module_list[$vm.vm['__ID'].name]['table_id'];
}
var headers=[];
var columns=[];
var data_sql='';
var fields='';
var records;
var get_data=function(){
    headers=[];
    columns=[];
    var ay=fields.split(',');
    for(var i=0;i<ay.length;i++){
        var a=ay[i].split('|')[0].replace(/_/g,' ');
        var b=ay[i].split('|').pop();
        if(a!=='Hidden'){
            headers.push(a);
            columns.push({data:b});
        }
    }
    if(typeof(columns_process)!='undefined'){ columns_process(columns); }
    var req={cmd:'query_records',sql:data_sql}
    if(typeof(data_req)!='undefined'){ req=data_req; }
    $VmAPI.request({data:req,callback:function(res){
        records=res.records;
        if(typeof(records_process)!='undefined'){ records_process(records); }
        $('#chart__ID').html('');
        var top1=$('#chart__ID').offset().top;
        $('#chart__ID').css("height",($(window).height()-top1-30)+'px');
        chart(res.records);
    }})
}
var export_data=function(file_name){
    if(records!==undefined){
        $vm.download_csv({name:file_name,data:records,fields:fields});
    }
    else alert('No data')
}
