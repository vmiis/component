records[I].vm_custom[field]=true;
if(records[I][field]===undefined) records[I][field]="";
td.data('filename_field',field);
var html="<u style='cursor:pointer'>"+records[I][field]+"</u>";
html+="<span class=file_buttons><a title='Remove the file' class=remove_file>X<a> <a title='Choose a file' class=choose_file>&#9783;<a></span>";
html+="<form><input type=file style='display:none'></input></form>";
td.html(html);
if(records[I][field]==="" || records[I][field]===null || records[I][field]===undefined) td.find('a.remove_file').css('visibility','hidden');
td.find('u').on('click',function(){
    var f_name=$(this).html();
    var rid=records[I].ID;
    if(rid!==undefined){
        $vm.open_link({rid:rid,filename:f_name});
    }
    else alert("No file was found on server.")
});
td.find('a.choose_file').on('click',function(){
    if(td.find('form')[0]!==undefined) td.find('form')[0].reset();
    td.find('input[type=file]').trigger('click');
})
td.find('a.remove_file').on('click',function(){
    td.find('a.remove_file').css('visibility','hidden');
    change_file_name("");
})
td.find('input[type=file]').on('change',function(evt){
    td.find('a.remove_file').css('visibility','');
    var file = this.files[0];
    change_file_name(file.name)
    if(td.data('process_file')!==undefined){
        var f=td.data('process_file');
        f(file,records,I,field,source);
    }
})
var change_file_name=function(name){
    set_value(name,records,I,field);
    if(source=='grid'){
        td.parent().find("td[data-id='"+field+"']").find('u').html(name);
    }
    else{
        td.parent().parent().find("td[data-id='"+field+"']").find('u').html(name);
    }
}
