var _db_pid;//=$vm.module_list[$vm.vm['__ID'].name][0];
if(Array.isArray($vm.module_list[$vm.vm['__ID'].name])===true){
    _db_pid=$vm.module_list[$vm.vm['__ID'].name][0];
}
else{
    _db_pid=$vm.module_list[$vm.vm['__ID'].name]['table_id'];
}
$vm.vm['__ID'].db_pid=_db_pid;
var _module=$vm.module_list[$vm.vm['__ID'].name];
var _app_id='';
if(_module.var!==undefined) _app_id=_module.var.app_id;
var _op={}
var _export_order='';
var _fields;
var _fields_e='';
var _min_widthA="120px";
var _min_widthB="200px";
var _widthA="";
var _widthB="";
var _record_type='';
var _form_I='';
var _req='';
var _columns_process='';
var _table_process='';
var _busy_query='';
var _records_process=''
var _set_export_sql=''
var _from='';
var _to='';
var _filename='F'+_db_pid+'.csv';
var _headers;
var _columns;
var _table={};
var _records;
var _res='';
var _pre_data_process='';
var _data_process='';
var _data_process_after_render='';
var _cell_render='';
var _new_pre_data_process='';
var _before_change='';
var _after_change='';
var _before_submit='';
//var _after_render='';
var _after_submit='';
var _after_submit_all='';
var _N_total=0;
var _dbv={};
var _cell_value_process="";
var _grid_to_form_parameters={};
var _json=1;
var _new_process="";
//---------------------------------------------------------------
if($vm.server=='production') $('#how__ID').hide();
//---------------------------------------------------------------
var _set_from_to=function(){
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
var _set_headers=function(){
    _headers=[];
    _columns=[];
    var ay=_fields.split(',');
    for(var i=0;i<ay.length;i++){
        var a=ay[i].split('|')[0].replace(/_/g,' ');
        var b=ay[i].split('|').pop();
        if(a!=='_Hidden'){
            _headers.push(a);
            _columns.push({data:b});
        }
    }
    if(_columns_process!==''){ _columns_process(_columns); }
    if(_table_process!==''){ _table_process(_table);}
    if(_table!=={}){
        _table.DateTime={readOnly:true};
        _table.Author={readOnly:true};
        for(var i=0;i<ay.length;i++){
            if(_columns[i]!==undefined){
                var col=_columns[i].data;
                if(_table[col]!==undefined){
                    _columns[i]=_table[col];
                    _columns[i].data=col;
                }
            }
        }
    }
}
var _form_data=function(I,record){
    for (p in record) {
        if(_records[I][p]!==undefined && _records[I][p]!=record[p]){
            $('#save__ID').css('background','#E00');
        }
        _records[I][p]=record[p];
    }
    var hot=$('#excel__ID').handsontable('getInstance');
    hot.validateCells(function(valid){});
    $('#excel__ID').handsontable('render');
};
//-------------------------------------
var _set_req=function(){
    var sql="with tb as (select Information,ID,UID,PUID,DateTime,Author,RowNum=row_number() over (order by ID DESC) from [TABLE-"+_db_pid+"-@S1] )";
    sql+="select Information,ID,UID,PUID,DateTime,Author,RowNum from tb where RowNum between @I6 and @I7";
    var sql_n="select count(ID) from [TABLE-"+_db_pid+"-@S1]";
    _req={cmd:'query_records_iframe',db_pid:_db_pid,sql:sql,sql_n:sql_n,s1:'"'+$('#keyword__ID').val()+'"',I:$('#I__ID').text(),page_size:$('#page_size__ID').val()}
}
//-------------------------------------
var _set_req_export=function(i1,i2){
    /*
    var sql="with tb as (select Information,ID,UID,DateTime,Author,RowNum=row_number() over (order by ID DESC) from [TABLE-"+_db_pid+"] )";
    sql+="select Information,ID,UID,DateTime,Author,RowNum from tb";
    _set_from_to();
    if(_from!='0' && _to!='0') sql+=" where RowNum between @I6 and @I7";
    _req={cmd:'query_records',sql:sql,i6:_from,i7:_to}
    */

    var sql="with tb as (select Information,RowNum=row_number() over (order by ID DESC) from [TABLE-"+_db_pid+"-@S1] )";
    sql+="select Information from tb where RowNum between @I1 and @I2";
    _req={cmd:'query_records_iframe',sql:sql,i1:i1,i2:i2};
}
//-----------------------------------------------
var _sql_export="with tb as (select Information,RowNum=row_number() over (order by ID DESC) from [TABLE-"+_db_pid+"-@S1] )";
_sql_export+="select Information from tb where RowNum between @I1 and @I2";
//-----------------------------------------------
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
        sql=sql.replace('RowNum between @I6 and @I7',sql_where);
        sql_n+=" where "+sql_where;
    }
    //-------------------
    _req={cmd:'query_records',sql:sql,db_pid:_db_pid,sql_n:sql_n,s1:'"'+$('#keyword__ID').val()+'"',I:$('#I__ID').text(),page_size:$('#page_size__ID').val()}
}
//-------------------------------------
if($vm.module_list['busy_dialog_module']===undefined) $vm.module_list['busy_dialog_module']={table_id:'--------',url:'__BASE__/vmiis/Common-Code/dialog/busy_dialog_module.html'};
var _headerA="";
var _headerB="";
var _headerFormA="";
var _headerFormB="";
//-------------------------------------
var _create_header=function(){
    var cols=_fields.split(',');
    if(_res.pms=='1000'){
        cols=_fields.replace(',_Delete','').split(',');
        $('#new__ID').hide(); $('#save__ID').hide();
    }
    _headerA=[];
    _headerB=[];
    _headerFormA=[];
    _headerFormB=[];
    //------------------------------------
    //table
    for(var i=0;i<cols.length;i++){
        var th=cols[i];
        var thA=th.split('|')[0];
        var thB=th.split('|').pop().trim().replace(/ /g,'_').replace('...','');
        //create grid header and id
        _headerA.push(thA);
        _headerB.push(thB);
        //create form lable and id
        if(thA[0]!='_'){
            _headerFormA.push(thA);
            _headerFormB.push(thB);
        }
        else if(thA==='_gridHidden'){
            var b=th.split('|').pop();
            var as=th.split('|'); as.pop();
            var a=as.pop();
            if(a==undefined || a=='_gridHidden') a=b;
            _headerFormA.push(a);
            _headerFormB.push(b);
        }
    }
    //-------------------------
}
//-------------------------------------
var _render=function(I){
    var start=0;
    var max=_records.length;
    if(I!==undefined){
        start=I;
        max=I+1;
    }
    for(var i=start;i<max;i++){
        if(_records[i].DateTime!==undefined){
            _records[i].DateTime=_records[i].DateTime.substring(0,10);
        }
        if(_records[i].vm_dirty===undefined) _records[i].vm_dirty=0;
        if(_records[i].vm_valid===undefined) _records[i].vm_valid={};
        if(_records[i].vm_custom===undefined) _records[i].vm_custom={};
        if(_records[i].vm_readonly===undefined) _records[i].vm_readonly={};
        if(_records[i].vm_validation===undefined) _records[i].vm_validation={};
    }

    var txt="";
    txt+="<tr><th><u id=refresh__ID style='cursor:pointer'><b>↻</b></u></th>"
    //-------------------------
    _create_header();
    //-------------------------
    for(var i=0;i<_headerA.length;i++){
        if(_headerA[i]!=='_Hidden' && _headerA[i]!=='_gridHidden'){
            var print='';
            var header_name=_headerA[i];
            if(_headerA[i][0]=='_'){
                print='class=c_print';
                header_name=header_name.replace('_','');
            }
            //if(_headerA[i]=='_Form' || _headerA[i]=='_Delete') print='class=c_print';
            //var header_name=_headerA[i];
            //if(header_name=="_Form") header_name="Form";
            //if(header_name=="_Delete") header_name="Delete";
            header_name=header_name.replace(/_/g,' ');
            var header_id=_headerB[i]; if(_headerA[i]=='_Form') header_id='_Form';
            if(header_name.indexOf('...')!==-1) header_name='<span style="cursor:pointer" title="'+header_name.replace('...','')+'">'+header_name.split('...')[0]+'...'+'</span>';
            txt+="<th "+print+" data-header="+header_id+">"+header_name+"</th>";
        }
    }
    txt+"</tr>";
    for(var i=0;i<_records.length;i++){
        txt+="<tr><td>"+(i+1).toString()+"</td>";
        for(var j=0;j<_headerA.length;j++){
            if(_headerA[j]!=='_Hidden' && _headerA[j]!=='_gridHidden'){
                var b=_headerB[j];
                var value="";
                if(_records[i][b]!==undefined) value=_records[i][b];
                value=value.toString();
                value=$('<div/>').text(value).html();
                value=value.replace(/\n/g,'<br>');
                var print='';
                if(_headerA[j][0]=='_') print='class=c_print';
                if($vm.edge==0) txt+="<td data-id="+b+" "+print+" contenteditable>"+value+"</td>";
                else if($vm.edge==1) txt+="<td data-id="+b+" "+print+" ><div contenteditable>"+value+"</div></td>";
            }
        }
        txt+"</tr>";
    }
    $('#grid__ID').html(txt);
    $('#refresh__ID').on('click', function(){ _set_req(); _request_data();})
    //------------------------------------
    //cell render
    $('#grid__ID td').each(function(){
        var col = $(this).parent().children().index($(this));
        var row = $(this).parent().parent().children().index($(this).parent())-1;
        var column_name=$('#grid__ID th:nth-child('+(col+1)+')').attr('data-header');
        //-------------------------
        if(column_name=='_Form'){
            var data_id=$(this).attr('data-id');
            $(this).css('color','#666')
            $(this).html("<u style='cursor:pointer'>Form</u>");
            $(this).find('u').on('click',function(){
                _form_I=row;
                var this_module_name=$vm.vm['__ID'].name;
                var form_module_name=$vm.module_list[this_module_name].form_module;
                if(form_module_name===undefined){
                    var name='grid_form';
                    $vm.module_list[name]=[_db_pid.toString(),'__BASE__/vmiis/Common-Code/grid/form2.html',''];
                    $vm.load_module_by_name(name,$vm.root_layout_content_slot,
                        {records:_records,res:_res,I:row,headerA:_headerFormA,headerB:_headerFormB,cell_render:_cell_render,widthA:_widthA,widthB:_widthB,min_widthA:_min_widthA,min_widthB:_min_widthB,
                            before_submit:_before_submit,
                            after_submit:_after_submit,
                            after_change:_after_change,
                            before_change:_before_change,
                            cell_value_process:_cell_value_process,
                            save_style:$('#save__ID').css('display'),
                            app_id:_app_id,
                            record_type:_record_type,
                            row_data:_row_data,
                            json:_json,
                        }
                    );
                }
                else{
                    if($vm.module_list[form_module_name]===undefined){
                        alert('Can not find "'+form_module_name+'" in the module list');
                        return;
                    }
                    $vm.load_module_by_name(form_module_name,$vm.root_layout_content_slot,
                        {   records:_records,res:_res,I:row,
                            headerA:_headerFormA,headerB:_headerFormB,
                            cell_render:_cell_render,
                            before_submit:_before_submit,
                            after_submit:_after_submit,
                            after_change:_after_change,
                            before_change:_before_change,
                            cell_value_process:_cell_value_process,
                            from_grid:'1',
                            grid_to_form_parameters:_grid_to_form_parameters,
                            save_style:$('#save__ID').css('display'),
                            app_id:_app_id,
                            record_type:_record_type,
                            row_data:_row_data,
                            json:_json,
                        }
                    );
                }
            })
        }
        //-------------------------
        if(column_name=='_Delete'){
            $(this).css('color','#666')
            $(this).html("<u style='cursor:pointer'>Delete</u>");
            $(this).find('u').data('ID',_records[row].ID);
            $(this).find('u').on('click',function(){
                var rid=$(this).data('ID');
                if(confirm("Are you sure to delete?\n")){
                    _N_total=1;
                    _record_delete(row,rid);
                }
            })
        }
        //-------------------------
        if(_cell_render!==''){ _cell_render(_records,row,column_name,$(this),_set_value,'grid'); }
        //-------------------------
        if(column_name=='_Form' || column_name=='_Delete' || column_name=='DateTime' || column_name=='Author' || _records[row].vm_readonly[column_name]===true){
            if($vm.edge==0) $(this).removeAttr('contenteditable');
            else if($vm.edge==1) $(this).find('div:first').removeAttr('contenteditable');
            $(this).css('background-color','#F8F8F8')
        }
        if(_records[row].vm_custom[column_name]===true){
            if($vm.edge==0) $(this).removeAttr('contenteditable');
            else if($vm.edge==1) $(this).find('div:first').removeAttr('contenteditable');
        }
    })
    //------------------------------------
    //cell value process
    if($vm.edge==0) $('#grid__ID td').blur(function(){
        var col = $(this).parent().children().index($(this));
        var row = $(this).parent().parent().children().index($(this).parent())-1;
        var column_name=$('#grid__ID th:nth-child('+(col+1)+')').attr('data-header');
        if(column_name=='_Form' || column_name=='_Delete' || _records[row].vm_custom[column_name]===true){
            return;
        }
        var value=$(this).html().replace(/<div>/g,'').replace(/<\/div>/g,'\n').replace(/<br>/g,'\n');
        var value=$('<div/>').html(value).text();

        if(_cell_value_process!=="") value=_cell_value_process(value,column_name);
        _set_value(value,_records,row,column_name);
        var fun=_records[row].vm_validation[column_name];
        if(fun!==undefined){
            $(this).css('background','#FFF');
            _records[row].vm_valid[column_name]=1;
            var R=fun(value);
            $(this).prop('title', R);
            if(R!==""){
                $(this).css('background','#E4CDCD');
                _records[row].vm_valid[column_name]=0;
            }
        }
        if(_after_change!==''){ _after_change(_records,row,column_name,$(this),_set_value,'grid'); }
    })
    //------------------------------------
    if($vm.edge==1) $('#grid__ID td').find('div:first').blur(function(){
        var col = $(this).parent().parent().children().index($(this).parent()); //edge
        var row = $(this).parent().parent().parent().children().index($(this).parent().parent())-1; //edge
        var column_name=$('#grid__ID th:nth-child('+(col+1)+')').attr('data-header');
        if(column_name=='_Form' || column_name=='_Delete' || _records[row].vm_custom[column_name]===true){
            return;
        }
        var value=$(this).html().replace(/<div>/g,'').replace(/<\/div>/g,'\n').replace(/<br>/g,'\n');
        var value=$('<div/>').html(value).text();
        if(_cell_value_process!=="") value=_cell_value_process(value,column_name);
        _set_value(value,_records,row,column_name);
        var fun=_records[row].vm_validation[column_name];
        if(fun!==undefined){
            $(this).css('background','#FFF');
            _records[row].vm_valid[column_name]=1;
            var R=fun(value);
            $(this).prop('title', R);
            if(R!==""){
                $(this).css('background','#E4CDCD');
                _records[row].vm_valid[column_name]=0;
            }
        }
        if(_after_change!==''){ _after_change(_records,row,column_name,$(this),_set_value,'grid'); }
    })
    //------------------------------------
}
var _simple_render=function(){
    var start=0;
    var max=_records.length;
    var txt="";
    txt+="<tr><th></th>"
    //-------------------------
    _create_header();
    //-------------------------
    for(var i=0;i<_headerA.length;i++){
        if(_headerA[i]!=='_Hidden' && _headerA[i]!=='_gridHidden'){
            var print='';
            var header_name=_headerA[i];
            if(_headerA[i][0]=='_'){
                print='class=c_print';
                header_name=header_name.replace('_','');
            }
            header_name=header_name.replace(/_/g,' ');
            var header_id=_headerB[i]; if(_headerA[i]=='_Form') header_id='_Form';
            if(header_name.indexOf('...')!==-1) header_name='<span style="cursor:pointer" title="'+header_name.replace('...','')+'">'+header_name.split('...')[0]+'...'+'</span>';
            txt+="<th "+print+" data-header="+header_id+">"+header_name+"</th>";
        }
    }
    txt+"</tr>";
    for(var i=0;i<_records.length;i++){
        txt+="<tr><td>"+(i+1).toString()+"</td>";
        for(var j=0;j<_headerA.length;j++){
            if(_headerA[j]!=='_Hidden' && _headerA[j]!=='_gridHidden'){
                var b=_headerB[j];
                var value="";
                if(_records[i][b]!==undefined) value=_records[i][b];
                value=value.toString();
                value=value.replace(/<br>/g,'\n');
                value=$('<div/>').html(value).text();
                value=value.replace(/\n/g,'<br>');
                txt+="<td>"+value+"</td>";
            }
        }
        txt+"</tr>";
    }
    $('#grid__ID').html(txt);
    //------------------------------------
}
var _set_value=function(value,records,I,column_name){
    if(value==="" && records[I][column_name]===undefined) return;
    if(value!==records[I][column_name]){
        records[I].vm_dirty=1;
        records[I][column_name]=value;
        $('#save__ID').css('background','#E00');
    }
}
//var mt1;
var _request_data=function(){
    if(_req==='') return;
    //_set_headers();
    if(_busy_query!=='') $vm.open_dialog({name:'busy_dialog_module'});
    var mt1=new Date().getTime();
    //$VmAPI.request({data:_req,callback:function(res){
    $vm.post_message_from_child_to_parent(_req,'*',function(res){
        if(_busy_query!=='') $vm.close_dialog({name:'busy_dialog_module'});
        $("#I__ID").text(res.I);
        $("#A__ID").text(res.A);
        var mt2=new Date().getTime();
        var tt_all=mt2-mt1;
        var tt_server=parseInt(res.elapsed);
        if(tt_all<tt_server) tt_all=tt_server;
        $("#elapsed__ID").text((JSON.stringify(res.records).length/1000).toFixed(1)+"kb/"+tt_all.toString()+"ms/"+tt_server+'ms');
        $('#save__ID').css('background','');
        _records=res.records;
        _res=res;
        _json=0;
        if(_res.json=='1') _json=1;
        if(_data_process!==''){ _data_process(); }
        _render();
        if(_data_process_after_render!==''){ _data_process_after_render('grid'); }
        if($vm.iframe_height!=undefined) $vm.iframe_height();
    })
}
var _export_data=function(){
    var g_I,gLoop,busy,results,gDialog_module_id;
    var one_loop=function(){
        if(busy==1) return;
        busy=1;
        var start=$('#start__ID').val();  if(start==="") start=1;
        var page_size=parseInt($('#page_size__ID').val());
        var i1=1+(start-1+g_I)*page_size,i2=i1+page_size-1;
        _set_req_export(i1.toString(),i2.toString());
        //$VmAPI.request({data:_req,callback:function(res){
        $vm.post_message_from_child_to_parent(_req,'*',function(res){
            busy=0;
            $('#export_num'+gDialog_module_id).text("Page "+(g_I+1).toString());
            if(res.records.length!=0){
                for(var i=0;i<res.records.length;i++){
                    results.push(res.records[i]);
                }
            }
            else{
                end_export();
                return;
            }
            g_I++;
            var num=$('#num__ID').val();
            if(num!=''){
                num=parseInt(num);
                if(g_I>num){
                    end_export();
                    return;
                }
            }
        })
    }
    //-------------------------------------
    var start_export=function(){
        g_I=0;busy=0;results=[];
        gDialog_module_id=$vm.get_module_id({name:'_system_export_dialog_module'})
        $('#export_num'+gDialog_module_id).text("Page 0");
        $vm.open_dialog({name:'_system_export_dialog_module'});
        gLoop=setInterval(one_loop, 500);
    }
    //-------------------------------------
    var end_export=function(){
        clearInterval(gLoop);
        $vm.close_dialog({name:'_system_export_dialog_module'});
        if(_fields_e==='') _fields_e=_fields.replace('_Form,','').replace(',_Delete','');
        $vm.download_csv({name:_filename,data:results,fields:_fields_e});
    }
    //-------------------------------------
    start_export();
}
var _to_true_and_false=function(v){
    if(v==="True") return true;
    else if(v==='1') return true;
    else if(v==='on') return true;
    else return false;
};
//-------------------------------------
function _process_postcode(changes,source,Suburb,iS,Postcode,iP,State,iT){
    if(source=="edit"){
        var I=changes[0][0];
        var p=changes[0][1];
        var v=changes[0][3];
        var items=v.split('/');
        var hot = $('#excel__ID').handsontable('getInstance');
        if(p===Suburb){
            changes[0][3]=items[0];
            hot.setDataAtCell(I, iP, items[2], '');
            hot.setDataAtCell(I, iT, items[1], '');
        }
        if(p==="Postcode"){
            changes[0][3]=items[2];
            hot.setDataAtCell(I, iS, items[0], '');
            hot.setDataAtCell(I, iT, items[1], '');
        }
    }
}
//-------------------------------------
if($vm.module_list['uploading_file_dialog_module']===undefined) $vm.module_list['uploading_file_dialog_module']=['--------','__BASE__/vmiis/Common-Code/dialog/uploading_file_dialog_module.html','2']
$vm.load_module_by_name('uploading_file_dialog_module','',{})
var _record_add=function(I){
    var tr=$('#grid__ID'+' tr:nth-child('+(I+2)+')');
    var options={ json:_json,pid:'__ID', records:_records, row_data:_row_data(I), I:I, dbv:_dbv,tr:tr,
        callback:function(res,type){
            if(_after_submit!=='')  _after_submit(I,res,type,_dbv);
            _N_total--;
            if( _N_total===0 ){
                if(_after_submit_all!=='') _after_submit_all(type,res);
                _set_req(),_request_data();
            }
        }
    }
    if(_record_type=='s2') $vm.add_record_s2(options);
    else $vm.grid_add_record_iframe(options);
};
var _record_modefy=function(I){
    var tr=$('#grid__ID'+' tr:nth-child('+(I+2)+')');
    var options={ json:_json, pid:'__ID', records:_records, row_data:_row_data(I), I:I, dbv:_dbv,tr:tr,
        callback:function(res,type){
            if(_after_submit!=='')  _after_submit(I,res,type,_dbv);
            _N_total--;
            if( _N_total===0 ){
                if(_after_submit_all!=='') _after_submit_all(type,res);
                _request_data();
            }
        }
    }
    if(_record_type=='s2') $vm.modify_record_s2(options);
    else $vm.grid_modify_record_iframe(options);
};
var _record_delete=function(I,rid){
    if(rid===undefined){
        _request_data();
        return;
    }
    var options={pid:'__ID',rid:rid,dbv:_dbv,
        callback:function(res,n){
            if(_after_submit!=='')  _after_submit(I,res,n,_dbv);
            _N_total--;
            if( _N_total===0 ){
                if(_after_submit_all!=='') _after_submit_all('delete',res);
                _request_data();
            }
        }
    }
    if(_record_type=='s2') $vm.delete_record_s2(options);
    else $vm.delete_record_iframe(options);
};
var _row_data=function(I){
    var data={};
    for(var i=0;i<_headerB.length;i++){
        var a=_headerA[i][0];
        var b=_headerB[i];
        if(_headerA[i]=='_Hidden' || _headerA[i]=='_gridHidden' || (a!='_' && b!=="ID" && b!=="DateTime" && b!=="Author") ){
            if(_records[I][b]!==null) data[b]=_records[I][b];
        }
    }
    return data;
};
//-------------------------------------
var _set_image_url=function($obj,rid,filename,modified){
    if(rid===undefined) return;
    var ext=filename.split('.').pop();
    var thumb=filename+'_thumb.'+ext;
    var p='S'+rid;
    if($vm.vm['__ID'][p]!==undefined) $obj.attr('src',$vm.vm['__ID'][p]);
    /*
    else{
        $vm.s3_link({rid:rid,filename:thumb,days:'7',modified:modified,callback:function(url){
            $vm.vm['__ID'][p]=url;
            $obj.attr('src',url);
        }});
    }
    */
    else{
        var src_ID='S'+rid+new Date(modified).getTime()+'_'+$vm.version;
        var src_ID_day='D'+rid+new Date(modified).getTime()+'_'+$vm.version;
        var src=localStorage.getItem(src_ID);
        var src_Day=localStorage.getItem(src_ID_day);
        var D0=new Date(src_Day);
        var D1=new Date();
        var dif = D1.getTime() - D0.getTime();
        dif=dif/1000/3600/24;
        if(src!==null && dif<6){
            $obj.attr('src',src);
        }
        else{
            $vm.s3_link({rid:rid,filename:thumb,days:'7',modified:modified,callback:function(url){
                $vm.vm['__ID'][p]=url;
                $obj.attr('src',url);
                localStorage.setItem(src_ID,url);
                localStorage.setItem(src_ID_day,new Date().toString());
            }});
        }
    }
};
//-------------------------------------
var _show_photo=function(rid,filename,modified) {
    var p='L'+rid;
    if($vm.vm['__ID'][p]!==undefined){
        var url=$vm.vm['__ID'][p];
        window.open(url,'resizable=1');
    }
    else{
        jQuery.ajaxSetup({async:false});
        var src='';
        $vm.s3_link({rid:rid,filename:filename,days:'1',modified:modified,callback:function(url){
            $vm.vm['__ID'][p]=url;
            src=url;
        }});
        jQuery.ajaxSetup({async:true});
        window.open(src,'Image','resizable=1');
    }
}
//-------------------------------------
//Import
if($vm.module_list['import_dialog_module']===undefined) $vm.module_list['import_dialog_module']=['--------','__BASE__/vmiis/Common-Code/dialog/import_dialog_module.html','2']
$vm.load_module_by_name('import_dialog_module','',{})
function import_handleFileSelect(evt) {
    var files = evt.target.files;
    if(files.length>0){
        var reader = new FileReader();
        reader.onload = (function(e) {
            var contents = e.target.result;
            var lines=contents.replace(/\r/g,'\n').replace(/\n\n/g,'\n').split('\n');
            if(lines.length>1){
                var tab='\t';
                var n1=lines[0].split('\t').length;
                var n2=lines[0].split(',').length;
                if(n2>n1) tab=',';
                var header=lines[0].replace(/ /g,'_').splitCSV(tab);
                var flds=_fields.split(',');
                var fn=$('#import_f__ID').val().substring($('#import_f__ID').val().lastIndexOf('\\')+1);
                if(confirm("Are you sure to import "+fn+"?\n")){
                    $vm.open_dialog({name:'import_dialog_module'});
                    var I=0;
                    var i=1;
                    jQuery.ajaxSetup({async:false});
                    (function looper(){
                        if( i<lines.length ) {
                            var items=lines[i].splitCSV(tab);
                            if(items.length>=2 || (items.length==1 && items[0]!=='') ){
                                var rd={};
                                for(var j=0;j<flds.length;j++){
                                    var field_name=flds[j].split('|')[0];
                                    var field_id=flds[j].split('|').pop();
                                    var index=header.indexOf(field_name.replace(/ /g,'_'));
                                    if(index!=-1)  rd[field_id]=items[index];
                                }
                                if(jQuery.isEmptyObject(rd)===false){
                                    if(_before_submit!==''){
                                        _dbv={};
                                        _before_submit(rd,_dbv);
                                    }
                                    I++;
                                    var req={cmd:"add_record",db_pid:_db_pid.toString(),data:rd,dbv:_dbv};
                                    $VmAPI.request({data:req,callback:function(res){}})
                                }
                                var mid;//=$vm.module_list['import_dialog_module'][0];
                            	var url;//=$vm.module_list['import_dialog_module'][1];
                                if(Array.isArray($vm.module_list['import_dialog_module'])===true){
                                    mid=$vm.module_list['import_dialog_module'][0];
                                	url=$vm.module_list['import_dialog_module'][1];
            					}
            					else{
                                    mid=$vm.module_list['import_dialog_module']['table_id'];
                                	url=$vm.module_list['import_dialog_module']['url'];
            					}
                            	var pid=$vm.id(url+mid);
                                $('#import_num'+pid).text(I.toString());
                            }
                            i++;
                            setTimeout( looper, 100);
                        }
                        else{
                            $vm.close_dialog({name:'import_dialog_module'});
                            alert(I.toString()+" records have been imported.");
                            _request_data();
                        }
                    })();
                    jQuery.ajaxSetup({async:true});
                }
            }
            else alert("No data rows in the file.");
        });
        reader.readAsText(files[0]);
    }
}
if(document.getElementById('import_f__ID')!==null) document.getElementById('import_f__ID').addEventListener('change', import_handleFileSelect,false);
//-------------------------------------
$('#search__ID').on('click',function(){   _set_req(); _request_data(); })
$('#query__ID').on('click',function(){    _set_req(); _request_data(); })
$('#export__ID').on('click',function(){   _export_data(); })
$('#import__ID').on('click',function(){
    $('#import_f__ID').val('');
    $('#import_f__ID').trigger('click');
});
//-----------------------------------------------
//---------------------------------------------
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
    //var req={cmd:'back'}
    //window.parent.postMessage(req,'*');
});
//---------------------------------------------
$('#new__ID').on('click', function(){
    if(_new_process!=""){
        if(_new_process()==false) return;
    }
    var new_records;
    var new_row={}
    for(var i=0;i<_headerB.length;i++){
        var b=_headerB[i];
        if(b!=="ID" && b!=="DateTime" && b!=="Author" && b!=="_Form" && b!=="_Delete"){
            new_row[b]="";
        }
    }
    _records.splice(0, 0, new_row);
    if(_new_pre_data_process!==''){
        _new_pre_data_process();
    }
    _render(0);
    /*
    var hot = $('#excel__ID').handsontable('getInstance');
    hot.alter('insert_row', 0, 1);
    _records[0].ID=undefined;
    _records[0].vm_dirty=0;
    _records[0].vm_valid={};
    if(_new_pre_data_process!==''){
        _new_pre_data_process();
    }
    */
});
//-----------------------------------------------
$('#save__ID').on('click', function(){ //ADD and MODIFY entry point
    $('#save__ID').css('background','');
    _N_total=0;
    for(var i=0;i<_records.length;i++){
        var ok=true;
        var valid=1;
        for (p in _records[i].vm_valid) {
            if(_records[i].vm_valid[p]===0) valid=0;
        }
        if((_records[i].ID===null || _records[i].ID===undefined) && _records[i].vm_dirty==1 && valid==1 ){
            if(_before_submit!==''){
                _dbv={};
                var r=_before_submit(_records[i],_dbv);
                if(r===false){
                    ok=false;
                }
            }
            if(ok===true){
                _N_total++;
                _record_add(i);
            }
        }
        else if(_records[i].ID!==null && _records[i].ID!==undefined && _records[i].vm_dirty==1 && valid==1 ){
            if(_before_submit!==''){
                _dbv={};
                var r=_before_submit(_records[i],_dbv);
                if(r===false){
                    ok=false;
                }
            }
            if(ok===true){
                _N_total++;
                _record_modefy(i);
            }
        }
    }
})
//-----------------------------------------------
$('#D__ID').on('form_back',function(){
    if(_records[_form_I].vm_dirty===1) $('#save__ID').css('background','#E00');
    _render(_form_I);
})
//-----------------------------------------------
$('#D__ID').on('refresh_back',function(){
    _set_req(); _request_data();
})
//-----------------------------------------------
$('#D__ID').on('load_form_module',function(event,trigger_parameters){
    var this_module_name=$vm.vm['__ID'].name;
    var other_module_name=$vm.module_list[this_module_name]['form_module'];
    if(other_module_name!=undefined){
        $vm.load_module_by_name(other_module_name,$vm.root_layout_content_slot,
            {   records:_records,I:0,
                headerA:_headerA,headerFormB:_headerFormB,
                cell_render:_cell_render,
                before_submit:_before_submit,
                after_submit:_after_submit,
                after_change:_after_change,
                before_change:_before_change,
                cell_value_process:_cell_value_process,
                from_grid:'0',
                grid_to_form_parameters:_grid_to_form_parameters,
                trigger_parameters:trigger_parameters,
                record_type:_record_type,
                row_data:_row_data,
            }
        );
    }
    else{
        alert('Can not find form module for "'+this_module_name+'" in the module list');
    }
})
//-----------------------------------------------
$('#D__ID').on('load_quest_form_module',function(event,trigger_parameters){
    var name='grid_form_quest';
    $vm.module_list[name]={table_id:_db_pid.toString(),url:'__BASE__/vmiis/Common-Code/grid/form_quest.html'};
    $vm.load_module_by_name(name,$vm.root_layout_content_slot,
        {   records:_records,res:_res,I:0,
            headerA:_headerFormA,headerB:_headerFormB,
            cell_render:_cell_render,
            widthA:_widthA,widthB:_widthB,min_widthA:_min_widthA,min_widthB:_min_widthB,
            before_submit:_before_submit,
            after_submit:_after_submit,
            after_change:_after_change,
            before_change:_before_change,
            cell_value_process:_cell_value_process,
            save_style:$('#save__ID').css('display'),
            app_id:_app_id,
            record_type:_record_type,
            row_data:_row_data,
            trigger_parameters:trigger_parameters,
        }
    );
})
//-----------------------------------------------
