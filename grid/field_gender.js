records[I].vm_custom[field]=true;
var html="<select style='border:0;'>"
html+="<option>---</option>";
html+="<option>Male</option>";
html+="<option>Female</option>";
html+="</select>"
td.html(html)
td.find('select').val(records[I][field])
td.find('select').on('input', function(){
    set_value($(this).val(),records,I,field);
});
