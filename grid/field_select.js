records[I].vm_custom[field]=true;
td.html(html)
td.find('select').val(records[I][field])
td.find('select').on('change', function(){
    set_value($(this).val(),records,I,field);
});
