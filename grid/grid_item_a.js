var _item_a_records;
var _item_a_records_removed;
var _item_a_req="";
var _item_a_db_pid='';
var _item_a_fields="";
var _item_a_headerA="";
var _item_a_headerB="";
var _item_a_cell_render='';
var _item_a_dbv={};
var _item_a_ppid='';
var _item_a_puid='';
var _item_a_before_submit='';
var _item_a_after_change='';
var _item_a_after_remove='';
var _item_a_cell_render='';
//-------------------------------------
var _item_a_set_req=function(){
    if(_item_a_puid==''){
        _item_a_req='';
        return;
    }
    var sql="with tb as (select Information,ID,UID,PUID,DateTime,Author,RowNum=row_number() over (order by ID DESC) ";
    sql+=" from [TABLE-"+_item_a_db_pid+"-@S1] where ppid=@I1 and puid=@I2)";
    sql+="select Information,ID,UID,PUID,DateTime,Author,RowNum from tb";
    _item_a_req={cmd:'query_records',sql:sql,i1:_item_a_ppid,i2:_item_a_puid}
}
//-------------------------------------
var _item_a_request_data=function(){
    _item_a_records_removed=[];
    _item_a_records=[];
    if(_item_a_req===''){
        _item_a_render();
        return;
    }
    $VmAPI.request({data:_item_a_req,callback:function(res){
        _item_a_records=res.records;
        _item_a_render();
    }})
}
//----------------------------------
var _item_a_create_header=function(){
    var cols=_item_a_fields.split(',');
    _item_a_headerA=[];
    _item_a_headerB=[];
    //------------------------------------
    for(var i=0;i<cols.length;i++){
        var th=cols[i];
        var thA=th.split('|')[0];
        var thB=th.split('|').pop().trim().replace(/ /g,'_');
        _item_a_headerA.push(thA);
        _item_a_headerB.push(thB);
    }
    //-------------------------
}
//-------------------------------------
var _item_a_render=function(I){
    var start=0;
    var max=_item_a_records.length;
    if(I!==undefined){
        start=I;
        max=I+1;
    }
    for(var i=start;i<max;i++){
        if(_item_a_records[i].vm_dirty===undefined) _item_a_records[i].vm_dirty=0;
        if(_item_a_records[i].vm_valid===undefined) _item_a_records[i].vm_valid={};
        if(_item_a_records[i].vm_custom===undefined) _item_a_records[i].vm_custom={};
        if(_item_a_records[i].vm_readonly===undefined) _item_a_records[i].vm_readonly={};
        if(_item_a_records[i].vm_validation===undefined) _item_a_records[i].vm_validation={};
    }

    var txt="";
    txt+="<tr><th></th>"
    //-------------------------
    _item_a_create_header();
    //-------------------------
    for(var i=0;i<_item_a_headerA.length;i++){
            var print='';
            var header_name=_item_a_headerA[i];
            if(_item_a_headerA[i][0]=='_'){
                print='class=c_print';
                header_name=header_name.replace('_','');
            }
            header_name=header_name.replace(/_/g,' ');
            var header_id=_item_a_headerB[i];
            txt+="<th "+print+" data-header="+header_id+">"+header_name+"</th>";
    }
    txt+"</tr>";
    for(var i=0;i<_item_a_records.length;i++){
        txt+="<tr><td>"+(i+1).toString()+"</td>";
        for(var j=0;j<_item_a_headerA.length;j++){
            var b=_item_a_headerB[j];
            var value="";
            if(_item_a_records[i][b]!==undefined) value=_item_a_records[i][b];
            var value=$('<div/>').text(value).html();
            value=value.replace(/\r/g,'\n').replace(/\n\n/g,'\n').replace(/\n/g,'<br>');
            var print='';
            if(_item_a_headerA[j][0]=='_') print='class=c_print';
            if($vm.edge==0) txt+="<td data-id="+b+" "+print+" contenteditable>"+value+"</td>";
            else if($vm.edge==1) txt+="<td data-id="+b+" "+print+" ><div contenteditable>"+value+"</div></td>";
        }
        txt+"</tr>";
    }
    $('#grid_item_a__ID').html(txt);
    //cell render
    $('#grid_item_a__ID td').each(function(){
        var col = $(this).parent().children().index($(this));
        var row = $(this).parent().parent().children().index($(this).parent())-1;
        var column_name=$('#grid_item_a__ID th:nth-child('+(col+1)+')').attr('data-header');
        //-------------------------
        if(column_name=='_Remove'){
            $(this).css('color','#666')
            $(this).css('width','50px')
            $(this).html("<u style='cursor:pointer'>Remove</u>");
            $(this).find('u').data('ID',_item_a_records[row].ID);
            $(this).find('u').on('click',function(){
                var rid=$(this).data('ID');
                if(rid!=undefined){
                    _item_a_remove(rid);
                }
                _item_a_records.splice(row, 1);
                _item_a_render();
                if(_item_a_after_remove!='') _item_a_after_remove();
            })
        }
        //-------------------------
        if(_item_a_cell_render!==''){
            _item_a_cell_render(_item_a_records,row,column_name,$(this),_item_a_set_value,'grid'); }
        //-------------------------
        if(column_name=='_Remove' || _item_a_records[row].vm_readonly[column_name]===true){
            if($vm.edge==0) $(this).removeAttr('contenteditable');
            else if($vm.edge==1) $(this).find('div:first').removeAttr('contenteditable');
            $(this).css('background-color','#F8F8F8')
        }
        if(_item_a_records[row].vm_custom[column_name]===true){
            if($vm.edge==0) $(this).removeAttr('contenteditable');
            else if($vm.edge==1) $(this).find('div:first').removeAttr('contenteditable');
        }
    })
    //------------------------------------
    //cell value process
    if($vm.edge==0) $('#grid_item_a__ID td').blur(function(){
        var col = $(this).parent().children().index($(this));
        var row = $(this).parent().parent().children().index($(this).parent())-1;
        var column_name=$('#grid_item_a__ID th:nth-child('+(col+1)+')').attr('data-header');
        if(column_name=='_Remove' || _item_a_records[row].vm_custom[column_name]===true){
            return;
        }
        var value=$(this).html().replace(/<div>/g,'').replace(/<\/div>/g,'\n').replace(/<br>/g,'\n');
        var value=$('<div/>').html(value).text();
        _item_a_set_value(value,_item_a_records,row,column_name);
        //alert(JSON.stringify(_item_a_records))
        if(_item_a_after_change!==''){ _item_a_after_change(_item_a_records,row,column_name,$(this),_item_a_set_value,'grid'); }
    })
    //------------------------------------
    if($vm.edge==1) $('#grid_item_a__ID td').find('div:first').blur(function(){
        var col = $(this).parent().parent().children().index($(this).parent()); //edge
        var row = $(this).parent().parent().parent().children().index($(this).parent().parent())-1; //edge
        var column_name=$('#grid_item_a__ID th:nth-child('+(col+1)+')').attr('data-header');
        if(column_name=='_Remove' || _item_a_records[row].vm_custom[column_name]===true){
            return;
        }
        var value=$(this).html().replace(/<div>/g,'').replace(/<\/div>/g,'\n').replace(/<br>/g,'\n');
        var value=$('<div/>').html(value).text();
        _item_a_set_value(value,_item_a_records,row,column_name);
        if(_item_a_after_change!==''){ _item_a_after_change(_item_a_records,row,column_name,$(this),_item_a_set_value,'grid'); }
    })
    //------------------------------------

    return;
}
//----------------------------------
var _item_a_set_value=function(value,records,I,column_name){
    if(value==="" && records[I][column_name]===undefined) return;
    if(value!==records[I][column_name]){
        records[I].vm_dirty=1;
        records[I][column_name]=value;
        $('#save__ID').css('background','#E00');
    }
}
//-----------------------------------------------
var _item_a_remove=function(rid){
    _item_a_records_removed.push(rid);
};
//-----------------------------------------------
var _item_a_delete=function(){
    for(var i=0;i<_item_a_records_removed.length;i++){
        var options={rid:_item_a_records_removed.length[i]}
        $vm.delete_record(options);
    }
};
//-----------------------------------------------
var _item_a_add=function(){
    var new_records;
    var new_row={}
    for(var i=0;i<_item_a_headerB.length;i++){
        var b=_item_a_headerB[i];
        if(b!=="ID" && b!=="_Remove"){
            new_row[b]="";
        }
    }
    _item_a_records.splice(0, 0, new_row);
    _item_a_render(0);
};
//-----------------------------------------------
var _item_a_save=function(db_pid,ppid,puid){
    _item_a_delete();
    for(var i=0;i<_item_a_records.length;i++){
        var ok=true;
        if((_item_a_records[i].ID===null || _item_a_records[i].ID===undefined) && _item_a_records[i].vm_dirty==1){
            _item_a_dbv={PPID:_item_a_ppid,PUID:_item_a_puid};
            if(_item_a_before_submit!=='')  ok=_item_a_before_submit(_item_a_records[i],_item_a_dbv)
            if(ok===true) _item_a_record_add(db_pid,i);
        }
        else if(_item_a_records[i].ID!==null && _item_a_records[i].ID!==undefined && _item_a_records[i].vm_dirty==1){
            _item_a_dbv={};
            if(_item_a_before_submit!=='')  ok=_item_a_before_submit(_item_a_records[i],_item_a_dbv)
            if(ok===true) _item_a_record_modefy(db_pid,i);
        }
    }
}
//-----------------------------------------------
var _item_a_record_add=function(db_pid,I){
    var tr=$('#grid_item_a__ID'+' tr:nth-child('+(I+2)+')');
    var options={ db_pid:db_pid, records:_item_a_records, row_data:_item_a_row_data(I), I:I, dbv:_item_a_dbv,tr:tr,callback:function(res,n){} }
    if(_record_type=='s2') $vm.add_record_s2(options);
    else $vm.grid_add_record(options);
};
//-----------------------------------------------
var _item_a_record_modefy=function(db_pid,I){
    var tr=$('#grid_item_a__ID'+' tr:nth-child('+(I+2)+')');
    var options={ db_pid:db_pid, records:_item_a_records, row_data:_item_a_row_data(I), I:I, dbv:_item_a_dbv,tr:tr, callback:function(res,n){} }
    if(_record_type=='s2') $vm.modify_record_s2(options);
    else $vm.grid_modify_record(options);
};
//-------------------------------------
var _item_a_row_data=function(I){
    var data={};
    for(var i=0;i<_item_a_headerB.length;i++){
        var a=_item_a_headerA[i][0];
        var b=_item_a_headerB[i];
        if(_item_a_headerA[i]=='_Hidden' || _item_a_headerA[i]=='_gridHidden' || (a!='_' && b!=="ID" && b!=="DateTime" && b!=="Author") ){
            if(_item_a_records[I][b]!==null) data[b]=_item_a_records[I][b];
        }
    }
    return data;
};
//-------------------------------------
