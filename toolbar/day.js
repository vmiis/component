$('#D__ID').data("day",0);
$('#previous__ID').on('click',function(){	$('#D__ID').data("day",$('#D__ID').data("day")-1);		set_date(); $('#D__ID').trigger('display')	})
$('#this__ID').on('click',function(){		$('#D__ID').data("day",0);							    set_date(); $('#D__ID').trigger('display')	})
$('#next__ID').on('click',function(){		$('#D__ID').data("day",$('#D__ID').data("day")+1);		set_date(); $('#D__ID').trigger('display')	})
$('#date__ID').datepicker({dateFormat:'dd/mm/yy'});
$('#date__ID').on('change',function(){
    $('#D__ID').data("day",$vm.date_day_diff($vm.date_today(),date_parse($('#date__ID').val())));
    $('#D__ID').trigger('display')
});
$('#refresh__ID').on('click',function(){  $('#D__ID').trigger('display')	})
var set_date=function(){
    var d=$vm.date_to_string_dmy($vm.date_add_days($vm.date_today(),$('#D__ID').data("day")))
    $('#date__ID').val(d);
}
set_date();
//---------------------------------------------
$('#back__ID').on('click',function(event){
      event.stopPropagation();
      $vm.back({div:'__ID'});
});
//---------------------------------------------
