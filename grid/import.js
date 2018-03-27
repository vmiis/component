//-------------------------------------
$('#import__ID').on('click',function(){
	$('#fileform__ID')[0].reset();
	$('#import_file__ID').trigger('click');
})
//-------------------------------------
$('#import_file__ID').on('change',function(evt){
	var files = evt.target.files;
	if(files.length>0){
		if(confirm("Are you sure to import "+files[0].name+"?\n")){
			var reader = new FileReader();
			reader.onload = (function(e) {processing_file_start(e.target.result); });
			reader.readAsText(files[0]);
		}
	}
})
//-------------------------------------
var gNumber_to_process,gNumber_completed,gDialog_module_id;
var gI=0,gLines,gTab,gFields,gHeader;
var gLoop;
var gOK;
//-------------------------------------
var one_loop=function(){
	if(gOK==0) return;
	gOK=0;
	var items=gLines[gI].splitCSV(gTab);
	//--------------------------------------
	//create a record rd
	var rd={};
	if(items.length==1 && items[0]==''){} //this is empty line
	else{
		for(var j=0;j<gFields.length;j++){
			var field_name=gFields[j].split('|')[0];
			var field_id=gFields[j].split('|').pop();
			var index=gHeader.indexOf(field_name.replace(/ /g,'_'));
			if(index!=-1 && index<items.length)  rd[field_id]=items[index];  //index>=items.length: the data line is too short
		}
	}
	//--------------------------------------
	if(jQuery.isEmptyObject(rd)===false){ //not empty record
		if(_before_submit!==''){
			_dbv={};
			_before_submit(rd,_dbv);
		}
		//------------------------------------------
		//add
		var req={cmd:"add_json_record",db_pid:_db_pid.toString(),data:rd,dbv:_dbv};
		$VmAPI.request({data:req,callback:function(res){
			gNumber_completed++;
			processing_file_end();
		}})
		//------------------------------------------
	}
	else{
		gNumber_to_process--;
		processing_file_end();
	}
	console.log(gI+'/'+gNumber_to_process)
	if(gI>=gNumber_to_process){
		clearInterval(gLoop);
		return;
	}
	gI++;
}
//-------------------------------------
var processing_file_start=function(contents){
	//gLines=contents.replace(/\r/g,'\n').replace(/\n\n/g,'\n').split('\n');
	gLines=contents.split('\r\n');
	if(gLines.length>1){
		gNumber_to_process=gLines.length-1; //-1: not count header line
		gNumber_completed=0;
		gDialog_module_id=$vm.get_module_id({name:'_system_import_dialog_module'})
		gTab='\t';
		var n1=gLines[0].split('\t').length;
		var n2=gLines[0].split(',').length;
		if(n2>n1) gTab=',';
		gHeader=gLines[0].splitCSV(gTab);
		for(var k=0;k<gHeader.length;k++){gHeader[k]=gHeader[k].trim().replace(/ /g,'_');}
		gFields=_fields.split(',');
		gI=1; //not 0, start from second line, the first line is header
		/*
		//check first record
		var items=gLines[gI].splitCSV(gTab);
		var sql="select top 1 ID from [TABLE-"+_db_pid+"] where DT1=@T1 and V1=@D1 and V2=@D2 and S1=@S1 and S2=@S2";
		items[0]=$vm.date_to_string_dmy(new Date(items[0]));
		if(items[2]=='') items[2]='0';
		if(items[3]=='') items[3]='0';
		var req={cmd:"query_records",sql:sql,t1:items[0],d1:items[2],d2:items[3],s1:items[4],s2:items[5]};
		$VmAPI.request({data:req,callback:function(res){
			if(res.records.length==1){
				alert('The first record was found in the database. It is possible all other records have been imported.');
				return;
			}
			else{
				$vm.open_dialog({name:'_system_import_dialog_module'});
				gOK=1;
				//start importing...
				gLoop=setInterval(one_loop, 500);
			}
		}})
		*/
		$vm.open_dialog({name:'_system_import_dialog_module'});
		gOK=1;
		//start importing...
		gLoop=setInterval(one_loop, 500);
	}
}
//-------------------------------------
var processing_file_end=function(){
	gOK=1;
	$('#import_num'+gDialog_module_id).text(gNumber_completed.toString()+"/"+gNumber_to_process.toString());
	if(gNumber_to_process<=gNumber_completed){
		gNumber_to_process=-1;
		$vm.close_dialog({name:'_system_import_dialog_module'});
		alert(gNumber_completed.toString()+" records have been imported.");
		_set_req(); _request_data();
	}
}
//-------------------------------------
