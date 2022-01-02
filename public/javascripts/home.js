$(document).ready(function(){
  $(window).scroll(function(){
    var scroll = $(window).scrollTop();
    if (scroll > 150) {
      $(".navbar").css("background" , "rgba(0,0,0)");
    }

    else{
      $(".navbar").css("background" , "");
    }
  })
})
