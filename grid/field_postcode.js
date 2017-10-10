td.autocomplete({
    minLength:1,
    source:function(request,response){
        $VmAPI.request({data:{cmd:'postcode',query:request.term,count:'10'},callback:function(res){
            response($.parseJSON(res.ret));
        }});
    },
    select: function(event,ui){
        var suburb=ui.item.label.split('/')[0];
        var state=ui.item.label.split('/')[1];
        var postcode=ui.item.label.split('/')[2];
        ui.item.value=postcode
        set_value(suburb,records,I,'Suburb');
        set_value(state,records,I,'State');
        set_value(postcode,records,I,'Postcode');
        if(source=='grid'){
            td.parent().find("td[data-id='Suburb']").html(suburb);
            td.parent().find("td[data-id='State']").html(state);
            td.parent().find("td[data-id='Postcode']").html(postcode);
        }
        else{
            td.parent().parent().find("td[data-id='Suburb']").html(suburb);
            td.parent().parent().find("td[data-id='State']").html(state);
            td.parent().parent().find("td[data-id='Postcode']").html(postcode);
        }
    }
})
