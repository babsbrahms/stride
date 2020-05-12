//status

var orderStatus = document.getElementById("orderStatus");
var staVal = document.getElementById("staVal");

var statusoptions = orderStatus.options;
var statusvalue = staVal.value;

for(var i=0; i< statusoptions.length; i++){
    var statusoption = statusoptions[i].value;
    
    if(statusoption === statusvalue){
        statusoptions[i].selected = true;
    }

};