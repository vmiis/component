var _db_pid;//=$vm.module_list[$vm.vm['__ID'].name][0];
if(Array.isArray($vm.module_list[$vm.vm['__ID'].name])===true){
    _db_pid=$vm.module_list[$vm.vm['__ID'].name][0];
}
else{
    _db_pid=$vm.module_list[$vm.vm['__ID'].name]['table_id'];
}
$vm.vm['__ID'].db_pid=_db_pid;
var _export_order='';
var _fields;
var _fields_e='';
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
var _pre_data_process='';
var _data_process='';
var _new_pre_data_process='';
var _before_change='';
var _after_change='';
var _before_submit='';
var _after_render='';
var _after_submit='';
var _after_submit_all='';
var _N_total=0;
var _dbv={};
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
        if(a!=='Hidden'){
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
    _req={cmd:'query_records',db_pid:_db_pid,sql:sql,sql_n:sql_n,s1:'"'+$('#keyword__ID').val()+'"',I:$('#I__ID').text(),page_size:$('#page_size__ID').val()}
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
    _req={cmd:'query_records',sql:sql,db_pid:_db_pid,sql_n:sql_n,s1:'"'+$('#keyword__ID').val()+'"',I:$('#I__ID').text(),page_size:$('#page_size__ID').val()}
}
//-------------------------------------
var _set_req_export=function(){
    var sql="with tb as (select Information,ID,UID,DateTime,Author,RowNum=row_number() over (order by ID DESC) from [TABLE-"+_db_pid+"] )";
    sql+="select Information,ID,UID,DateTime,Author,RowNum from tb";
    _set_from_to();
    if(_from!='0' && _to!='0') sql+=" where RowNum between @I6 and @I7";
    _req={cmd:'query_records',sql:sql,i6:_from,i7:_to}
}
//-----------------------------------------------
//context menu
var _context_menu_callback=function(key, options){
    if (key === "0") {
        var rd=_records[options.start.row];
        var slot=$('#D__ID').data('back_slot');
        var nm="Details"; if(typeof(form_title)!=='undefined') nm=form_title;
        //$(this).vm6('load_module','20007423',slot,{record:rd,fields:fields,form_title:nm,I:options.start.row,form_data:form_data});
        var mid='';
        var url='__BASE__/wappsystem/Common-Modules/system/hot_form.html'
        var src='https://github.com/wappsystem/Common-Modules/blob/master/system/hot_form.html'
        var param={
            name:name,
            pid:$vm.id(url+mid),
            slot:slot,
            url:$vm.url(url),
            source:src,
            op:{record:rd,fields:_fields,form_title:nm,I:options.start.row,form_data:_form_data}
        }
        $vm.load_module(param);
    }
    if (key === "1") {
        var rd=_records[options.start.row];
        var slot=$('#D__ID').data('back_slot');
        var nm="Details"; if(typeof(form_title)!=='undefined') nm=form_title;
        //$(this).vm6('load_module','20007642',slot,{record:rd,form_title:nm});
        var mid='';
        var url='__BASE__/wappsystem/Common-Modules/system/hot_form_json_data.html'
        var src='https://github.com/wappsystem/Common-Modules/blob/master/system/hot_form.html'
        var param={
            name:name,
            pid:$vm.id(url+mid),
            slot:slot,
            url:$vm.url(url),
            source:src,
            op:{record:rd,form_title:nm}
        }
        $vm.load_module(param);
    }
}
var _contextMenu={
    callback: _context_menu_callback,
    items:['Form','Json','remove_row']
}
//-----------------------------------------------
//before and after
var _beforeChange=function(changes,source){
    if(_before_change!==''){
        _before_change(changes,source);
    }
}
var _afterChange=function(changes,source){
    if(source=="edit"){
        var I=changes[0][0];
        var C=changes[0][1];
        var b=changes[0][2];
        var a=changes[0][3];
        if(b!==a){
            _records[I].vm_dirty=1;
        }
        if(_records[I].vm_dirty===1) $('#save__ID').css('background','#E00');
        if(_after_change!==''){
            _after_change(_records[I],C);
        }
        $('#excel__ID').handsontable('render');
    }
};
var _beforeRemoveRow=function(index,amount){    //DELETE entyr point
    if(confirm("Are you sure to delete?\n")){
        /*
        var R=true;
        for(var i=0;i<amount;i++){
            var rid=_records[index+i].ID;
            if(_before_submit!==''){
                _dbv={};
                _before_submit(_records[index+i],_dbv);
            }
            jQuery.ajaxSetup({async:false});
            var iR=_record_delete(index+i,rid);
            jQuery.ajaxSetup({async:true});
            if(iR===false) R=false;
        }
        return R;
        */

        _N_total=0;
        for(var i=0;i<amount;i++){
            var ok=true;
            var rid=_records[index+i].ID;
            if(_before_submit!==''){
                _dbv={};
                var r=_before_submit(_records[index+i],_dbv);
                if(r===false){
                    ok=false;
                }
            }
            if(ok===true){
                _N_total++;
                _record_delete(index+i,rid);
            }
        }
        return true;
    }
    else return false;
};
var _afterValidate=function(isValid,value,row,prop,source){
    if(isValid===false) _records[row].valid=0;
    if(isValid===false) _records[row].vm_valid[prop]=0;
    else _records[row].vm_valid[prop]=1;
}
var _afterRender=function(){
    if(_after_render!==''){
        _after_render();
    }
}
//-------------------------------------
if($vm.module_list['busy_dialog_module']===undefined) $vm.module_list['busy_dialog_module']=['--------','__BASE__/vmiis/Common-Code/dialog/busy_dialog_module.html','2']
//request data from server
var _request_data=function(){
    if(_req==='') return;
    _set_headers();
    if(_busy_query!=='') $vm.open_dialog({name:'busy_dialog_module'});
    $VmAPI.request({data:_req,callback:function(res){
        if(_busy_query!=='') $vm.close_dialog({name:'busy_dialog_module'});
        $("#I__ID").text(res.I);
        $("#A__ID").text(res.A);
        $("#elapsed__ID").text(res.elapsed+'ms');
        _records=res.records;
        for(var i=0;i<_records.length;i++){
            if(_records[i].DateTime!==undefined){
                _records[i].DateTime=_records[i].DateTime.substring(0,10);
            }
            _records[i].vm_dirty=0;
            _records[i].vm_valid={};
        }
        if(_pre_data_process!==''){ _pre_data_process(); }
        var top1=$('#excel_container__ID').offset().top;
        $('#excel_container__ID').css('height',$(window).height()-top1-$('#'+$vm.root_layout_footer).outerHeight()+'px');
        $('#save__ID').css('background','');
        var ht=$('#excel__ID').handsontable({
            data: _records,
            colHeaders:_headers,
            columns:_columns,
            rowHeaders: true,
            manualColumnResize: true,
            fillHandle: false,
            contextMenu:_contextMenu,
            beforeChange:_beforeChange,
            afterChange:_afterChange,
            beforeRemoveRow:_beforeRemoveRow,
            afterValidate:_afterValidate,
            afterRender:_afterRender,
        });
        if(_records_process!==''){ _records_process(_records); }
        if(_data_process!==''){ _data_process(); }
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
//---------------------------------------------
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
    var options={ pid:'__ID', records:_records, row_data:_row_data(I), I:I, dbv:_dbv,
        callback:function(res,n){
            if(_after_submit!=='')  _after_submit(I,res,n,_dbv);
            _N_total--;
            if( _N_total===0 ){
                if(_after_submit_all!=='') _after_submit_all('add',res);
                _set_req(),_request_data();
            }
        }
    }
    $vm.add_record_v2(options);
};
var _record_modefy=function(I){
    var options={ pid:'__ID', records:_records, row_data:_row_data(I), I:I, dbv:_dbv,
        callback:function(res,n){
            if(_after_submit!=='')  _after_submit(I,res,n,_dbv);
            _N_total--;
            if( _N_total===0 ){
                if(_after_submit_all!=='') _after_submit_all('modify',res);
                _request_data();
            }
        }
    }
    $vm.modify_record_v2(options);
};
var _record_delete=function(I,rid){
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
      $vm.delete_record(options);
};
var _row_data=function(I){
    var data={};
    var ay=_fields.split(',');
    for(var i=0;i<ay.length;i++){
        var a=ay[i].split('|')[0].replace(/_/g,' ');
        var b=ay[i].split('|').pop();
        if(b!=="ID" && b!=="DateTime" && b!=="Author"){
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
    else{
        $vm.s3_link({rid:rid,filename:thumb,days:'1',modified:modified,callback:function(url){
            $vm.vm['__ID'][p]=url;
            $obj.attr('src',url);
            $("#excel__ID").handsontable("render");
        }});
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
$('#Export__ID').on('click',function(){   _set_from_to(); if(_set_req_export==='') _set_req_export=_set_req; _set_req_export();  _request_data_export();  })
$('#export__ID').on('click',function(){   _set_from_to(); if(_set_req_export==='') _set_req_export=_set_req; _set_req_export();  _request_data_export();  })
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
});
//---------------------------------------------
$('#new__ID').on('click', function(){
    var hot = $('#excel__ID').handsontable('getInstance');
    hot.alter('insert_row', 0, 1);
    _records[0].ID=undefined;
    _records[0].vm_dirty=0;
    _records[0].vm_valid={};
    if(_new_pre_data_process!==''){
        _new_pre_data_process();
    }
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
