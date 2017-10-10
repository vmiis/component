//---------------------------------------------
var local_module_list={}; //used for ctrl doble click
var config;
//---------------------------------------------
var panel=function(){
	//---------------------------------------------
	//---------------------------------------------
	config.module_ids={}	 //add mosule_ids to config
	//---------------------------------------------
	if(config.no_counting=='1') $('#counting__ID').hide();
	_nav_name=config.name;
	_set_nav_link();
	//---------------------------------------------
	//add module to module list
	//var UID=_mobj.op.record.UID;
	var UID=_sys.UID;
	//---------------------------------------------
	$vm.module_hosting_path=$vm.hosting_path;
	if(_mobj.op.module_path!=undefined) $vm.module_hosting_path=_mobj.op.module_path;
	//---------------------------------------------
	if(config.modules!=undefined){
		for(i=0;i<config.modules.length;i++){
			var aModule=config.modules[i];
			if(aModule.url!=undefined && aModule.url[0]=='/'){
				aModule.url=$vm.module_hosting_path+aModule.url;
			}
			var m_id=aModule.module_id;
			var new_m_id='M'+UID+'_'+m_id;
			aModule.module_id=new_m_id;
			$vm.module_list[new_m_id]=aModule;
			config.module_ids[m_id]=new_m_id;	//link module_id to new unique module
			local_module_list[new_m_id]=aModule;  //only for ctrl doble click
		}
	}
	//---------------------------------------------
	for(i=0;i<config.panel.columns.length;i++){
		var aColumn=config.panel.columns[i];
		for(j=0;j<aColumn.sections.length;j++){
			var aSection=aColumn.sections[j];
			for(k=0;k<aSection.modules.length;k++){
				var aModule=aSection.modules[k];
				if(aModule.url!=undefined && aModule.url[0]=='/'){
					aModule.url=$vm.module_hosting_path+aModule.url;
				}
				aModule.section_name=aSection.name; //add section name to module
				var m_id=aModule.module_id;
				var new_m_id='M'+UID+'_'+m_id;
				aModule.module_id=new_m_id;
				$vm.module_list[new_m_id]=aModule;
				config.module_ids[m_id]=new_m_id;	//link module_id to new unique module
				if(aModule.form_module!=undefined){
					aModule.form_module='M'+UID+'_'+aModule.form_module;
				}
				local_module_list[new_m_id]=aModule;  //only for ctrl doble click
			}
		}
	}
	//---------------------------------------------
	//pande render and add click event handler
	var txt="";
	for(i=0;i<config.panel.columns.length;i++){
		var aColumn=config.panel.columns[i];
		if(aColumn.hidden!='1'){
			txt+="<div class=nav__ID>";
			for(j=0;j<aColumn.sections.length;j++){
				var aSection=aColumn.sections[j];
				var header=aSection.name;
				txt+="<span>"+$('<div/>').html(header).text()+"</span><ul>";
				for(k=0;k<aSection.modules.length;k++){
					var aModule=aSection.modules[k];
					var name=aModule.name;
					if(name!=undefined){
						var m_id=aModule.module_id;
						var data_counting="";
						if(aModule.counting=='1') data_counting=" data-counting=1 ";
						if(aModule.counting=='2') data_counting=" data-counting=2 ";
						txt+="<li "+data_counting+"data-mid="+$('<div/>').html(m_id).text()+">"+$('<div/>').html(name).text()+"</li>";
					}
				}
				txt+="</ul>";
			}
			txt+="</div>";
		}
	}
	$('#panel__ID').html(txt);
	$('#panel__ID li').on('click',function(event){
		event.stopPropagation();
		if( $(this).hasClass( 'not_allowed__ID' )===true){
			  alert("No permission!");
			  return;
		}
		var mid=$(this).attr('data-mid');
		load_module(mid)
	});
	//---------------------------------------------
	//remember the name
	_set_li_text();
	//---------------------------------------------
	//set permission
	if($vm.server=='production'){
		$('.nav__ID li').each(function(index){
			$(this).addClass('not_allowed__ID')
			var m_id=$(this).attr('data-mid');
			if(m_id!==undefined && $vm.module_list[m_id]!==undefined){
				var tid=$vm.module_list[m_id].table_id;
				if(tid!==undefined && tid!=='--------' && tid!==''){
					set_li_permission($(this),tid);
				}
				else $(this).removeClass('not_allowed__ID');
			}
			else $(this).removeClass('not_allowed__ID');
		});
	}
	//---------------------------------------------
}
//---------------------------------------------
$('#D__ID').on('load',function(){
	/*
	if(_mobj.op.name!=undefined){
		_nav_name=_mobj.op.name;
		_set_nav_link();
	}
	*/
	if(_mobj.op.child=='1') _clear_counting();
	if(_mobj.op.check_count_where!=undefined) _check_count_where=_mobj.op.check_count_where;
});
//---------------------------------------------
var load_module=function(module_id){
	var url=$vm.module_list[module_id].url;
	if(url[0]=='/'){
		if($vm.module_hosting_path!=undefined) url=$vm.module_hosting_path+url;
		//url=$vm.hosting_path+url;
	}
	var single_record=$vm.module_list[module_id].single_record;
	var trust=0;
	if(url.indexOf('http://127.0.0.1')!=-1 || url.indexOf('http://localhost')!=-1){
		trust=1;
	}
	else{
		for(var i=0;i<$vm.trust_path.length;i++){
			var len=$vm.trust_path[i].length;
			if(url.indexOf($vm.trust_path[i])!==-1 && url.substring(0,len)==$vm.trust_path[i]){
				trust=1;
			}
		}
	}
	if(trust==0){
		alert("The url ("+url+") is not trusted. (panel.2)")
		return;
	}
	//transfer parent module and record, because this is a panel module
	var this_mobj  =_mobj.op.mobj;
	var this_record=_mobj.op.record;
	var op={
		//-----------------
		sys:_sys,
		mobj:this_mobj,
		module:$vm.module_list[module_id],
		record:this_record,
		//-----------------
	}
	var slot=$vm.root_layout_content_slot;
	if(single_record=='1') slot=undefined;
	$vm.load_module_by_name(module_id,slot,op)
};
//---------------------------------------------
$('#toolbar__ID').on('dblclick',function(event){
	if(event.ctrlKey){
		event.stopPropagation();
		var txt1=JSON.stringify(config.module_ids,null,4);
		txt1=$('<div/>').html(txt1).text();
		var txt2=JSON.stringify(local_module_list,null,4);
		txt2=$('<div/>').html(txt2).text();
		var url='__PARTS__/code_viewer/code.html'
		var param={
			name:"code_viewer",
			pid:$vm.id(url+"--------"),
			slot:$vm.root_layout_content_slot,
			url:$vm.url(url),
			op:{name:'Module List',code:"Module ID List:\r\n"+txt1+"\r\nModule List:\r\n"+txt2}
		}
		$vm.load_module(param);
	}
})
//-------------------------------------------------
var url=_mobj.op.config_url;
if(url[0]=='/') url=$vm.hosting_path+url;
url+='?_v='+$vm.version+$vm.reload;
url=$vm.url(url);
if(url[0]=='/') url=$vm.hosting_path+url;
console.log('loading '+url)
$.get(url,function(txt){
	try{
		config=JSON.parse(txt);
	}
	catch (e){
		alert("Error in app config file\n"+e);
		return;
	}
	_sys.config=config;
	panel();
},'text').fail(function() {
	alert( "The file '"+url+"' doesn't exist! (panel.js)" );
});
//-------------------------------------------------
