records[I].vm_custom[field]=true;
if(records[I][field]===undefined) records[I][field]="";
td.data('filename_field',field);

td.css('position','relative');
td.css('padding-bottom','0');
var html="<span></span><img  width='80' style='display:block;cursor:pointer;margin-bottom:0' />"

html+="<span class=file_buttons><a title='Remove the file' class=remove_file>X<a> <a title='Choose a file' class=choose_file>&#9783;<a></span>";
html+="<form><input type=file style='display:none'></input></form>";
td.html(html);

if(records[I][field]==="" || records[I][field]===null || records[I][field]===undefined) td.find('a.remove_file').css('visibility','hidden');

$img=td.find('img');
if(records[I][field]!=='' && records[I][field]!==undefined){
    var rid=records[I].ID;
    var Modified=records[I].Modified;
    if(Modified===undefined) Modified=records[I].DateTime;
    _set_image_url($img,rid,records[I][field],Modified);
    $img.on('click',function(){
        _show_photo(rid,records[I][field],Modified);
    })
}
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
})
var change_file_name=function(name){
    set_value(name,records,I,field);
    if(source=='grid'){
        td.parent().find("td[data-id='"+field+"']").find('span:first').html(name);
        td.parent().find("td[data-id='"+field+"']").find('img').hide();
    }
    else{
        td.parent().parent().find("td[data-id='"+field+"']").find('span:first').html(name);
        td.parent().parent().find("td[data-id='"+field+"']").find('img').hide();
    }
    //--------------------
    //force to show dirty
    records[I].vm_dirty=1;
    $('#save__ID').css('background','#E00');
    //--------------------
}
