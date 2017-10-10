$('#D__ID').data("week",0);
$('#previous__ID').on('click',function(){	$('#D__ID').data("week",$('#D__ID').data("week")-1);	set_week();		$('#D__ID').trigger('display')	})
$('#this__ID').on('click',    function(){	$('#D__ID').data("week",0);					            set_week();		$('#D__ID').trigger('display')	})
$('#next__ID').on('click',    function(){	$('#D__ID').data("week",$('#D__ID').data("week")+1);	set_week();		$('#D__ID').trigger('display')	})
$('#refresh__ID').on('click', function(){	$('#D__ID').trigger('display')	})
var set_week=function(){
        var d1=$vm.date_add_days($vm.date_weekfirst(new Date()),7*$('#D__ID').data("week")-1);
        var d2=$vm.date_add_days(d1,6)
        var s=$vm.date_to_string_dmy(d1)+' - '+$vm.date_to_string_dmy(d2)
        $('#period__ID').text(s);
        $('#D__ID').data("first_day", $vm.date_to_string_dmy(d1));
        $('#D__ID').data("last_day",  $vm.date_to_string_dmy(d2));
}
set_week();
//---------------------------------------------
$('#back__ID').on('click',function(event){
      event.stopPropagation();
      $vm.back({div:'__ID'});
});
//---------------------------------------------
