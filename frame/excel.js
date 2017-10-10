//var db_pid=$vm.vm['__ID'].db_pid;  if(db_pid===undefined) alert('This module has no db_pid defined');

var _export_order='';
var db_pid=$vm.module_list[$vm.vm['__ID'].name][0];
$vm.vm['__ID'].db_pid=db_pid;
var ready_for_submit_row=-1;
var mouse_down_row=-1;
var td_y={};
var dbv={};
var records=[];
$('#D__ID').on('update',function(){grid_data();})
$('#search__ID').on('click',function(){grid_data();})
$("#keyword__ID").keypress(function(){  var keycode = (event.keyCode ? event.keyCode : event.which);if(keycode == '13'){ grid_data();}});
$("#p__ID").on('click',function(){  var I=$("#I__ID").text();I--;$("#I__ID").text(I); grid_data();})
$("#n__ID").on('click',function(){  var I=$("#I__ID").text();I++;$("#I__ID").text(I); grid_data();})
//-----------------------------------------------
var headers=[];
var columns=[];
var ay=fields.split(',');
for(var i=0;i<ay.length;i++){
    var a=ay[i].split('|')[0].replace(/_/g,' ');
    var b=ay[i].split('|').pop();
    if(a!=='Hidden'){
        headers.push(a);
        if(b=="DateTime" || b=="Author") columns.push({data:b,readOnly:true});
        else  columns.push({data:b});
    }
}
//-----------------------------------------------
$('#page_size__ID').on('change', function(){
    grid_data();
})
//-----------------------------------------------
$('#new__ID').on('click', function(){
    var hot = $('#excel__ID').handsontable('getInstance');
    hot.alter('insert_row', 0, 1);
    records[0].ID=undefined;
    records[0].vm_dirty=0;
    records[0].vm_valid={};
    if(typeof(new_pre_data_process)!=='undefined'){
        new_pre_data_process();
    }
    if(typeof(new_pre_process)!=='undefined'){
        new_pre_process();
    }
});
//-----------------------------------------------
var beforeChange=function(changes,source){
    if(typeof(before_change)!=='undefined'){
        before_change(changes,source);
    }
}
//-----------------------------------------------
  var afterChange=function(changes,source){
      if(source=="edit"){
        var I=changes[0][0];
        var C=changes[0][1];
        var b=changes[0][2];
        var a=changes[0][3];
        if(b!==a){
            records[I].vm_dirty=1;
            $('#save__ID').css('background','#E00');
        }
        if(typeof(after_change)!=='undefined'){
            after_change(records[I],C);
        }
    }
  };
//-------------------------------------
  var afterValidate=function(isValid,value,row,prop,source){
      if(isValid===false) records[row].valid=0;
      if(isValid===false) records[row].vm_valid[prop]=0;
      else records[row].vm_valid[prop]=1;
  }
//-------------------------------------
$('#close2__ID').on('click', function(){        $('.vm_close_dialog').triggerHandler('click');    })
$('#close3__ID').on('click', function(){        $('.vm_close_dialog').triggerHandler('click');    })
//-------------------------------------
$('#save2__ID').on('click', function(){
    $('#save__ID').triggerHandler('click');
})
//-------------------------------------
var N_total=0;
$('#save__ID').on('click', function(){
    $('#save__ID').css('background','');
    N_total=0;
    for(var i=0;i<records.length;i++){
        var ok=true;
        var valid=1;
        for (p in records[i].vm_valid) {
            if(records[i].vm_valid[p]===0) valid=0;
        }
        if((records[i].ID===null || records[i].ID===undefined) && records[i].vm_dirty==1 && valid==1 ){
            if(typeof(before_submit)!=='undefined'){
                var r=before_submit(records[i],dbv);
                if(r===false){
                    ok=false;
                }
            }
            if(ok===true){
                N_total++;
                   record_add(i);
            }
        }
        else if(records[i].ID!==null && records[i].ID!==undefined && records[i].vm_dirty==1 && valid==1 ){
            if(typeof(before_submit)!=='undefined'){
                var r=before_submit(records[i],dbv);
                if(r===false){
                    ok=false;
                }
            }
            if(ok===true){
                N_total++;
                record_modefy(i);
            }
        }
    }
    if($vm.vm['__ID'].excel_dialog=='new' || $vm.vm['__ID'].excel_dialog=='edit'){
        if(g_update_key!==undefined){
            $('#D'+g_update_key).triggerHandler('update');
        }
    }
    //grid_data();
})
//-----------------------------------------------
var beforeRemoveRow=function(index,amount){
      if(confirm("Are you sure to delete?\n")){
            for(var i=0;i<amount;i++){
                  var rid=records[index+i].ID;
                  jQuery.ajaxSetup({async:false});
                  if(typeof(before_submit)!=='undefined'){
                        before_submit(records[index+i],dbv);
                  }
                  var R=record_delete(index+i,rid);
                  jQuery.ajaxSetup({async:true});
                  if(R!==true) return false;
            }
      }
      else return false;
};
//-------------------------------------
var record_add=function(I){
      var options={ pid:'__ID', records:records, row_data:row_data(I), I:I, dbv:dbv,
            callback:function(res,n){
                  if(typeof(after_submit)!=='undefined')  after_submit(I,res,n,dbv); N_total--; if( N_total===0 ) grid_data();
            }
      }
      $vm.add_record(options);
};
var record_modefy=function(I){
      var options={ pid:'__ID', records:records, row_data:row_data(I), I:I, dbv:dbv,
            callback:function(res,n){
                  if(typeof(after_submit)!=='undefined')  after_submit(I,res,n,dbv); N_total--; if( N_total===0 ) grid_data();
            }
      }
      $vm.modify_record(options);
};
var record_delete=function(I,rid){
      var options={pid:'__ID',rid:rid,dbv:dbv}
      var R=$vm.delete_record(options);
      return R;
};
//-------------------------------------
var row_data=function(I){
    var data={};
    var ay=fields.split(',');
    for(var i=0;i<ay.length;i++){
        var a=ay[i].split('|')[0].replace(/_/g,' ');
        var b=ay[i].split('|').pop();
        if(b!=="ID" && b!=="DateTime" && b!=="Author"){
            if(records[I][b]!==null) data[b]=records[I][b];
        }
    }
    return data;
};
//-------------------------------------
$('#D__ID').on('load0',function(){
    dialog_process();
});
//-------------------------------------
var dialog_process=function(){
    $('#toolbar__ID').show();
    $('#toolbar2__ID').hide();
    $('#toolbar3__ID').hide();
    if($vm.vm['__ID'].excel_dialog=="new" || $vm.vm['__ID'].excel_dialog=="edit"){
        $('#toolbar__ID').hide();
        $('#toolbar2__ID').show();
        $('#toolbar3__ID').hide();
    }
    if($vm.vm['__ID'].excel_dialog=="view"){
        $('#toolbar__ID').hide();
        $('#toolbar2__ID').hide();
        $('#toolbar3__ID').show();
    }
}
//-------------------------------------
var grid_data=function(){
      if(typeof(special_grid_data)!='undefined'){
            special_grid_data();
            return;
      }
      var order="order by ID DESC"; if(typeof sql_order!=='undefined') order=sql_order;
      //var db_pid=$vm.vm['__ID'].db_pid;  if(db_pid===undefined) alert('This module has no db_pid defined');
      if(db_pid===undefined) alert('This module has no db_pid defined');
      var p_where="";
      if(typeof parent_where!=='undefined') p_where=parent_where;
      if(typeof sql_where!=='undefined') p_where=sql_where;
      var sql_n="select count(ID) from [FORM-"+db_pid+"-@S1] "+p_where;
      var sql_g="with tb as (select Information,ID,UID,PUID,DateTime,Author,Modified,RowNum=row_number() over ("+order+") from [FORM-"+db_pid+"-@S1]"+p_where+")";
      sql_g+=" select Information,ID,UID,PUID,DateTime,Author,Modified,RowNum from tb";

      if(typeof(special_sql_n)!='undefined') sql_n=special_sql_n;
      if(typeof(special_sql_g)!='undefined') sql_g=special_sql_g;

      $('#ImportNum__ID').text('');
      var sql=sql_g+" where RowNum between @I6 and @I7";

      if($vm.vm['__ID'].excel_dialog=='new'){
            sql_n="select 0";
            sql="select NULL";
      }
      $('#save__ID').show();
      if($vm.vm['__ID'].excel_dialog=='edit' || $vm.vm['__ID'].excel_dialog=='view'){
            var rid=$vm.vm['__ID'].rid
            var uid=$vm.vm['__ID'].uid
            sql_n="select 1";
            sql="select Information,ID,UID,PUID,DateTime,Author,Modified,dirty=0, valid=1 from [FORM-"+db_pid+"-@S1] where ID="+rid;
            if(rid===undefined && uid!==undefined){
                  sql="select Information,ID,UID,PUID,DateTime,Author,Modified,dirty=0, valid=1 from [FORM-"+db_pid+"-@S1] where UID="+uid;
            }
            if($vm.vm['__ID'].excel_dialog=='edit') $('#save__ID').show(); else $('#save__ID').hide();
      }

      //var req={cmd:'data2',action:"records",db_pid:db_pid,sql:sql,s1:'"'+$('#keyword__ID').val()+'"',sql_n:sql_n,'I':$('#I__ID').text(),page_size:$('#page_size__ID').val()};
      //$(this).vm7('request',req, function(res){
      var req_data={
            cmd:"query_records",
            db_pid:db_pid,
            sql:sql,
            s1:'"'+$('#keyword__ID').val()+'"',
            sql_n:sql_n,
            'I':$('#I__ID').text(),
            page_size:$('#page_size__ID').val()
      }
      $VmAPI.request(
            {data:req_data,callback:function(res){
            $("#I__ID").text(res.I);
            $("#A__ID").text(res.A);
            records=res.records;
            for(var i=0;i<records.length;i++){
                  if(records[i].DateTime!==undefined){
                        records[i].DateTime=records[i].DateTime.substring(0,10);
                  }
                  records[i].vm_dirty=0;
                  records[i].vm_valid={};
            }
            if($vm.vm['__ID'].excel_dialog=='new'){
                 records=[];
            }
            if(typeof(pre_data_process)!='undefined'){ pre_data_process(); }
            var top1=$('#excel_container__ID').offset().top;
            $('#excel_container__ID').css('height',$(window).height()-top1-$('#'+$vm.root_layout_footer).outerHeight()+'px');
            if($vm.vm['__ID'].excel_dialog=='new' || $vm.vm['__ID'].excel_dialog=='edit' || $vm.vm['__ID'].excel_dialog=='view'){
                  $('#excel__ID').css('overflow-x','hidden');
                  $('#excel__ID').css('overflow-y','visible');
                  if($('#excel__ID').css('height')==='' || $('#excel__ID').css('height')===undefined || $('#excel__ID').css('height')==='0px'){
                        $('#excel__ID').css('height','80px');
                  }
            }
            else{
                  $('#excel__ID').css('overflow-x','visible');
                  $('#excel__ID').css('overflow-y','visible');
                  $('#excel__ID').css('height','');
            }
            $('#save__ID').css('background','');
            var ht=$('#excel__ID').handsontable({
                data: records,
                colHeaders:headers,
                columns:columns,
                rowHeaders: true,
                contextMenu: true,
                beforeChange:beforeChange,
                afterChange:afterChange,
                beforeRemoveRow:beforeRemoveRow,
                contextMenu:{
                callback: function (key, options) {
                    if (key === "0") {
                        var rd=records[options.start.row];
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
                            op:{record:rd,fields:fields,form_title:nm,I:options.start.row,form_data:form_data}
                        }
                        $vm.load_module(param);
                    }
                    if (key === "1") {
                        var rd=records[options.start.row];
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
                },
                items:['Form','Json','remove_row']
                },
                afterValidate:afterValidate,
                manualColumnResize: true,
                fillHandle: false,
                //stretchH: 'all',
                /*columnSorting: true,*/
                //height: $(window).height()-top1-$('#'+$vm.vm.root_layout_footer).outerHeight()
            });
            if($vm.vm['__ID'].excel_dialog=='new'){
                  $('#new__ID').triggerHandler('click');
            }
            if(typeof(grid_process)!='undefined'){ grid_process(res); }
            //$('#excel__ID').css("height",$(window).height()-top1-$('#footer_slot').outerHeight());
      }});
};
//-----------------------------------------------
$('#Import__ID').on('click',function(){
    $('#Import_f__ID').val('');
    $('#Import_f__ID').trigger('click');
});
//-----------------------------------------------
var form_data=function(I,record){
    for (p in record) {
        if(records[I][p]!=record[p]){
            $('#save__ID').css('background','#E00');
        }
        records[I][p]=record[p];
    }
    var hot=$('#excel__ID').handsontable('getInstance');
    hot.validateCells(function(valid){});
    $('#excel__ID').handsontable('render');
};
//-----------------------------------------------
function handleFileSelect(evt) {
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
                var flds=fields.split(',');
                var fn=$('#Import_f__ID').val().substring($('#Import_f__ID').val().lastIndexOf('\\')+1);
                    if(confirm("Are you sure to import "+fn+"?\n")){
                          $('#progress_dialog__ID').dialog({ height: 'auto',width:'auto',	modal: true});
                           $(".ui-dialog-titlebar").hide();
                    var I=0;
                    var i=1;
                    (function looper(){
                        if( i<lines.length ) {
                           var items=lines[i].splitCSV(tab);
                           if(items.length>=1/*flds.length*/){
                                var rd={};
                                for(var j=0;j<flds.length;j++){
                                    var field_name=flds[j].split('|')[0];
                                    var field_id=flds[j].split('|').pop();
                                    var index=header.indexOf(field_name.replace(/ /g,'_'));
                                    if(index!=-1)  rd[field_id]=items[index];
                                }
                                if( jQuery.isEmptyObject(rd)===false){
                                    if(typeof(before_submit)!='undefined'){
                                        before_submit(rd,dbv);
                                    }
                                      //var db_pid=__ID; if($vm.vm['__ID']!==undefined && $vm.vm['__ID'].db_pid!==undefined) db_pid=$vm.vm['__ID'].db_pid;
                                      var req={cmd:'data2',action:"record_add",db_pid:db_pid.toString(),data:rd,dbv:dbv};
                                          jQuery.ajaxSetup({async:false});
                                      I++;
                                      $(this).vm7('request',req);
                                          jQuery.ajaxSetup({async:true});
                                      }
                                $('#progress__ID').text(I.toString());
                           }
                           i++;
                           setTimeout( looper, 100);
                        }
                        else{
                           $('#progress_dialog__ID').dialog('close');
                           alert(I.toString()+" records have been imported.");
                           grid_data();
                        }
                    })();
                    }
            }
        });
        reader.readAsText(files[0]);
    }
}
document.getElementById('Import_f__ID').addEventListener('change', handleFileSelect,false);
//-----------------------------------------------
$('#Export__ID').on('click',function(){
    //----------------
    var order="order by ID DESC"; if(typeof sql_order!=='undefined') order=sql_order;
    //var db_pid=$vm.vm['__ID'].db_pid; if(db_pid===undefined) db_pid=__ID;
    var p_where=""; if(typeof parent_where!=='undefined') p_where=parent_where;
    var sql_g="with tb as (select Information,ID,UID,PUID,DateTime,Author,Modified,RowNum=row_number() over ("+order+") from [FORM-"+db_pid+"-@S1]"+p_where+")";
        sql_g+=" select Information,ID,UID,PUID,DateTime,Author,Modified,RowNum from tb";
    //----------------
    if(typeof(special_sql_n)!='undefined') sql_n=special_sql_n;
    if(typeof(special_sql_g)!='undefined') sql_g=special_sql_g;
    //----------------
    var sql=sql_g;
    var start=$('#start__ID').val();  if(start==="") start='0';
    var num=$('#num__ID').val();    if(num==="") num='0';
    var page_size=parseInt($('#page_size__ID').val());
    var nStart=page_size*(parseInt(start)-1)+1;
    var nNum=parseInt(num);
    var from=nStart.toString();
    var to=(nStart+nNum*page_size-1).toString();
    if(start!=="0" && num!=="0")  sql+=" where RowNum between @I1 and @I2";
    sql+=_export_order;
    /*
    var input={cmd:'data2',action:"table",sql:sql,i1:from,i2:to};
    $(this).vm7('request',input, function(c){
          var TT=vm_getURLParameter('TT');
        if(TT!='null') $('#debug__ID').text(output._TT);
        var flds=fields; if(typeof(fields_e)!='undefined') flds=fields_e;
        $(this).vm8('download_csv','F'+db_pid+'.csv',c.table,flds);
    });
    */
    var req_data={
          cmd:"query_records",
          sql:sql,
          i1:from,
          i2:to,
    }
    $VmAPI.request({data:req_data,callback:function(res){
        var flds=fields; if(typeof(fields_e)!='undefined') flds=fields_e;
        $vm.download_csv({name:'F'+db_pid+'.csv',data:res.records,fields:flds});
    }});
});
//-------------------------------------
function process_postcode(changes,source,Suburb,iS,Postcode,iP,State,iT){
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
var sql_d1=function(d){
    var d1=date_parse(d);
    var month1=1+d1.getMonth();
    var year1=d1.getFullYear();
    return "01/"+month1+"/"+year1;
}
//-------------------------------------
var sql_dA=function(d){
    var d1=date_parse(d);
    var month1=1+d1.getMonth();
    var year1=d1.getFullYear();
    return "convert(Date,'01/"+month1+"/"+year1+"',103)";
}
//-------------------------------------
var sql_dB=function(d){
    var d1=date_parse(d);
    var month1=1+d1.getMonth();
    var year1=d1.getFullYear();
    var month2=month1+1;
    var year2=year1;
    if(month2==13){ month2=1; year2=year2+1;}
    return "convert(Date,'01/"+month2+"/"+year2+"',103)";
}
//-------------------------------------
$('#pv__ID').on('click',function(){
      var style="";
      if($('#D__ID').find('style')[0]!==undefined) style=$('#D__ID').find('style')[0].innerText+" table{font-size:10pt;font-family: Helvetica, Arial, sans-serif;}";
      $('#pvdiv__ID').vm3('popup',style);
});
//---------------------------------------------
$('#back__ID').on('click',function(event){
    event.stopPropagation();
    $vm.back({div:'__ID'});
});
//---------------------------------------------
$('#back__ID').on('dblclick',function(event){
    event.stopPropagation();
});
//---------------------------------------------
/*
$('#toolbar__ID').on('dblclick',function(event){
    event.stopPropagation();
    if(window.location.href.indexOf('testserver')!==-1 || window.location.href.indexOf('developer')!==-1 ) window.open('M__ID');
})
*/
//---------------------------------------------
$('#toolbar__ID img').on('dblclick',function(event){
    event.stopPropagation();
})
  //---------------------------------------------
$('#toolbar__ID input').on('dblclick',function(event){
    event.stopPropagation();
});
//---------------------------------------------
