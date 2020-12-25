$(document).ready(function() {
    $('#drop-box').on('click', function (e) {
        let selectValue = $("#drop-box").val();
        let searchInput = $("#search-box").val();
    
        console.log(searchInput);
        console.log(searchInput);
    
        if (selectValue === '5') {
            $.post('/fifthQuery', { searchInput: searchInput }, resp => {
                console.log("Performed");
            });
        }
    });
});

