if(value===null || value===undefined){ td.innerHTML=""; return td;}
td.innerHTML="<u style='cursor:pointer'>CELL_TEXT</u>";
$(td).find('u').on('click',function(){
    var url;//=$vm.module_list['MODULE_NAME'][1];
    if(Array.isArray($vm.module_list['MODULE_NAME'])===true){
        var url=$vm.module_list['MODULE_NAME'][1];
    }
    else{
        var url=$vm.module_list['MODULE_NAME']['url'];
    }
    var param={
        name:'MODULE_NAME',
        pid:$vm.id(url),
        slot:$vm.root_layout_content_slot,
        url:$vm.url(url),
        puid:value,
     }
     $vm.load_module(param);
});
return td;
