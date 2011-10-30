ALLOWED_MOVES = ['forward', 'backward', 'right', 'left', 'penup', 'pendown', 'color']
PI = 3.14159265


// helper functions
function degreesToRadians(angle) {
  var radians = angle * (PI/180);
  return radians;
}

function radiansToDegrees(angle) {
  var degrees = angle * (PI/pi);
  return degrees;
}

var turtle = {
  
  instructions: [], // will hold the instruction objects
  lines: [],  // each instruction text line to be parsed
  context: null,
  stroke: true,
  strokeStyle: '#000',
  x: 0,  //  max 400
  y: 0, // max 300
  angle:270, // the angle the turtle is facing in degrees
  
  /* --------------------
  
      Logo commands
  
     ---------------------*/
  
  forward: function(distance) {
    this.move(distance, this.angle);
  },
  
  /* Here I assumed the turtle would back up while facing the same direction*/
  backward: function(distance) {
    this.move(distance, this.angle - 180);
  },
  
  right: function(angle) {
    newAngle = this.angle + angle;
    if(newAngle > 360) {
      newAngle = newAngle - 360;
    }
    this.angle = newAngle;
  },
  
  left: function(angle) {
    newAngle = this.angle - angle;
    
    if(newAngle < 0) {
      newAngle = newAngle + 360;
    }
    this.angle = newAngle;
  },
  
  penup: function() {
    this.stroke = false;
  },
  
  pendown: function() {
    this.stroke = true;
  },
  
  color: function(colour) {
    this.strokeStyle = colour.toString();
  },
  
    /* --------------------
  
      Turtle functions
  
     ---------------------*/
     
  updateCoords: function(distance, angle) {
    this.x = this.x + Math.cos(degreesToRadians(angle)) * distance;
    this.y = this.y + Math.sin(degreesToRadians(angle)) * distance;
  },
  
  
  // moves the turtle
  move: function(distance, angle) {
    this.context.beginPath();
    this.context.moveTo(this.x,this.y);
    this.updateCoords(distance, angle);
    this.context.lineTo(this.x, this.y);
    
    if(this.stroke) {      
      this.context.strokeStyle = this.strokeStyle;
      this.context.stroke();
    } 
  },
  
  
  loadInstructions: function(instructionText) {
    var instructions = [];
    
    this.lines = instructionText.split("\n");
    
    // do the substitutions if there are some repeat loops
    if(this.hasRepeats()) {
      
      var numberOfRepeats = this.numberOfRepeats();
      for (var i=0; i < numberOfRepeats; i++) {
        this.substituteInnerRepeat();
      };
    }
    
    _.each(this.lines, function(line){
      line = line.trim();
      line = line.split(" ");
      if(line[0] != ""){
        instructions.push({'command':line[0], 'arg':line[1]});
      }
    });
    
    this.instructions = instructions;
  },
  
  
  /* finds all the repeat/end loops in the command list and returns an array of indexes for the repeat and end
    e.g.
    repeat 36
      repeat 12
        forward 30
        right 30
      end
      right 10
    end 
    
     will return [[1, 4], [0, 6]]
  */ 
  findBeginLoops: function() {
    var lines = this.lines;
    var loopIndexes = [];
    
    //TODO match repeats based on indentation
    // for now get rid of indentation
    var linesDup = _.map(lines, function(line){ return line.trim(); });
    
    _.each(linesDup, function(line, i){
      if(line.match(/^repeat/)) {
        
        var endIndex = _.lastIndexOf(linesDup, "end");
        linesDup = linesDup.slice(0, endIndex);
        
        loopIndexes.push([i, endIndex]);
      }
    });
    
    return loopIndexes.reverse();
  },
  
  
  findInnerLoop: function() {
    var indexes = this.findBeginLoops(this.lines);
    return indexes[0];
  },
  
  
  // checks the instructions for repeat constructs
  hasRepeats: function() {
    return _.any(this.lines, function(line){ return line.match(/^\s*repeat/) });
  },
  
  numberOfRepeats: function() {
    var n = this.findBeginLoops();
    return n.length;
  },
  
  // will substitute the inner most repeat loop
  substituteInnerRepeat: function() {
    // find the indexes for the substitutions
    var lines = this.lines;
    var indexes = this.findInnerLoop();
    
    //tidy up and get the number of loops needed
    var repeatCommand = lines[indexes[0]].trim();
    var repeatNumber = repeatCommand.split(" ")[1];
    
    // create new lines array with substitutions
    var lines1 = lines.slice(0, indexes[0]);
    for (var i=0; i < repeatNumber; i++) {
      lines1 = lines1.concat(lines.slice(indexes[0]+1, indexes[1]));
    };
    
    lines1 = lines1.concat(_.rest(lines, indexes[1]+1));
    this.lines = lines1;
  },
  
  
  // clear the canvas, reset the angle and starting position
  clearCanvas: function(canvas) {
    canvas.width = canvas.width;
    this.angle = 270;
    this.x = 200;
    this.y = 150;
  },
  
  
  draw: function(canvas) {
    this.context = canvas.getContext("2d");
    this.clearCanvas(canvas)
    
    _.each(this.instructions, function(instruction){
      // check that we are eval-ing only allowed moves
      if(instruction.command != undefined && _.include(ALLOWED_MOVES, instruction.command)) {
        eval(turtle.functionText(instruction));
      }
    });
  },
  
  
  // method to generate the text to used in the eval. Seperated out for easier testing
  functionText: function(instruction) {
    var func = instruction.command;
    var arg = instruction.arg || "";
    var text = "turtle." + func;
    
    if(func == "color") {  // need to quote the color
      text = text + "('"+arg+"');";
    }
    else {
      text = text + "("+arg+");";
    }
    return text;
  }
};