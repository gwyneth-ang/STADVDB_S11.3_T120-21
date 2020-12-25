let searchInput;
let selectValue;

$(document).ready(function() {
    $(".loading-rating").hide();

    $('#drop-box').on('change', function (e) {
        selectValue = $("#drop-box").val();
        searchInput = $("#search-box").val();
    
        console.log(searchInput);
    
        if (selectValue === '5') {
            selectedFive();
        }
    });

    $('#search-box').on('keyup', function (e) {
        selectValue = $("#drop-box").val();
        searchInput = $("#search-box").val();
        
        if (selectValue === '5') {
            $(".loading-rating").show();
            selectedFive();
        }
        else {
            console.log('nothing is selected');
        }
    })
});

function selectedFive(){
    $.post('/fifthQuery', { searchInput: searchInput }, resp => {
        console.log(resp);
        $("#years-rating").html(resp);
        $(".loading-rating").hide();
    });
}

