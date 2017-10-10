$('#D__ID').css('min-height',$vm.min_height);
$('#D__ID').css('transition','opacity 0.5s ease-in-out');
$('#D__ID').css('opacity','0');
$('#D__ID').css('visibility','hidden');
$('#D__ID').on('show',function(){
    setTimeout(function(){
        $('#D__ID').css('visibility','visible');
        $('#D__ID').css('opacity','1');
    }, 1);
})
$('#D__ID').on('hide',function(){
    $('#D__ID').css('visibility','hidden');
    $('#D__ID').css('opacity','0');
})
