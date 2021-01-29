let searchInput;
let selectValue;
let pagination;
let pageNum;
let pageStart;
let pageEnd;
const itemsPerPage = 100;

$(document).ready(function() {
    $(".loading").hide();
    $("#search-box-2").hide();
    hideAll();

    $('#drop-box').on('change', function(e) {
        $("#search-box").prop("disabled", false);
        //clear text box
        $("#search-box").val("")
        $("#search-box").attr("placeholder", "Search");
        $("#search-box").css("cursor", "default");

        //for actor names datalist
        $("#search-box").removeAttr("list");

        selectValue = $("#drop-box").val();

        if (selectValue === '3') {
            $("#search-box-2").show();
            $("#search-box").attr("placeholder", "Input a country");
            $("#search-box-2").attr("placeholder", "Input a genre");
        } 

        // if (selectValue === '1' || selectValue === '2' || selectValue == '3') {
        //     $("#search-box").prop("disabled", true);
        //     $("#search-box").attr("placeholder", "Search Disabled");
        //     $("#search-box").css("cursor", "not-allowed");
        // } else if (selectValue === '4' || selectValue === '7') {
        //     $("#search-box").attr("placeholder", "Input an actor/actress");
        //     //add datalist for actor names
        //     showActorsDatalist();
        //     $("#search-box").attr("list", "actors-name-list");
        // } else if (selectValue === '5') {
        //     $("#search-box").attr("placeholder", "Input a year");
        // } else if (selectValue === '6') {
        //     $("#search-box").attr("placeholder", "Input a name");
        // }
    });

    $('#search-box').on('keyup', function(e) {
            if (e.key === "Enter") {
                $("#searchBtn").click();
            }
        }),

        $('#searchBtn').on('click', function(e) {
            selectValue = $("#drop-box").val();
            searchInput = $("#search-box").val();

            hideAll();
            $(".loading").show();
            if (selectValue === '1') {
                selectedOne();
            } else if (selectValue === '2') {
                selectedTwo();
            } else if (selectValue === '3') {
                selectedThree();
            } else if (selectValue === '4') {
                selectedFour();
            } else {
                $(".loading").hide();
            }
        });

    // for actor names datalist
    $("#search-box").on('keyup change', function() {
        let selectedValue = $("#drop-box").val();
        // if (selectedValue === '4' || selectedValue === '7') {
        //     showActorsDatalist();
        // }
    });
});

function hideAll() {
    removePagination();
    $("#english-movies").hide();
    $("#years-rating").hide();
    $("#production-companies").hide();
    $("#actor-films").hide();
    $("#universally-acclaimed").hide();
    $("#character-job-actor").hide();
    $("#best-year").hide();

    $("dice-results").hide();
}

function selectedOne() {
    scrollToLoading();
    // $.post('/firstQuery', { page: 1 }, resp => {
    //     $("#english-movies").html(resp.partial);
    //     $("#english-movies").show();

    //     pagination = Math.ceil(resp.totalCount / itemsPerPage);
    //     pageNum = 1;
    //     pageStart = 1;
    //     pageEnd = pagination > 5 ? 5 : pagination;

    //     removePagination();
    //     if (resp.totalCount > itemsPerPage)
    //         setUpPagination(pagination, pageStart, pageEnd, pageNum);

    //     $(".loading").hide();
    //     window.location.href = '#english-movies';
    // });
}

function selectedTwo() {
    scrollToLoading();
    // $.post('/secondQuery', resp => {
    //     $("#universally-acclaimed").html(resp);
    //     $("#universally-acclaimed").show();
    //     $(".loading").hide();
    //     window.location.href = '#universally-acclaimed';
    // });
}

function selectedThree() {
    scrollToLoading();
    let secondSearchInput = $("#search-box-2").val().trim();

    $.post('/diceQuery', {countryInput: searchInput, genreInput: secondSearchInput}, resp => {
        $("#dice-results").html(resp);
        $("#dice-results").show();
        $(".loading").hide();
        $("#none-found").show();
        window.location.href = '#dice-results';
    });
}

function selectedFour() {
    scrollToLoading();
    // $.post('/fourthQuery', { searchInput: searchInput }, resp => {
    //     $("#actor-films").html(resp);
    //     $("#actor-films").show();
    //     $(".loading").hide();
    //     $("#none-found").show();
    //     window.location.href = '#actor-films';
    // });
}

function showActorsDatalist() {
    let searchInput = $("#search-box").val();
    $.post('/actorNamesQuery', { searchInput: searchInput }, resp => {
        $("#actors-datalist").html(resp);
        $("#actors-datalist").show();
    });
}

function scrollToLoading() {
    var offset = $(".loading").offset();
    offset.left -= 20;
    offset.top -= 20;
    $('html, body').animate({
        scrollTop: offset.top,
        scrollLeft: offset.left
    });
}

//CREDITS TO THE GROUPMATE IN STSWENG AND CCPADEV WHO MADE THE PAGINATION
function removePagination() {
    $('#pagination-all .page-item').remove();
}

function setUpPagination(pagination, pageStart, pageEnd, pageNum) {
    $('#pagination-all').append(`
        <li class="page-item">
        <a class="page-link" id="prevPage">
            Prev
        </a>
        </li>
   `);

    for (var i = pageStart; i <= pageEnd; i++) {
        $('#pagination-all').append(
            '<li class="page-item' + ((i == pageNum) ? ' active' : '') + '">' +
            '<a class="page-link page-number">' +
            i +
            '</a>' +
            '</li>'
        );
    }

    $('#pagination-all').append(`
        <li class="page-item">
        <a class="page-link"id="nextPage">
            Next
        </a>
        </li>
    `);

    $('#pagination-all .page-link').click(function() {
        searchInput = $("#search-box").val();
        selectValue = $("#drop-box").val();

        var offset = 0;

        if ($(this).attr('id') == 'nextPage')
            offset = 1;
        else if ($(this).attr('id') == 'prevPage')
            offset = -1;
        else if (pagination == 1)
            offset = 0;
        else
            offset = $(this).text() - pageNum;

        var maxPageShiftR = pagination - pageEnd;
        var maxPageShiftL = pageStart - 1;

        if (pageNum + offset >= 1 && pageNum + offset <= pagination && offset != 0) {
            $(".loading").show();
            $("#character-job-actor").hide();
            $("#english-movies").hide();

            if (selectValue === '6') {
                $.post('/sixthQuery', { searchInput: searchInput, page: pageNum + offset }, resp => {
                    if (pageNum + offset >= 1 && pageNum + offset <= pagination) {

                        if (offset > 0 && offset <= maxPageShiftR && pageNum + offset > (pageStart + pageEnd) / 2 ||
                            offset < 0 && -1 * offset <= maxPageShiftL && pageNum + offset < (pageStart + pageEnd) / 2) {
                            pageStart += offset;
                            pageEnd += offset;
                        } else if (offset > 0 && offset > maxPageShiftR) {
                            pageStart += maxPageShiftR;
                            pageEnd += maxPageShiftR;
                        } else if (offset < 0 && -1 * offset > maxPageShiftL) {
                            pageStart -= maxPageShiftL;
                            pageEnd -= maxPageShiftL;
                        }

                    }
                    pageNum += offset;

                    $("#character-job-actor").html(resp.partial);
                    $("#character-job-actor").show();

                    updatePagination(pageStart, pageNum);
                    
                    $("#none-found").show();
                    $(".loading").hide();
                    window.location.href = '#character-job-actor';
                });
            } else if (selectValue === '1') {
                $.post('/firstQuery', { page: pageNum + offset }, resp => {
                    if (pageNum + offset >= 1 && pageNum + offset <= pagination) {

                        if (offset > 0 && offset <= maxPageShiftR && pageNum + offset > (pageStart + pageEnd) / 2 ||
                            offset < 0 && -1 * offset <= maxPageShiftL && pageNum + offset < (pageStart + pageEnd) / 2) {
                            pageStart += offset;
                            pageEnd += offset;
                        } else if (offset > 0 && offset > maxPageShiftR) {
                            pageStart += maxPageShiftR;
                            pageEnd += maxPageShiftR;
                        } else if (offset < 0 && -1 * offset > maxPageShiftL) {
                            pageStart -= maxPageShiftL;
                            pageEnd -= maxPageShiftL;
                        }

                    }
                    pageNum += offset;

                    $("#english-movies").html(resp.partial);
                    $("#english-movies").show();

                    updatePagination(pageStart, pageNum);

                    $(".loading").hide();
                    window.location.href = '#english-movies';
                });
            }
        }
    });
}

function updatePagination(pageStart, pageNum) {
    $('#pagination-all .page-number').each(function(index, element) {
        $(element).text(pageStart + index);
        if ($(element).text() != pageNum)
            $(element).parent().removeClass('active');
        else
            $(element).parent().addClass('active');
    })
}