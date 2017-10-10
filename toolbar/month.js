$('#D__ID').data("month",0);
$('#previous__ID').on('click',function(){   $('#D__ID').data("month",$('#D__ID').data("month")-1);	set_month();	$('#D__ID').trigger('display')	})
$('#this__ID').on('click',    function(){	$('#D__ID').data("month",0);						    set_month();	$('#D__ID').trigger('display')	})
$('#next__ID').on('click',    function(){	$('#D__ID').data("month",$('#D__ID').data("month")+1);	set_month();	$('#D__ID').trigger('display')	})
$('#refresh__ID').on('click', function(){	$('#D__ID').trigger('display')	})
var set_month=function(){
      var d=$vm.first_day_of_current_month();
      d.setMonth(d.getMonth()+$('#D__ID').data("month"));
      var s=(d.getMonth()+1)+'/'+d.getFullYear();
      $('#month_year__ID').text(s);

      var d=new Date();
      var y=d.getFullYear()
      var m=d.getMonth()+$('#D__ID').data("month");
      var d0=new Date(y,m,1,0,0,0,0);
      var e=d0.getDay();

      var x=$vm.date_add_days(d0,-e);	  $('#D__ID').data("first_day", $vm.date_to_string_dmy(x));
      var y=$vm.date_add_days(d0,-e+41);  $('#D__ID').data("last_day",  $vm.date_to_string_dmy(y));
}
set_month();
//---------------------------------------------
$('#back__ID').on('click',function(event){
      event.stopPropagation();
      $vm.back({div:'__ID'});
});
//---------------------------------------------
