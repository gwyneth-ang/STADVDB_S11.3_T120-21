let searchInput;
let selectValue;

$(document).ready(function() {
    $(".loading").hide();

    $('#drop-box').on('change', function (e) {
        $("#search-box").prop( "disabled", false);
        //clear text box
        $("#search-box"). val("") 
        $("#search-box").attr("placeholder", "Search");

        selectValue = $("#drop-box").val();

        if (selectValue === '2') {
            // disable searchbar
            $("#search-box").prop( "disabled", true );;
        } else if (selectValue === '5') {
            $("#search-box").attr("placeholder", "Input a year");
        } else if (selectValue === '6' || selectValue === '7') {
            $("#search-box").attr("placeholder", "Input an actor/actress");
            // if (selectValue === '6')
            // $("#search-box").val('Fred Aster')
        }
    });

    $('#search-box').on('keyup', function (e) {
        if (e.key === "Enter") {
            $("#searchBtn").click();
        }  
    }),

    $('#searchBtn').on('click', function (e) {
        selectValue = $("#drop-box").val();
        searchInput = $("#search-box").val();

        hideAll();

        if (selectValue === '2') {
            $(".loading").show();
            selectedTwo();
        } else if (selectValue === '5') {
            $(".loading").show();
            selectedFive();
        } else if (selectValue === '6') {
            $(".loading").show();
            selectedSix();
        }
    });

});

function hideAll(){
    $("#years-rating").hide();
    $("#universally-acclaimed").hide();
    $("#character-job-actor").hide();
    //TODO: add others
}

function selectedTwo(){
    scrollToLoading();
    $.post('/secondQuery', resp => {
        // console.log(resp);
        $("#universally-acclaimed").html(resp);
        $("#universally-acclaimed").show();
        $(".loading").hide();
        window.location.href='#universally-acclaimed';
    });
}

function selectedFive(){
    scrollToLoading();
    $.post('/fifthQuery', { searchInput: searchInput }, resp => {
        // console.log(resp);
        $("#years-rating").html(resp);
        $("#years-rating").show();
        //in case none found
        $("#none-found").show();
        $(".loading").hide();
        window.location.href='#years-rating';
    });
}

function selectedSix(){
    scrollToLoading();
    $.post('/sixthQuery', { searchInput: searchInput }, resp => {
        // console.log(resp);
        $("#character-job-actor").html(resp);
        $("#character-job-actor").show();
        //in case none found
        $("#none-found").show();
        $(".loading").hide();
        window.location.href='#character-job-actor';
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