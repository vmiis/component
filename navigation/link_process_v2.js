//---------------------------------------------------------------
$('.nav__ID li').each(function(){
    var name=$(this).attr('data-name');
    if(name=='under_development'){
        $(this).css('font-style','italic');
    }
});
//---------------------------------------------------------------
$('.nav__ID li').on('click',function(event,trigger_input){
      event.stopPropagation();
      if( $(this).hasClass( 'not_allowed__ID' )===true){
            alert("No permission!");
            return;
      }
      var s=$(this).attr('data-s');
      if(s!==undefined && typeof(special_click_process)!=='undefined'){
            special_click_process(this);
            return;
      }
      var name=$(this).attr('data-name');
      var url=$(this).attr('data-url');
      var src=$(this).attr('data-src');
      var m=$(this).attr('data-pid'); //old module
      var op=$(this).attr('data-op');
      if(op!==undefined){
         op=JSON.parse(op);
      }
      else op={}
      if(name!==undefined){
          var mid;//=$vm.module_list[name][0];
          var url;//=$vm.module_list[name][1];
          if(Array.isArray($vm.module_list[name])===true){
              mid=$vm.module_list[name][0];
              url=$vm.module_list[name][1];
          }
          else{
              mid=$vm.module_list[name]['table_id'];
              url=$vm.module_list[name]['url'];
          }
          var param={
              name:name,
              pid:$vm.id(url+mid),
              slot:content_slot,
              url:$vm.url(url),
              op:op
           }
           $vm.load_module(param);
      }
      else if(url!==undefined){
            var param={
                  pid:$vm.id(url),
                  slot:content_slot,
                  url:url,
                  source:src
            }
            $vm.load_module(param);
      }
      else if(m!==undefined){
            //old module
            if(trigger_input!==undefined) $(this).vm6('load_module', m, content_slot,trigger_input);
            else $(this).vm6('load_module', m, content_slot,{puid:undefined});
      }
      else{
            var a=$(this).attr('data-a');
            if(a!==undefined) window.open(a);
      }
});
//---------------------------------------------------------------
var set_permissions=function(){
    var pids="";
    var vm_permission={};
    if($vm.server==='production'){
        $('.nav__ID li').each(function(index){
            var name=$(this).attr('data-name');
            var pid=undefined;  //if($vm.module_list[name]!==undefined)  pid=$vm.module_list[name][0];
            if(Array.isArray($vm.module_list[name])===true){
                pid=$vm.module_list[name][0];
            }
            else{
                pid=$vm.module_list[name]['table_id'];
            }
            if(pid!==undefined && pid!=='--------'){
               if(pids!=="") pids+=",";
               pids+=pid;
            }
        });
        if(pids!==""){
            $VmAPI.request({data:{cmd:'permissions',pids:pids},callback:function(res){
                vm_permission=res;
                $('.nav__ID li').each(function(index){
                    var name=$(this).attr('data-name');
                    var pid=undefined;  //if($vm.module_list[name]!==undefined)  pid=$vm.module_list[name][0];
                    if(Array.isArray($vm.module_list[name])===true){
                        pid=$vm.module_list[name][0];
                    }
                    else{
                        pid=$vm.module_list[name]['table_id'];
                    }
                    if(pid!==undefined && pid!=='--------'){
                        $(this).removeClass('not_allowed__ID');
                        if(vm_permission[pid]===undefined){
                            $(this).addClass('not_allowed__ID')
                        }
                    }
                })
            }})
        }
    }
}
//---------------------------------------------------------------
