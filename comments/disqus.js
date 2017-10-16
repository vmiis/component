if($vm.comments==1){
	$('#btn_c__ID').show();
	var active=0;
	//----------------------------------------
	$('#btn_c__ID').on('click',function(){
	    if( $('#comments__ID').css('display')=='none' ){
		    $('#comments__ID').css('display','block');
			var top1=$('#comments__ID').offset().top;	//$('#D__ID').scrollTop(top1/2);
			window.scrollTo(0,top1/2);
			if(active==0){
				active=1;
				$('#disqus_thread').appendTo("#comments__ID");
				var id = $vm.vm['__ID'].name.replace(/-/g,'');
				console.log(id)
				console.log($vm.hosting_path+"/#!"+id)	
		        if(typeof DISQUS != "undefined") {
		            DISQUS.reset({
		                reload: true,
		                config: function () {
		                    this.page.identifier = id;
		                    this.page.url = $vm.hosting_path+"/#!"+id;
							this.page.title=id;
		                }
		            });
		        }					
		        else{
					disqus_config = function () {
						this.page.identifier=id;
						this.page.url=$vm.hosting_path+"/#!"+id;
						this.page.title=id;
					};
					(function() {
					var d = document, s = d.createElement('script');
					s.src = 'https://modular-distributed-web-application.disqus.com/embed.js';
					s.setAttribute('data-timestamp', +new Date());
					(d.head || d.body).appendChild(s);
					})();
		        };
	    	}
	    }
	    else $('#comments__ID').css('display','none');
	})
	//----------------------------------------
}
