if($vm.comments==1){
	$('#btn_c__ID').show();
	var active=0;
	//----------------------------------------
	$('#btn_c__ID').on('click',function(){
	    if( $('#f_comments__ID').css('display')=='none' ){
		    $('#f_comments__ID').css('display','block');
			var top1=$('#f_comments__ID').offset().top;	$('#D__ID').scrollTop(top1/2);
			if(active==0){
				active=1;
				(function(d, s, id) {
				  var js, fjs = d.getElementsByTagName(s)[0];
				  if (d.getElementById(id)) return;
				  js = d.createElement(s); js.id = id;
				  js.src = "//connect.facebook.net/en_US/sdk.js#xfbml=1&version=v2.10";
				  fjs.parentNode.insertBefore(js, fjs);
				}(document, 'script', 'facebook-jssdk'));
				var id=$vm.vm['__ID'].name.replace(/-/g,'_');
				var txt="<div class='fb-comments' data-href='https://www.vmiis.com/#"+id+"' data-width='100%' data-numposts='5'>Loading...</div>";
				$('#f_comments__ID').html(txt);
	    	}
	    }
	    else $('#f_comments__ID').css('display','none');
	})
	//----------------------------------------
}
