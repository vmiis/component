//-------------------------------------
var task_name='';
var visit_task='';
var participant_pid;
var notes_pid;
if(Array.isArray($vm.module_list['participant'])===true){
    participant_pid=$vm.module_list['participant'][0];
}
else{
    participant_pid=$vm.module_list['participant']['table_id'];
}
if(Array.isArray($vm.module_list['notes'])===true){
    notes_pid=$vm.module_list['notes'][0];
}
else{
    notes_pid=$vm.module_list['notes']['table_id'];
}
//-------------------------------------
var special_sql_g='';
var special_sql_n='';
var fields_e='';
//-------------------------------------
$('#D__ID').on('load',function(){
    task_name=$vm.vm['__ID'].name;
    visit_task=$vm.vm['__ID'].op.visit_task;
    special_sql_n="select count(ID) from [FORM-"+db_pid+"-@S1]";
    special_sql_g="with notes as (select PUID,NT=S1,NC=@('Color'),NRowNum=row_number() over (PARTITION BY PUID order by ID DESC) from [FORM-"+notes_pid+"] where ppid="+db_pid+")";
    special_sql_g+=",task as (select ID,UID,PUID,S2,Information,DateTime,Author,RowNum=row_number() over (order by ID DESC) from [FORM-"+db_pid+"-@S1] )";
    special_sql_g+="select ID,S2,UID,Information,DateTime,Author,NT,NC,dirty=0, valid=1 from task left join notes on UID=notes.PUID and NRowNum=1";
    fields_e=fields.replace("Status|S2,Notes|NT,","").replace(/<br>/g,' ');
    grid_data();
})
$('#D__ID').on('back',function(){ grid_data(); });
//-------------------------------------
columns[0]={data:'S2',width:60, renderer:function(instance, td, row, col, prop, value, cellProperties){
    if(value!==null && value!==undefined && value.length===6) value="#"+value;
    if(value!=='') $(td).html("<span style='color:"+value+"'>&#x25cf;</span>");
    return td;
}};
//-------------------------------------
columns[1]={data:'NT', renderer:function(instance, td, row, col, prop, value, cellProperties){
    if(value===null || value===undefined || value==="") value='&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';
    var color="#000000"; if(records[row]!==undefined) color=records[row].NC;
    $(td).html("<u style='cursor:pointer;color:"+color+"'>"+value+"</u>");
    $(td).find('u').on('click',function(){
        $vm.load_module_by_name('notes',$vm.root_layout_content_slot,{
            task_record_uid:records[row].UID,
            task_record_pid:db_pid,
            task_name:task_name,
            visit_task:visit_task,
            participant:$("#excel__ID").handsontable("getDataAtCell",row,2)
        });
    });
    return td;
}};
//-------------------------------------
var auto_uid={};
var after_change=function(record,C){
    if(C==='Participant'){
        record.participant_uid=auto_uid[record.Participant];
    }
};
//-------------------------------------
columns[2]={data:'Participant',type: 'autocomplete',trimDropdown:false,source:function (query, process){
    var sqlA="with tb as (select Item=@('Subject_Initials')+' '+@('DOB'),Value=UID from [FORM-"+participant_pid+"])";
    sqlA+=" select top 10 Item,Value from tb where Item like '%'+@S1+'%' ";
    $vm.read_record_auto({query:query,process:process,sql:sqlA,minLength:0,callback:function(nv){auto_uid=nv;}});
}};
//---------------------------------------------------------------------------
var before_submit=function(record,dbv){
    var flds=task_fields.split(',');
    var J=0,K=0,N=flds.length;
    for(var i=0;i<N;i++){
        var id=flds[i].split('|').pop();
        if(id=='UID') K++;
        else if(record[id]==='' || record[id]===undefined || record[id]===null)  J++;
    }
    N=N-K;
    if(N==J) 		    dbv.S2='#FF0000';
    else if(J===0)  	dbv.S2='#00FF00';
    else 			    dbv.S2='#FFFF00';
    dbv.PPID=participant_pid;
    if(record.Participant===undefined){
        alert("No participant was selected");
        return false;
    }
    if(record.participant_uid!==undefined) dbv.PUID=record.participant_uid;
    return true;
};
//-------------------------------------
var after_submit=function(I,res,n){
    $("#excel__ID").handsontable("setDataAtCell", I,0,dbv.S2);
};
//-------------------------------------
