var _op,_module=$vm.module_list[$vm.vm['__ID'].name],_app_id=_module.var.app_id;
//---------------------------------------------
var checks={}
//---------------------------------------------
$('#D__ID').on('load',function(){
    _op=$vm.vm['__ID'].op;
    $('#name__ID').text($vm.vm['__ID'].op.participant_name);
    _set_permissions();
    $('.nav__ID li').each(function(){
        $(this).attr('data-s','1');
        $(this).css('color','#000000');
        $(this).text($(this).attr('data-li_text'));

        var $li=$(this);
        var data_name=_app_id+$(this).attr('data-name');
        if($vm.module_list[data_name]!==undefined && $vm.module_list[data_name].table_id!==undefined && $vm.module_list[data_name].table_id!='--------' && $vm.module_list[data_name].table_id!=''){
            var pid=$vm.module_list[data_name].table_id;
            var participant_uid=$vm.vm['__ID'].op.participant_uid;
            var id=participant_uid+'_'+pid;
            var num=checks[id];
            if(num!==null && num!==undefined){
                $li.css('color','#5a99dc');
                var txt=$li.attr('data-li_text');
                $li.text(txt+' ('+num+')')
            }
        }
    })
});
//---------------------------------------------
var check_records=function($li,pid,participant_uid){
    var sql="select Number=count(ID) from [TABLE-"+pid+"] where puid="+participant_uid;
    $VmAPI.request({data:{cmd:'query_records',sql:sql},callback:function(res){
        $li.css('color','#000000');
        if(res.records.length>0 && res.records[0].Number!='0'){
            var id=participant_uid+'_'+pid;
            checks[id]=res.records[0].Number;
            $li.css('color','#5a99dc');
            var txt=$li.attr('data-li_text');
            $li.text(txt+' ('+res.records[0].Number+')')
        }
    }});
}
//---------------------------------------------
$('#check__ID').on('click',function(){
    var participant_uid=$vm.vm['__ID'].op.participant_uid;
    $('.nav__ID li').each(function(){
        var $li=$(this);
        var data_name=_app_id+$(this).attr('data-name');
        if($vm.module_list[data_name]!==undefined && $vm.module_list[data_name].table_id!==undefined && $vm.module_list[data_name].table_id!='--------' && $vm.module_list[data_name].table_id!=''){
            var pid=$vm.module_list[data_name].table_id;
            check_records($li,pid,participant_uid);
        }
    })
})
//---------------------------------------------
_special_click_process=function(li){
    var data_name=_app_id+$(li).attr('data-name');
    $vm.load_module_by_name(data_name,$vm.root_layout_content_slot,{participant_uid:_op.participant_uid,participant_name:_op.participant_name})
}
//---------------------------------------------
