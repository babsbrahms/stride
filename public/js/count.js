var info = document.getElementById('infoCount');


var product = document.getElementById('productCount');
var post = document.getElementById('postCount');
var user = document.getElementById('userCount');
var order = document.getElementById('orderCount');

function ajaxGet(url, info){
    var xhr = new XMLHttpRequest()

    xhr.open("GET", url, true)

    xhr.onerror = function(){
        info.innerHTML = 'Error occured while processing your request. Check console for more detail'
    }
    xhr.onprogress =function(){
        info.innerHTML = "loading..."
    }
    xhr.onload = function(){
        if(xhr.status == 200){
            var data =JSON.parse(xhr.responseText)
            info.innerHTML = ""
            product.innerHTML = data.productCount
            post.innerHTML = data.blogCount
            user.innerHTML = data.userCount
            order.innerHTML = data.orderCount
           
        }else if(xhr.status == 404){
            info.innerHTML = "Not found"
        }
    }

    xhr.send()
}


window.onload = ajaxGet('/cms/count', info)