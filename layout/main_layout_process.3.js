var _redirect_module="";
var home_module_name='home';
//------------------------------------
$vm.root_layout_content_slot="content_slot";
$vm.root_layout_header='header__ID';
$vm.root_layout_footer='footer__ID';
//------------------------------------
window.onmessage=function(e){
    if(e.data.username!=undefined && e.data.user_id!=undefined){
        $vm.user=e.data.username;
        $vm.user_id=e.data.user_id;
        $VmAPI.set_token(e.data.token,e.data.api_url,e.data.username,e.data.user_id,e.data.nickname);
        location.reload(true);
        g_user=e.data.username;
        login_changed();
    }
//alert(JSON.stringify(e.data)	)
    $vm.process_message_from_child(e);
};
//------------------------------------
$('#D__ID').on('login_changed',function(){
    login_changed();
});
//------------------------------------
$('#nav__ID li').on('click',function(event){
    event.stopPropagation();
    process_click(this);
    var name=$(this).attr('data-name');
    if(name!==undefined){ //close
        /*
        if($vm.mobile===1){
            $("#menu_button__ID").triggerHandler('click');
            $vm.mobile=0;
        }
        */
        if( $('#nav__ID').find(".button").hasClass('menu-opened')==true ){
            $('#nav__ID').find(".button").triggerHandler('click');
        }
    }
});
//---------------------------------------------
var load_module=function(name){
	if($vm.config_list[name]==undefined){
		if($vm.app_config.modules[name]!=undefined && $vm.app_config.modules[name].url!=undefined){
			//this is for modules
			var url=$vm.app_config.modules[name].url;
			url+='?_v='+$vm.version+$vm.reload;
			url=$vm.url(url);
			if(url[0]=='/') url=$vm.hosting_path+url;
			//---------------------------
			var module="L_0_"+name;
			if($vm.module_list[module]==undefined){
				$vm.module_list[module]={
					url:url,
					var:{},
				}
			}
			//---------------------------
			$vm.load_module_by_name(module,$vm.root_layout_content_slot,{
				name:name,
				mobj:$vm.vm['__ID'],
				record:{UID:0},
				//panel:'main_panel',
				//panel_name:panel_name,
				sys:{
					//config:config,
					UID:0,
				}
			})
			$vm.config_list[name]=$vm.module_list[module].id;
		}
		else if($vm.app_config.panels[name].config_url!=undefined){
			//this is for panels
			var url=$vm.app_config.panels[name].config_url;
			if(url[0]=='/') url=$vm.hosting_path+url;
			url+='?_v='+$vm.version+$vm.reload;
			url=$vm.url(url);
			if(url[0]=='/') url=$vm.hosting_path+url;
			console.log('loading '+url)
			$.get(url,function(txt){
				//here is control panel json text
				var text=$('<div/>').html(txt).text();
				//---------------------------
				var config;
				try{
					config=JSON.parse(text);
				}
				catch (e){
					alert("Error in app config file\n"+e);
					return;
				}
				var panel_url="";
				var panel_name="";
				if(config.panel!==undefined){
					panel_url=config.url;
					panel_name=config.name;
				}
				else if(config.panels!==undefined){
					panel_url=config.panels.main_panel.url;
					panel_name=config.panels.main_panel.name;
				}
				//---------------------------
				var module="L_0_"+name;
				if($vm.module_list[module]==undefined){
					$vm.module_list[module]={
						url:panel_url,
						var:{},
					}
				}
				//---------------------------
				//console.log('loding panel '+panel_url)
				$vm.load_module_by_name(module,$vm.root_layout_content_slot,{
					name:panel_name,
					mobj:$vm.vm['__ID'],
					record:{UID:0},
					panel:'main_panel',
					panel_name:panel_name,
					sys:{
						config:config,
						UID:0,
					}
				})
				$vm.config_list[name]=$vm.module_list[module].id;
			},'text').fail(function() {
				alert( "The file '"+url+"' doesn't exist! (main_layout.process.3 125)" );
			});
		}
	}
	else{
		var id=$vm.config_list[name];
		$vm.show_module(id,$vm.root_layout_content_slot);
	}
    if(name==home_module_name){
        setTimeout(function(){
            $('#content_slot').addClass('main_content_0')
            $('#content_slot').removeClass('main_content_1')
            $('#control_prev__ID').show();$('#control_next__ID').show();
        }, 1);
    }
    else{
        $('#content_slot').addClass('main_content_1')
        $('#content_slot').removeClass('main_content_0')
        $('#control_prev__ID').hide();$('#control_next__ID').hide();
    }
}
//------------------------------------
var process_click=function(li){
    var name=$(li).attr('data-name');
    var a=$(li).attr('data-a');
    var b=$(li).attr('data-b');
    if(name!==undefined){
        load_module(name);
        //process_background(name);
    }
    else if(a!==undefined){
        window.open(a+"?d=1");
        return;
    }
    else if(b!==undefined){
        if(b==='1') window.open($VmAPI.api_base+"signin.html?url="+window.location.href,"Sign In","width=600, height=600");
        else if(b==='2') signout();
        else if(b==='5'){
            localStorage.clear();
            alert('The local storage is cleared');
            return;
        }
    }
    else{
        return;
    }
}
//------------------------------------
var login_changed=function(){
    if($vm.user!=$VmAPI.get_username()){
		$vm.user='';
	}
    if($vm.user=="" || $vm.user==null) $vm.user="guest";
    $('#sign__ID').text($vm.user);
    if($vm.user!='guest'){
        $('#username__ID').text('Signed in as '+ $vm.user);
        $('#signin__ID').hide();
        $('#myaccount__ID').show();
        $('#signout__ID').show();
        $('#create__ID').hide();
    }
    else{
        $('#username__ID').text('');
        $('#signin__ID').show();
        $('#myaccount__ID').hide();
        $('#signout__ID').hide();
        $('#create__ID').show();
    }
    if(_redirect_module!=='') load_module(_redirect_module);
    else load_module('home');
};
//---------------------------------------------
var signout=function(){
    $VmAPI.clear_token();
    $VmAPI.request({data:{cmd:'signout'},callback:function(c){
        g_user="guest";
        g_user_id="";
        $vm.user="guest";
        $vm.user_id="";
        login_changed();
        location.reload(true);
    }});
};
//---------------------------------------------
var layout_resize=function(){
    var slideWidth=window.innerWidth;
    var slideHeight=window.innerHeight;
    var slideCount = $('#slider__ID ul li').length;
    var sliderUlWidth = slideCount * slideWidth;
    $('#slider__ID').css({ width: '100%', height: slideHeight });
    $('#slider__ID ul').css({ width: sliderUlWidth, marginLeft: - slideWidth });

    var header_height=$('#header__ID').outerHeight();
    $vm.min_height=$(window).height()-header_height-$('#footer__ID').outerHeight();
    $('#content_slot').css('min-height',$vm.min_height+'px');
};
//------------------------------------
window.addEventListener("resize", function(){ layout_resize(); });
//------------------------------------
on_load();
setTimeout(function () {
    layout_resize();
}, 500);
//------------------------------------
