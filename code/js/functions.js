$( "#frankreich" ).hover(function() {
    $('.info').fadeIn(200);
  });

$( "body" ).hover(function() {
    $('.info').fadeOut(200);
  });


////////////


$( "button" ).click(function() {
  $("circle").attr("class", "active");
  });