td.autocomplete({
    minLength:0,
    source:function(request,response){
        $VmAPI.request({data:{cmd:'auto',s1:request.term,sql:sql,minLength:0},callback:function(res){
            response($vm.autocomplete_list(res.table));
        }});
    },
    select: function(event,ui){
        records[I][field+'_uid']=ui.item.value2;
        for(key in ui.item){
            if(key.indexOf('field_')!==-1){
                var k=key.replace('field_','')
                var v=ui.item[key];
                set_value(v,records,I,k);
                if(source=='grid'){
                    td.parent().find("td[data-id='"+k+"']").html(v);
                }
                else{
                    td.parent().parent().find("td[data-id='"+k+"']").html(v);
                }
            }
        }
        callback(event,ui);
    }
})
td.focus(function(){td.autocomplete("search","");});
