//clide show
if( $('#slider__ID').length!==0 ){
      var slideWidth=window.innerWidth;
      var slideHeight=window.innerHeight;
      var slideCount = $('#slider__ID ul li').length;
      var sliderUlWidth = slideCount * slideWidth;
      $('#slider__ID').css({ width: slideWidth, height: slideHeight });
      $('#slider__ID ul').css({ width: sliderUlWidth, marginLeft: - slideWidth });
      $('#slider__ID ul li:last-child').prependTo('#slider__ID ul');
      var moveRight=function() {
            $('#slider__ID ul').animate({
                  left: - slideWidth
            }, 700, function () {
                  $('#slider__ID ul li:first-child').appendTo('#slider__ID ul');
                  $('#slider__ID ul').css('left', '');
            });
      };
      var moveLeft=function() {
            $('#slider__ID ul').animate({
                  left: + slideWidth
            }, 700, function () {
                  $('#slider__ID ul li:last-child').prependTo('#slider__ID ul');
                  $('#slider__ID ul').css('left', '');
            });
      };
      $('#control_prev__ID').on('click',function () { moveLeft(); });
      $('#control_next__ID').on('click',function () { moveRight();});
}
//------------------------------------
