//$vm.online_questionnaire=1;
$('#D__ID').on('load',function(){
    if($vm.server=='production' && $vm.online_questionnaire!=1){
        alert('You are not a participant. You can continue to enter data for testing purpose and the data you enterd shoud be deleted after you finish the testing');
    }
    get_data();
})
$('#D__ID').on('refresh_back',function(){ get_data(); })
//---------------------------------
var status=[]
//---------------------------------
var get_data=function(){
    //----------------------------------
    //input
    var participant=$vm.vm['__ID'].op.participant;
    var participant_uid=$vm.vm['__ID'].op.participant_uid;
    var task_list=$vm.vm['__ID'].op.task_list;
    //----------------------------------
    //display participant
    $('#info__ID').text(participant+'-'+participant_uid);
    //----------------------------------
    //setup tasl LI list and sql for checking Completed task
    var pids=task_list.split(',');
    var txt="";
    //----------------------------------
    for(var i=0;i<pids.length;i++){
        var pid=pids[i];
        if(status[pid.toString()]==undefined){
            status[pid.toString()]={rid:0}
        }
        for(module in $vm.module_list){
            var nnn=$vm.module_list[module];
            if(nnn.table_id!==undefined && nnn.task!==undefined){
                var module_pid=nnn.table_id;
                if(pid==module_pid){
                    txt+="<li id="+pid+" data-form_name="+module+">"+$vm.module_list[module].task+"</li>";
                }
            }
        }
    }
    $('#items__ID').html(txt);
    //----------------------------------
    $('#items__ID li').each(function(){
        var $li=$(this);
        var li_pid=$li.attr('id');
        if(status[li_pid].rid==0){
            //-----------------
            var sql="select ID from [FORM-"+li_pid+"] where puid=@I1";
            var req={cmd:'query_records',sql:sql,i1:participant_uid};
            //-----------------
            if($vm.online_questionnaire===1)  req={cmd:'query_records_s2',db_pid:li_pid,fields:'ID'};
            jQuery.ajaxSetup({async:false});
            $VmAPI.request({data:req,callback:function(res){
                if(res.records.length==0){
                }
                else{
                    status[li_pid].rid=1;
                }
            }})
            jQuery.ajaxSetup({async:true});
        }
        if(status[li_pid].rid==0){
            var txt=$li.html();
            var li_form_name=$li.attr('data-form_name');
            $li.html("<u style='cursor:pointer' data-form_name="+li_form_name+">"+txt+"</u>");
            $li.find('u').on('click',function(){
                var module_name=$(this).attr('data-form_name');
                var module_id=$vm.get_module_id({name:module_name});
                $('#new'+module_id).triggerHandler('click');
                //---------------
                var form_module=$vm.module_list[module_name].form_module;
                if(form_module!=undefined)  $('#D'+module_id).triggerHandler('load_form_module',      [{participant:participant,participant_uid:participant_uid,task_name:txt}]);
                else                        $('#D'+module_id).triggerHandler('load_quest_form_module',[{participant:participant,participant_uid:participant_uid,task_name:txt}]);
                //---------------
            });
            $vm.load_module_by_name(li_form_name,undefined,{no_query:1});
            return false; // break out the loop
        }
    })
    //----------------------------------
}
