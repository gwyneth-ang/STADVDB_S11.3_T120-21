let searchInput;
let selectValue;

$(document).ready(function() {
    $(".loading").hide();

    $('#drop-box').on('change', function (e) {
        
        selectValue = $("#drop-box").val();
        searchInput = $("#search-box").val();
    
        console.log(searchInput);
    
        if (selectValue === '5') {
            $(".loading").show();
            selectedFive();
        }
    });

    $('#search-box').on('keyup', function (e) {
        let timeout = null

        clearTimeout(timeout)
        timeout = setTimeout(function() { 
            selectValue = $("#drop-box").val();
            searchInput = $("#search-box").val();

            if (selectValue === '5') {
                $(".loading").show();
                selectedFive();
            }
            else {
                console.log('nothing is selected');
            }       
            
        }, 3000);       
    });
});

function selectedFive(){
    scrollToLoading();

    $.post('/fifthQuery', { searchInput: searchInput }, resp => {

        console.log(resp);

        $("#years-rating").html(resp);
        $(".loading").hide();
    });
}

function scrollToLoading(){
    var offset = $(".loading").offset();

    offset.left -= 20;
    offset.top -= 20;

    $('html, body').animate({
        scrollTop: offset.top,
        scrollLeft: offset.left
    });
}

