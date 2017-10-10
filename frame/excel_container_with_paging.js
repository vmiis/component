var _fields;
var _fields_e;
var _data_req='';
var _columns_process='';
var _busy_query='';
var _records_process=''
var _set_sql=''
var _set_export_sql=''
var _from='';
var _to='';
var _filename='export.csv';
var headers;
var columns;
var records;

var set_from_to=function(){
    var start=$('#start__ID').val();  if(start==="") start='0';
    var num=$('#num__ID').val();    if(num==="") num='0';
    var page_size=parseInt($('#page_size__ID').val());
    var nStart=page_size*(parseInt(start)-1)+1;
    var nNum=parseInt(num);
    _from=nStart.toString();
    _to=(nStart+nNum*page_size-1).toString();
    if(nStart<0) _from='0';
    if(nStart+nNum*page_size-1<0) _to='0';
}

var set_headers=function(){
    headers=[];
    columns=[];
    var ay=_fields.split(',');
    for(var i=0;i<ay.length;i++){
        var a=ay[i].split('|')[0].replace(/_/g,' ');
        var b=ay[i].split('|').pop();
        if(a!=='Hidden'){
            headers.push(a);
            columns.push({data:b});
        }
    }
    if(_columns_process!==''){ columns_process(columns); }
}
var get_data=function(){
    if(_data_req==='') return;
    set_headers();
    if(_busy_query!=='') $vm.open_dialog({name:'busy_dialog_module'});
    $VmAPI.request({data:_data_req,callback:function(res){
        if(_busy_query!=='') $vm.close_dialog({name:'busy_dialog_module'});
        $("#I__ID").text(res.I);
        $("#A__ID").text(res.A);
        records=res.records;
        if(_records_process!==''){ records_process(records); }
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
var get_export_data=function(){
    if(_data_req==='') return;
    set_headers();
    if(_busy_query!=='') $vm.open_dialog({name:'busy_dialog_module'});
    $VmAPI.request({data:_data_req,callback:function(res){
        if(_busy_query!=='') $vm.close_dialog({name:'busy_dialog_module'});
        records=res.records;
        export_data(_filename);
    }})
}
var export_data=function(file_name){
    if(records!==undefined){
        $vm.download_csv({name:file_name,data:records,fields:_fields_e});
    }
    else alert('No data')
}
$('#D__ID').on('load',function(){          _set_sql(); get_data();                  })
$('#query__ID').on('click',function(){     _set_sql(); get_data();                  })
$('#export__ID').on('click',function(){
    set_from_to();
    _set_export_sql();
    get_export_data();
})
$("#p__ID").on('click',function(){  var I=$("#I__ID").text();I--;$("#I__ID").text(I); _set_sql(); get_data();})
$("#n__ID").on('click',function(){  var I=$("#I__ID").text();I++;$("#I__ID").text(I); _set_sql(); get_data();})
