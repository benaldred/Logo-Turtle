$(document).ready(function(){
    
    var canvas = document.getElementById("canvas");
    
    $('#draw_button').bind('click', function (e) {
      // get instructions
      var instructions = $('#instructions').val();
      
      //give to instructions to turtle obj and draw on the canvas
      turtle.loadInstructions(instructions);
      turtle.draw(canvas);

      return false;
    });
    
    $('#clear_button').bind('click', function () {
      turtle.clearCanvas(canvas);
      return false;
    });
});