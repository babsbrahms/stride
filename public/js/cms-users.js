//search
var input = document.querySelector("#search");
var items = document.querySelectorAll(".searchResult");



function doSearch (){ 
    
    input.onkeyup = function(e){
        
        
           
            
            var search = e.target.value.toLowerCase()
            Array.from(items).forEach(function(item){

                
                if(item.textContent.toLowerCase().indexOf(search) != -1){
                    item.style.display = "block"
                }else{
                    item.style.display = "none"
                }
            
            })
             
    
         
         
        
    };


};

doSearch()