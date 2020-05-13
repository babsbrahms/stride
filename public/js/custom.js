(function ($) {
  "use strict";
  // menu fixed js code
  $(window).scroll(function () {
    var window_top = $(window).scrollTop() + 1;
    if (window_top > 50) {
      $('.main_menu').addClass('menu_fixed animated fadeInDown');
    } else {
      $('.main_menu').removeClass('menu_fixed animated fadeInDown');
    }
  });
  
  if (document.getElementById('default-select')) {
		$('select').niceSelect();
  }

  let search = document.getElementById('search')
  let searchForm = document.getElementById('header-search-form');

  searchForm.onsubmit = function searchHeaderBlog () {
   
    console.log('word: ', search.value);
    

    fetch(`/search?search=${search.value}`, {
      method: 'GET'
    })
    .then(res => res.json())
    .then(res =>{
        // console.log(res);
        if (res.result.length > 0) {
          window.location.href = `/blog/${res.result[0]._id}`
        }
    })
    .catch(err => {

    })
    return false;
    
  }

  search.onkeyup = function (e) {
    console.log(e.target.value);
    
  }

  
}(jQuery));