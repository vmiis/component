var _db_pid;//=$vm.module_list[$vm.vm['__ID'].name][0];
if(Array.isArray($vm.module_list[$vm.vm['__ID'].name])===true){
    _db_pid=$vm.module_list[$vm.vm['__ID'].name][0];
}
else{
    _db_pid=$vm.module_list[$vm.vm['__ID'].name]['table_id'];
}
$vm.vm['__ID'].db_pid=_db_pid;
var _module=$vm.module_list[$vm.vm['__ID'].name];
var _records;
var _res;
var I;
var _before_submit;
var _after_submit;
var _db_pid;
var headerA;
var headerB;
var widthA;
var widthB;
var min_widthA;
var min_widthB;
var cell_render;
var _cell_render;
var _after_change;
var _after_change_form='';
var _before_change;
var _cell_value_process;
var _trigger_parameters="";
var _save_style;
var _record_type='';
var _app_id;
var _row_data;
var _custom_field_process='';
//---------------------------------------------
var _init=function(){
    $('#save__ID').css('background','');
    if(Array.isArray($vm.module_list[$vm.vm['__ID'].name])===true){
        _db_pid=$vm.module_list[$vm.vm['__ID'].name][0];
    }
    else{
        _db_pid=$vm.module_list[$vm.vm['__ID'].name]['table_id'];
    }
    $vm.vm['__ID'].db_pid=_db_pid;
    headerA=$vm.vm['__ID'].op.headerA;
    headerB=$vm.vm['__ID'].op.headerB;
    widthA=$vm.vm['__ID'].op.widthA;
    widthB=$vm.vm['__ID'].op.widthB;
    min_widthA=$vm.vm['__ID'].op.min_widthA;
    min_widthB=$vm.vm['__ID'].op.min_widthB;
    _records=$vm.vm['__ID'].op.records;
    _res=$vm.vm['__ID'].op.res;
    I=$vm.vm['__ID'].op.I;
    _cell_render=$vm.vm['__ID'].op.cell_render;
    cell_render=$vm.vm['__ID'].op.cell_render;
    _before_submit=$vm.vm['__ID'].op.before_submit;
    _after_submit=$vm.vm['__ID'].op.after_submit;
    _after_change=$vm.vm['__ID'].op.after_change;
    _before_change=$vm.vm['__ID'].op.before_change;
    _cell_value_process=$vm.vm['__ID'].op.cell_value_process;
    _trigger_parameters=$vm.vm['__ID'].op.trigger_parameters;
    _save_style=$vm.vm['__ID'].op.save_style;
    _app_id=$vm.vm['__ID'].op.app_id;
    _record_type=$vm.vm['__ID'].op.record_type;
    _row_data=$vm.vm['__ID'].op.row_data;
    $('#F__ID')[0].reset();

    $('#save__ID').show(); $('#delete__ID').show();
    if(_save_style=='none'){ $('#save__ID').hide(); $('#delete__ID').hide(); }
    if(_records[I].ID==undefined) $('#delete__ID').hide();


    if(_res!==undefined && _res.pms=='1000'){ //readonly
        $('#save__ID').hide();
        $('#delete__ID').hide();
    }
}
//---------------------------------------------
var _build_form=function(){
    $('#tb__ID thead').html("<tr><td>Name</td><td>Value</td></tr>");
    var txt="";
    var a_width="";
    var b_width="";
    if(widthA!=="") a_width=";width:"+widthA;
    if(widthB!=="") b_width=";width:"+widthB;
    for(var i=0;i<headerA.length;i++){
        var name=headerA[i].replace('...','');
        var nameB=headerB[i];
        var value="";
        if(_records[I][headerB[i]]!==undefined) value=_records[I][headerB[i]];

        /* old
        var value=$('<div/>').text(value).html();
        value=value.replace(/\r/g,'\n').replace(/\n\n/g,'\n').replace(/\n/g,'<br>');
        */
        //value=value.replace(/<br>/g,'\n');
        //value=$('<div/>').html(value).text();
        value=$('<div/>').text(value).html();
        value=value.replace(/\n/g,'<br>');

        if(name[0]!='_' && nameB!='DateTime' && nameB!='Author'){
            if($vm.edge==0) txt+="<tr><td style='background-color:#F8F8F8;min-width:"+min_widthA+a_width+"'>"+name.replace(/_/g,' ').replace(/<br>/g,' ')+"</td><td data-id="+headerB[i]+" style='min-width:"+min_widthB+b_width+"' contenteditable>"+value+"</td></tr>";
            else if($vm.edge==1) txt+="<tr><td style='background-color:#F8F8F8;min-width:"+min_widthA+a_width+"'>"+name.replace(/_/g,' ').replace(/<br>/g,' ')+"</td><td data-id="+headerB[i]+" style='min-width:"+min_widthB+b_width+"' ><div contenteditable>"+value+"</div></td></tr>";
        }
    }
    $('#tb__ID tbody').html(txt);
    //--------------------------------------------
}
//---------------------------------------------
$('#D__ID').on('render',function(){
    _build_form();
    _field_process();
});
//---------------------------------------------
var _field_process=function(){
    //cell render
    $('#tb__ID tbody td').each(function(){
        var data_id=$(this).attr('data-id');
        if(data_id!==undefined){
            var custom=$(this).attr('data-custom');
            if(custom===undefined){
                if($vm.edge==1 && $(this).html()==''){
                    $(this).html("<div></div>")
                }
                if($vm.edge==0) $(this).attr('contenteditable',true);
                else if($vm.edge==1) $(this).find('div:first').attr('contenteditable',true);



                var cell_value=_records[I][data_id];
                if(cell_value===undefined) cell_value="";

                //cell_value=cell_value.replace(/<br>/g,'\n');
                //cell_value=$('<div/>').html(cell_value).text();
                cell_value=$('<div/>').text(cell_value).html();
                cell_value=cell_value.replace(/\n/g,'<br>');

                if($vm.edge==0) $(this).html(cell_value);
                else if($vm.edge==1) $(this).find('div:first').html(cell_value);

                if(_cell_render!==''){ _cell_render(_records,I,data_id,$(this),_set_value,'form'); }
                else if(cell_render!==''){ cell_render(_records,I,data_id,$(this),_set_value,'form'); }
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
                if(_cell_render!==''){_cell_render(_records,I,data_id,$(this),_set_value,'form'); }
                else if(cell_render!==''){ cell_render(_records,I,data_id,$(this),_set_value,'form'); }
            })
        }
    })
    //--------------------------------------------
    if($vm.edge==0) $('#tb__ID tbody td').blur(function(){
        var data_id=$(this).attr('data-id');
        if(data_id!==undefined){
            var value=$(this).html().replace(/<div>/g,'').replace(/<\/div>/g,'\n').replace(/<br>/g,'\n');
            value=$('<div/>').html(value).text();
            //value=$('<div/>').text(value).html();
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
        if(_after_change_form!=="") _after_change_form(_records,I,data_id,$(this),_set_value,'form');
        if(_after_change!=="") _after_change(_records,I,data_id,$(this),_set_value,'form');
    })
    if($vm.edge==1) $('#tb__ID tbody td').find('div:first').blur(function(){
        var data_id=$(this).parent().attr('data-id'); //edge
        if(data_id!==undefined){
            var value=$(this).html().replace(/<div>/g,'').replace(/<\/div>/g,'\n').replace(/<br>/g,'\n');
            //var value=$('<div/>').html(value).text();
            value=$('<div/>').text(value).html();
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
        if(_after_change_form!=="") _after_change_form(_records,I,data_id,$(this),_set_value,'form');
        if(_after_change!=="") _after_change(_records,I,data_id,$(this),_set_value,'form');
    })
    if(_custom_field_process!=='') _custom_field_process();
}
//---------------------------------------------
var _before_submit_form=function(){
    return true;
}
//---------------------------------------------
var _after_submit_form=function(){
}
//---------------------------------------------
var _dbv;
//var _row_data;
$('#save2__ID').on('click', function(){ $('#save__ID').triggerHandler('click'); })
//---------------------------------------------
$('#save__ID').on('click', function(){
    $("#save__ID").css('display','none'); //hide save button prevent from save again
    $("#save2__ID").css('display','none'); //hide save button prevent from save again
    var record=_records[I];
    if(record!==false){
        _dbv={};
        var r=_before_submit_form(record,_dbv);
        if(r===false){
            $("#save__ID").css('display','inline-block');   //show save button again if there are problems
            $("#save2__ID").css('display','inline-block');  //show save button again if there are problems
            return;
        };
        if(_before_submit!==''){
            var r=_before_submit(record,_dbv);
            if(r===false){
                $("#save__ID").css('display','inline-block');   //show save button again if there are problems
                $("#save2__ID").css('display','inline-block');  //show save button again if there are problems
                return;
            };
        }
        var rid=record.ID;
        if(rid===null || rid===undefined) _record_add(I);
        else _record_modify(I);
    }
})
//-------------------------------------
$('#delete__ID').on('click', function(){
    var rid=_records[I].ID;
    if(rid==undefined){
        return;
    }
    if(confirm("Are you sure to delete?\n")){
        _record_delete(I,rid);
    }
})
//-------------------------------------
var _record_delete=function(I,rid){
    if(rid===undefined){
        return;
    }
    var options={pid:'__ID',rid:rid,dbv:{},
        callback:function(res,type){
            if(_after_submit!=='')  _after_submit(I,res,type,{});
            $vm.back({div:'__ID',form:1,refresh_back:1});
        }
    }
    if(_record_type=='s2') $vm.delete_record_s2(options);
    else $vm.delete_record(options);
};
//-------------------------------------
var _record_add=function(I){
    var tr=$('#tb__ID');
    var options={ pid:'__ID', records:_records, row_data:_row_data(I), I:I, dbv:_dbv,tr:tr,
        callback:function(res,n){
            if(_after_submit_form!=='')  _after_submit_form(I,res,n,_dbv);
            if(_after_submit!=='')  _after_submit(I,res,n,_dbv);
            _records[I].vm_dirty=0;
            $vm.back({div:'__ID',form:1,refresh_back:1});
        }
    }
    if(_record_type=='add_record_without_permission') $vm.add_record_without_permission(options);
    else if(_record_type=='s2') $vm.add_record_s2(options);
    else $vm.grid_add_record(options);
};
//---------------------------------------------
var _record_modify=function(I){
    var tr=$('#tb__ID');
    var options={ pid:'__ID', records:_records, row_data:_row_data(I), I:I, dbv:_dbv,tr:tr,
        callback:function(res,n){
            if(_after_submit_form!=='')  _after_submit_form(I,res,n,_dbv);
            if(_after_submit!=='')  _after_submit(I,res,n,_dbv);
            _records[I].vm_dirty=0;
            $vm.back({div:'__ID',form:1,refresh_back:1});
        }
    }
    if(_record_type=='s2') $vm.modify_record_s2(options);
    else $vm.grid_modify_record(options);
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
var _mlist=$vm.module_list;
var _mobj=$vm.vm['__ID'];
var _sys='';
var _config='';
var _ids='';
if(_mobj.op!=undefined && _mobj.op.sys!=undefined){
	_sys=_mobj.op.sys;
	if(_sys.config!=undefined){
		_config=_sys.config;
		if(_config.module_ids!=undefined){
			_ids=_config.module_ids;
		}
	}
}
//-----------------------------------------------
