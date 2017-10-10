$('#D__ID').addClass('ease_in_out_0__ID')
$('#D__ID').removeClass('ease_in_out_1__ID')
$('#D__ID').on('show',function(){
    setTimeout(function(){
        $('#D__ID').addClass('ease_in_out_1__ID')
        $('#D__ID').removeClass('ease_in_out_0__ID')
        $('#D__ID').css('min-height',$vm.min_height);
        $('#content_slot').addClass('main_content_0')
        $('#content_slot').removeClass('main_content_1')
    }, 1);
})
$('#D__ID').on('hide',function(){
    $('#D__ID').addClass('ease_in_out_0__ID')
    $('#D__ID').removeClass('ease_in_out_1__ID')
    $('#content_slot').addClass('main_content_1')
    $('#content_slot').removeClass('main_content_0')
})
