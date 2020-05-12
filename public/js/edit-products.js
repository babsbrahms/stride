//categores

var categories = document.getElementById("categories");
var catVal = document.getElementById("catVal");
console.log(categories)
var catoptions = categories.options;
var catvalue = catVal.value;

for(var i=0; i< catoptions.length; i++){
    var catoption = catoptions[i].value;
    
    if(catoption === catvalue){
        catoptions[i].selected = true;
    }

};


//skin color

var skinColor = document.getElementById("skinColor");
var colVal = document.getElementById("colVal");

var coloptions = skinColor.options;
var colvalue = colVal.value;

for(var i=0; i< coloptions.length; i++){
    var coloption = coloptions[i].value;
    
    if(coloption === colvalue){
        coloptions[i].selected = true;
    }

};



//skin type

var skinType = document.getElementById("skinType");
var typeVal = document.getElementById("typeVal");

var typeoptions = skinType.options;
var typevalue = typeVal.value;

for(var i=0; i< typeoptions.length; i++){
    var typeoption = typeoptions[i].value;
    
    if(typeoption === typevalue){
        typeoptions[i].selected = true;
    }

};

