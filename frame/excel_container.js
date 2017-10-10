var headers=[];
var columns=[];
var data_sql='';
var fields='';
var records;
var get_data=function(){
    if(data_sql==='') return;
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
    if(typeof(busy_query)!='undefined') $vm.open_dialog({name:'busy_dialog_module'});
    $VmAPI.request({data:req,callback:function(res){
        if(typeof(busy_query)!='undefined') $vm.close_dialog({name:'busy_dialog_module'});
        records=res.records;
        if(typeof(records_process)!='undefined'){ records_process(records); }
        var ht=$('#excel__ID').handsontable({
            data: records,
            colHeaders:headers,
            columns:columns,
            rowHeaders: true,
            manualColumnResize: true,
            fillHandle: false,
        });
    }})
}
var export_data=function(file_name){
    if(records!==undefined){
        $vm.download_csv({name:file_name,data:records,fields:fields});
    }
    else alert('No data')
}
