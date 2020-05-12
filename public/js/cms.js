
var formBlog = document.getElementById("formBlog");
var info = document.getElementById('info');
var addComment = document.getElementById('addComment')


function ajaxPost( url, body, info){
    var message = JSON.stringify(body)
    
    var xhr = new XMLHttpRequest()

    xhr.open("post", url, true)

    xhr.setRequestHeader('Content-type','Application/json')

    xhr.onerror = function(err){
        info.innerHTML = 'Error occured while processing your request. Check console for more detail'
    }
    xhr.onprogress =function(){
        info.innerHTML = "loading..."
    }
    xhr.onload = function(){
        if(xhr.status == 200){
            info.innerHTML = ""
            
        }else if(xhr.status == 404){
            info.innerHTML = "Not found"
        }
    }

    xhr.send(message)

    
}




