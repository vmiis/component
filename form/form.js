var _records;
var _res;
var I;
var _before_submit='';
var _after_submit='';
var _db_pid='';

var _headerB='';
var _cell_render='';
var _after_change='';
var _before_change='';
var _cell_value_process='';
var _trigger_parameters="";
var _s2_record=0;
//---------------------------------------------
var _init=function(){
    $('#save__ID').css('background','');
    _db_pid=$vm.module_list[$vm.vm['__ID'].name]['table_id'];
    $vm.vm['__ID'].db_pid=_db_pid;

    $('#F__ID')[0].reset();
    _records=[{}];I=0;_records[I].vm_readonly={};_records[I].vm_custom={}
    _headerB=[];
    $('#F__ID *').each(function(){
        var data_id=$(this).attr('data-id');
        if(data_id!==undefined){
            _records[0][data_id]='';
            _headerB.push(data_id);
        }
        var edit=$(this).attr('contenteditable');
        if(edit===true) $(this).html('');
    })
}
//---------------------------------------------
var _field_process=function(){
    //cell render
    if(_records[I].vm_custom===undefined) _records[I].vm_custom={};
    if(_records[I].vm_readonly===undefined) _records[I].vm_readonly={};
    if(_records[I].vm_validation===undefined) _records[I].vm_validation={};
    $('#tb__ID tbody td').each(function(){
        var data_id=$(this).attr('data-id');
        if(data_id!==undefined){
            var custom=$(this).attr('data-custom');
            if(custom===undefined){
                $(this).attr('contenteditable',true);
                var cell_value=_records[I][data_id];
                if(cell_value===undefined) cell_value="";
                $(this).html(cell_value);
                if(_cell_render!==''){ _cell_render(_records,I,data_id,$(this),_set_value,'form'); }
            }
            if(data_id=='DateTime' || data_id=='Author' || _records[I].vm_readonly[data_id]===true){
                $(this).removeAttr('contenteditable');
                $(this).css('background-color','#F8F8F8')
            }
            if(_records[I].vm_custom[data_id]===true){
                $(this).removeAttr('contenteditable');
            }
        }
        var multi=$(this).attr('data-multi');
        if(multi!==undefined){
            $(this).each(function(){
                if(_cell_render!==''){ _cell_render(_records,I,data_id,$(this),_set_value,'form'); }
            })
        }
    })
    //--------------------------------------------
    $('#tb__ID tbody td').blur(function(){
        var data_id=$(this).attr('data-id');
        if(data_id!==undefined){
            var value=$(this).html().replace(/<div>/g,'').replace(/<\/div>/g,'\n').replace(/<br>/g,'\n');
            var value=$('<div/>').html(value).text();
            if(_before_change!=="") _before_change(_records,I,data_id,$(this),_set_value,'form');
            if(_cell_value_process!=="") value=_cell_value_process(value,data_id);
            _set_value(value,_records,I,data_id);
            var fun=_records[I].vm_validation[data_id];
            if(fun!==undefined){
                $(this).css('background','#FFF');
                _records[I].vm_valid[data_id]=1;
                var R=fun(value);
                $(this).prop('title', R);
                if(R!==""){
                    $(this).css('background','#E4CDCD');
                    _records[I].vm_valid[data_id]=0;
                }
            }
        }
        if(_after_change!=="") _after_change(_records,I,data_id,$(this),_set_value,'form');
    })
}
//---------------------------------------------
var _dbv;
var _row_data;
$('#save__ID').on('click', function(){
    var record=_records[I];
    if(record!==false){
        _dbv={};
        if(_before_submit!==''){
            var r=_before_submit(record,_dbv);  if(r===false) return;
        }
        _row_data={}
        for(var i=0;i<_headerB.length;i++){
            if(_headerB[i][0]!='_'){
                _row_data[_headerB[i]]=record[_headerB[i]];
            }
        }
        var rid=record.ID;
        if(rid===null || rid===undefined) _record_add(I);
        else _record_modify(I);
    }
})
//-------------------------------------
var _record_add=function(I){
    var tr=$('#tb__ID');
    var options={ pid:'__ID', records:_records, row_data:_row_data, I:I, dbv:_dbv,tr:tr,
        callback:function(res,n){
            if(_after_submit!=='')  _after_submit(I,res,n,_dbv);
            _records[I].vm_dirty=0;
            $vm.back({div:'__ID',form:1,refresh_back:1});
        }
    }
    if(_s2_record!==1) $vm.grid_add_record(options);
    else $vm.add_record_s2(options);
};
//---------------------------------------------
var _record_modify=function(I){
    var tr=$('#tb__ID');
    var options={ pid:'__ID', records:_records, row_data:_row_data, I:I, dbv:_dbv,tr:tr,
        callback:function(res,n){
            if(_after_submit!=='')  _after_submit(I,res,n,_dbv);
            _records[I].vm_dirty=0;
            $vm.back({div:'__ID',form:1,refresh_back:1});
        }
    }
    if(_s2_record!==1) $vm.grid_modify_record(options);
    else $vm.modify_record_s2(options);
};
//---------------------------------------------
var _set_value=function(value,records,I,column_name){
    if(value==="" && records[I][column_name]===undefined) return;
    if(value!==_records[I][column_name]){
        records[I].vm_dirty=1;
        records[I][column_name]=value;
        $('#save__ID').css('background','#E00');
    }
}
//---------------------------------------------
$('#back__ID').on('click',function(event){
    event.stopPropagation();
    $vm.back({div:'__ID',form:1});
});
//---------------------------------------------
