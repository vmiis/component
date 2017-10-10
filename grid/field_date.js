records[I].vm_custom[field]=true;
td.html('<input style="border:0; width:80px" />')
td.find('input').val(records[I][field])
var dateFormat='dd/mm/yy';
if(typeof _dateFormat!=='undefined') dateFormat=_dateFormat;
td.find('input').datepicker({dateFormat:dateFormat,changeMonth:true, changeYear:true,onClose:function(dateText) {
    set_value(dateText,records,I,field);
}});
