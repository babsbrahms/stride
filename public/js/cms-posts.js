var posts = document.getElementById('posts');
var info = document.getElementById('info');

posts.onclick = function(e){

    if(e.target.classList.contains('delete-post')){
             
            var id= e.target.getAttribute('data-id');
        
                
                var xhr = new XMLHttpRequest()
                
            
                xhr.open("DELETE", `/cms/delete-posts/${id}`, true)
            
                
            
                xhr.onerror = function(err){
                    info.innerHTML = 'Error occured while processing your request. Check console for more detail'
                }
                xhr.onprogress =function(){
                    info.innerHTML = "loading..."
                }
                xhr.onload = function(){
                    if(xhr.status == 200){
                        info.innerHTML = ""
                        del()
                        
                    }else if(xhr.status == 404){
                        info.innerHTML = "Not found"
                    }
                }
            
                xhr.send()
      
        

      

                
        //another function
        function del(){
           
            var refId= e.target.getAttribute('data-comment');
            console.log(refId)
            var xhr = new XMLHttpRequest()
            
        
            xhr.open("DELETE", `/cms/delete-comments/${refId}`, true)
        
            
        
            xhr.onerror = function(err){
                info.innerHTML = 'Error occured while processing your request. Check console for more detail'
            }
            xhr.onprogress =function(){
                info.innerHTML = "loading..."
            }
            xhr.onload = function(){
                if(xhr.status == 200){
                    info.innerHTML = ""
                    window.location.reload();
                }else if(xhr.status == 404){
                    info.innerHTML = "Not found"
                }
            }
        
            xhr.send();      
        }


    }    
}



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