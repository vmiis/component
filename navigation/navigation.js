var _module=$vm.module_list[$vm.vm['__ID'].name];
var _app_id="";
var v=$vm.module_list[$vm.vm['__ID'].name].var;
if(v!=undefined && v.app_id!=undefined) _app_id=v.app_id;
var _nav_name='';
var _content_slot=$vm.root_layout_content_slot;
var _special_click_process='';
//---------------------------------------------------------------
if($vm.server=='production') $('#how__ID').hide();
//---------------------------------------------------------------
$('.nav__ID li').each(function(){
    var name=$(this).attr('data-name');
    if(name=='under_development'){
        $(this).css('font-style','italic');
    }
});
//---------------------------------------------------------------
$('.nav__ID u').on('click',function(){
    var $div=$(this).next('div');
    if($div.css('display')!=undefined){
        if ($div.css('display') == 'none'){
            $div.show();
            $(this).css('font-weight','700');
        }
        else{
            $div.hide();
            $(this).css('font-weight','300');
        }
    }
})
//---------------------------------------------
$('.nav__ID li').on('click',function(event,trigger_input){
      event.stopPropagation();
      if( $(this).hasClass( 'not_allowed__ID' )===true){
            alert("No permission!");
            return;
      }
      var s=$(this).attr('data-s');
      if(s!==undefined && _special_click_process!==''){
            _special_click_process(this);
            return;
      }
      var name=$(this).attr('data-name');
      var url=$(this).attr('data-url');
      var src=$(this).attr('data-src');
      var m=$(this).attr('data-pid'); //old module
      var op=$(this).attr('data-op');
      if(op!==undefined){
         op=JSON.parse(op);
      }
      else op={}
      if(name!==undefined){
          var new_name=_app_id+name;
          if($vm.module_list[new_name]===undefined){
              alert("Under development. ("+new_name+")");
              return;
          }
          var mid;//=$vm.module_list[name][0];
          var url;//=$vm.module_list[name][1];
          if(Array.isArray($vm.module_list[new_name])===true){
              mid=$vm.module_list[new_name][0];
              url=$vm.module_list[new_name][1];
          }
          else{
              mid=$vm.module_list[new_name]['table_id'];
              url=$vm.module_list[new_name]['url'];
          }
         var id=$vm.module_list[new_name].id;
         if(id==undefined) id=$vm.id();
         $vm.module_list[new_name].id=id;
          var param={
              name:new_name,
              pid:id,//$vm.id(url+mid),
              slot:_content_slot,
              url:$vm.url(url),
              nav_name:_nav_name,
              nav_ID:'__ID',
              op:op
           }
           $vm.load_module(param);
      }
      else if(url!==undefined){
            var param={
                  pid:$vm.id(url),
                  slot:_content_slot,
                  url:url,
                  source:src
            }
            $vm.load_module(param);
      }
      else if(m!==undefined){
            //old module
            if(trigger_input!==undefined) $(this).vm6('load_module', m, _content_slot,trigger_input);
            else $(this).vm6('load_module', m, _content_slot,{puid:undefined});
      }
      else{
            var a=$(this).attr('data-a');
            if(a!==undefined) window.open(a);
      }
});
//---------------------------------------------------------------
$('#back__ID').on('click',function(event){
      event.stopPropagation();
      $vm.back({div:'__ID'});
});
//---------------------------------------------------------------
var _set_permissions=function(callback){
    var pids="";
    var vm_permission={};
    if($vm.server=='production'){
        $('.nav__ID li').each(function(index){
            var name=$(this).attr('data-name');
            if(name!==undefined && $vm.module_list[_app_id+name]!==undefined){
                var pid=undefined;  //if($vm.module_list[name]!==undefined)  pid=$vm.module_list[name][0];
                if(Array.isArray($vm.module_list[_app_id+name])===true){
                    pid=$vm.module_list[_app_id+name][0];
                }
                else{
                    pid=$vm.module_list[_app_id+name]['table_id'];
                }
                if(pid!==undefined && pid!=='--------' && pid!==''){
                    if(pids.indexOf(pid+',')==-1){
                        if(pids!=="") pids+=",";
                        pids+=pid;
                    }
                }
            }
        });
        if(pids!==""){
            $VmAPI.request({data:{cmd:'permissions',pids:pids},callback:function(res){
                vm_permission=res;
                $('.nav__ID li').each(function(index){
                    var name=$(this).attr('data-name');
                    if(name!==undefined && $vm.module_list[_app_id+name]!==undefined){
                        var pid=undefined;  //if($vm.module_list[name]!==undefined)  pid=$vm.module_list[name][0];
                        if(Array.isArray($vm.module_list[_app_id+name])===true){
                            pid=$vm.module_list[_app_id+name][0];
                        }
                        else{
                            pid=$vm.module_list[_app_id+name]['table_id'];
                        }
                        if(pid!==undefined && pid!=='--------'){
                            $(this).removeClass('not_allowed__ID');
                            if(vm_permission[pid]===undefined){
                                $(this).addClass('not_allowed__ID')
                            }
                        }
                    }
                })
                if(callback!==undefined) callback(res);
            }})
        }
        else console.log("No pids");
    }
}
//---------------------------------------------------------------
var set_li_permission=function($li,pid){
    $VmAPI.request({data:{cmd:'query_permission',db_pid:pid},callback:function(res){
        $li.removeClass('not_allowed__ID');
        if(res.pms!=undefined){
            var p=parseInt(res.pms) & parseInt("1111",2); //read,write,delete,full
            if(p==0){
                $li.addClass('not_allowed__ID')
            }
        }
    }})
}
//---------------------------------------------------------------
var _set_li_permissions=function(callback){
    if($vm.server=='production'){
        $('.nav__ID li').each(function(index){
            $(this).addClass('not_allowed__ID')
            var name=$(this).attr('data-name');
            if(name!==undefined && $vm.module_list[_app_id+name]!==undefined){
                var pid=$vm.module_list[_app_id+name].table_id;
                if(pid!==undefined && pid!=='--------' && pid!==''){
                    set_li_permission($(this),pid);
                }
                else $(this).removeClass('not_allowed__ID');
            }
            else $(this).removeClass('not_allowed__ID');
        });
    }
}
//---------------------------------------------------------------
var _disable_all=function(){
    $('.nav__ID li').each(function(index){
        var name=$(this).attr('data-name');
        $(this).addClass('not_allowed__ID')
    })
}
//---------------------------------------------------------------
//var _repository=$vm.repository.replace(/\//g,'_').replace(/-/g,'_')+'_';
var _add_module_index=function(r,list){
    $('#D__ID li').each(function(){
        var d=$(this).attr('data-name');
        if( d!=undefined){
            $(this).attr('data-name',r+d);
        }
    })
    for(key in list){
        if(list[key].url!==undefined) list[key].url=$vm.url(module_list[key].url.replace('...','__BASE__/'+$vm.repository));
        $vm.module_list[r+key]=list[key];
    }
}
//---------------------------------------------
var _set_nav_link=function(){
    var link=_nav_name;
    var DID='__ID';
    var i=0;
    while (i<5) {
        i++;
        var parent_nav_name=$vm.vm[DID].nav_name;
        var parent_nav_ID=$vm.vm[DID].nav_ID;
        if(parent_nav_name!=='' && parent_nav_name!==undefined){
            link="<u data-id="+DID+" style='cursor:pointer'>"+parent_nav_name+"</u> / "+link;
        }
        else break;
        DID=parent_nav_ID;
    }
    $('#nav_link__ID').html(link);
    $('#nav_link__ID').find('u').each(function(){
        $(this).on('click',function(){
            var DID=$(this).attr('data-id');
            $('#back'+DID).triggerHandler('click')
        })
    })
}
//---------------------------------------------
$('#toolbar__ID').on('dblclick',function(event){
    if(event.shiftKey){
        event.stopPropagation();
        _show_links('#panel__ID');
    }
})
//-------------------------------------------------
var check_url=function(url){
    if(url.indexOf('127.0.0.1')==-1) return "";
    var r="";
    $.ajax({
        type: "POST",
        url: url,
        complete:function(jqXHR, textStatus){
            //r=jqXHR.status;
            r=textStatus;
        },
    })
    return r;
}
//-------------------------------------------------
var _show_links=function($div){
    var txt="";
    jQuery.ajaxSetup({async:false});
    $($div+' li').each(function(index){
        var name=$(this).attr('data-name');
        if(name!==undefined){
            var space='';
            var n=50-name.length;
            for(var i=0;i<n;i++) space+=' ';
            if($vm.module_list[_app_id+name]!==undefined){
                var r=check_url($vm.module_list[_app_id+name].url);
                txt+=name+space+" "+r+" - "+$vm.module_list[_app_id+name].url+"\n";
            }
            else{
                txt+=name+space+" - NOT IN MODULE LIST"+"\n";
            }
        }
    });
    jQuery.ajaxSetup({async:true});
    var url='__BASE__/vmiis/Common-Code/code_viewer/code.html'
    var param={
        pid:$vm.id(url),
        slot:$vm.root_layout_content_slot,
        url:$vm.url(url),
        op:{name:'Links',code:txt}
    }
    $vm.load_module(param);
}
//---------------------------------------------
var _set_li_text=function(){
    $('.nav__ID li').each(function(){
        $(this).attr('data-li_text',$(this).text());
    })
}
_set_li_text();
//---------------------------------------------
var _check_count_where='';
var _check_count=function($li,pid,data_counting){
    var sql="select Number=count(ID) from [TABLE-"+pid+"]"+_check_count_where;
	var cmd='query_records';
	if(data_counting=='2') cmd='query_records_s2_v2';
    $VmAPI.request({data:{cmd:cmd,sql:sql},callback:function(res){
        if(res.records.length>0 && res.records[0].Number!='0'){
            var txt=$li.attr('data-li_text');
            txt=$('<div/>').html(txt).text();
            var num=$('<div/>').html(res.records[0].Number).text();
            $li.html(txt+" <mark style='font-size:9px'>["+num+"]</mark>")
        }
    }});
}
//---------------------------------------------
$('#check_count__ID').on('click',function(){
    $('.nav__ID li').each(function(){
        var $li=$(this);
        var data_name=$(this).attr('data-name');
        var data_check=$(this).attr('data-check');
        var cursor=$(this).css('cursor');
        if( data_check!==undefined && cursor=='pointer'){
            if($vm.module_list[_app_id+data_name]!==undefined){
                var pid=$vm.module_list[_app_id+data_name].table_id;
                if(pid!='' && pid!='--------') _check_count($li,pid);
            }
        }
    })
})
//---------------------------------------------
$('#counting__ID').on('click',function(){
    $('.nav__ID li').each(function(){
        var $li=$(this);
        var data_mid=$(this).attr('data-mid');
        var data_counting=$(this).attr('data-counting');
        var cursor=$(this).css('cursor');
        if(data_counting!==undefined && cursor=='pointer'){
            if($vm.module_list[data_mid]!==undefined){
                var tid=$vm.module_list[data_mid].table_id;
                if(tid!='' && tid!='--------') _check_count($li,tid,data_counting);
            }
        }
    })
})
//---------------------------------------------
var _clear_counting=function(){
	$('.nav__ID li').each(function(){
		var txt=$(this).attr('data-li_text');
		if(txt!=undefined){
			$(this).text(txt);
		}
    })
}
//---------------------------------------------
var _development_mark=function(){
    if($vm.server=='development'){
        $('.nav__ID li').each(function(){
            var mark=$(this).attr('data-mark');
            if(mark!=undefined){
                var items=mark.split('|');
                var txt=items[0];
                var style='';
                if(items.length>1) style=items[1];
                if(style!='') style="style=\""+style+"\"";
                var litxt=$(this).html()+"  <mark "+style+">"+txt+"</mark>";
                $(this).html(litxt)
            }
        })
    }
}
//-------------------------------------------------
var _mlist=$vm.module_list;
var _mobj=$vm.vm['__ID'];
var _sys='';
if(_mobj.op!=undefined && _mobj.op.sys!=undefined){
	_sys=_mobj.op.sys;
}
//-----------------------------------------------
