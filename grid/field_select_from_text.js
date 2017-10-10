var html="<select style='border:0;'></select>";
records[I].vm_custom[field]=true;
td.html(html)
td.find('select').on('input', function(){
    set_value($(this).val(),records,I,field);
});
$vm.set_dropdown_list_from_text(td.find('select'),list_text);

if(records[I][field]!=''){
    var o=td.find('select').find('option[value="'+records[I][field]+'"]');
    if(o.length==0){
        td.find('select').append(  $('<option></option>').val(records[I][field]).html(records[I][field])  );
    }
}

td.find('select').val(records[I][field])
