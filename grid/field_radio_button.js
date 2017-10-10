records[I].vm_custom[field]=true;
td.html(html)
td.find('input[value="'+records[I][field]+'"]').prop('checked', true);
td.find('input').on('click', function(){
    var c=$(this).val();
    set_value(c,records,I,field);
});
