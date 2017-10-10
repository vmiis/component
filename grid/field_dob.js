records[I].vm_custom[field]=true;
td.html('<input style="border:0; width:80px" />')
td.find('input').val(records[I][field])
td.find('input').datepicker({yearRange:"-120:+0",dateFormat:'dd/mm/yy',changeMonth:true, changeYear:true,onClose:function(dateText) {
    set_value(dateText,records,I,field);
}});
