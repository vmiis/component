records[I].vm_custom[field]=true;
if(records[I][field]=="1" || records[I][field]=="True" || records[I][field]=="on" ) td.find('input').prop('checked', true);
td.find('input').on('click', function(){
    if($(this).prop("checked") == true)   set_value("1",records,I,field);
    else                                  set_value("0",records,I,field);
});
