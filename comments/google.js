if($vm.comments==1){
	$('#btn_c__ID').show();
	var active=0;
	//----------------------------------------
	$('#btn_c__ID').on('click',function(){
	    if( $('#g_comments__ID').css('display')=='none' ){
		    $('#g_comments__ID').css('display','block');
			var top1=$('#g_comments__ID').offset().top;	//$('#D__ID').scrollTop(top1/2); 
			window.scrollTo(0,top1/2);
			if(active==0){
				active=1;
				gapi.comments.render('comments__ID', {
				    href: "https://www.vmiis.com/#"+$vm.vm['__ID'].name.replace(/-/g,'_'),
				    width: $(window).width()-20,
				    first_party_property: 'BLOGGER',
				    view_type: 'FILTERED_POSTMOD'
				});
	    	}
	    }
	    else $('#g_comments__ID').css('display','none');
	})
	//----------------------------------------
}
