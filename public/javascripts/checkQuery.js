let searchInput, secondSearchInput;
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

        // hide second search
        $("#search-box-2").hide();
        $("#search-box").removeClass("col-5");

        // clear text box
        $("#search-box").val("")
        $("#search-box").attr("placeholder", "Search");
        $("#search-box").css("cursor", "default");

        // for country and genre datalist
        $("#search-box").removeAttr("list");
        $("#search-box-2").removeAttr("list");

        selectValue = $("#drop-box").val();
        if (selectValue === '1'){
            $("#search-box").attr("placeholder", "Input year");
        } else if (selectValue === '3') {
            // show second search box
            $("#search-box-2").show();
            $("#search-box").addClass("col-5");

            $("#search-box").attr("placeholder", "Input a country");
            $("#search-box-2").attr("placeholder", "Input a genre");

            showContriesDatalist();
            showGenreDatalist();

            $("#search-box").attr("list", "country-list");
            $("#search-box-2").attr("list", "genre-list");
        } else if (selectValue === '4') {
            $("#search-box").attr("placeholder", "Input a country");

            showContriesDatalist();
            $("#search-box").attr("list", "country-list");
        }
    });

    $('#search-box').on('keyup', function(e) {
            if (e.key === "Enter") {
                $("#searchBtn").click();
            }
        }),

        $('#searchBtn').on('click', function(e) {
            selectValue = $("#drop-box").val();
            searchInput = $("#search-box").val();
            secondSearchInput = $("#search-box-2").val();

            hideAll();
            $(".loading").show();
            $("#none-found").hide();
            $("#error-found").hide();

            if (selectValue === '1') {
                let isEmptySearchInput = (searchInput.trim() === "") ? true: false;
                if (isEmptySearchInput) {
                    alert("Please input a year");
                    $(".loading").hide();
                }
                else {
                    selectedOne();
                }
            } else if (selectValue === '2') {
                selectedTwo();
            } else if (selectValue === '3') {
                let isEmptySearchInput = (searchInput.trim() === "") ? true: false;
                let isEmptySecSearchInput = (secondSearchInput.trim() === "") ? true: false;

                if (isEmptySearchInput) {
                    alert("Please input a country");
                    $(".loading").hide();
                } else if (isEmptySecSearchInput) {
                    alert("Please input a genre");
                    $(".loading").hide();
                } else {
                    selectedThree();
                }
            } else if (selectValue === '4') {
                let isEmptySearchInput = (searchInput.trim() === "") ? true: false;
                if (isEmptySearchInput) {
                    alert("Please input a country");
                    $(".loading").hide();
                }
                else {
                    selectedFour();
                }
            } else {
                $(".loading").hide();
            }
        });

    // // for actor names datalist
    // $("#search-box").on('keyup change', function() {
    //     let selectedValue = $("#drop-box").val();
    //     // if (selectedValue === '4' || selectedValue === '7') {
    //     //     showActorsDatalist();
    //     // }
    // });
});

function hideAll() {
    removePagination();
    $("#roll-up-results").hide();
    $("#dice-results").hide();
    $("#slice-results").hide();
}

function selectedOne() {
    scrollTo(".loading");
    $.post('/rollUpQuery', resp => {
        $("#roll-up-results").html(resp);
        $("#roll-up-results").show();
        $(".loading").hide();
        $("#none-found").show();
        $("#error-found").show();
        scrollTo("#roll-up-results");
    });
}

function selectedTwo() {
    // scrollTo(".loading");
    // $.post('/secondQuery', resp => {
    //     $("#universally-acclaimed").html(resp);
    //     $("#universally-acclaimed").show();
    //     $(".loading").hide();
    //     $("#none-found").show();
    //     $("#error-found").show();
    //     scrollTo("#universally-acclaimed");
    // });
}

function selectedThree() {
    scrollTo(".loading");
    $.post('/diceQuery', { countryInput: searchInput, genreInput: secondSearchInput }, resp => {
        $("#dice-results").html(resp);
        $("#dice-results").show();
        $(".loading").hide();
        $("#none-found").show();
        $("#error-found").show();
        scrollTo("#dice-results");
    });
}

function selectedFour() {
    scrollTo(".loading");
    $.post('/sliceQuery', { searchInput: searchInput }, resp => {
        $("#slice-results").html(resp);
        $("#slice-results").show();
        $(".loading").hide();
        $("#none-found").show();
        $("#error-found").show();
        scrollTo("#slice-results");
    });
}

function showContriesDatalist() {
    $.post('/countriesQuery', {} , resp => {
        $("#country-datalist").html(resp);
        $("#country-datalist").show();
    });
}

function showGenreDatalist() {
    $.post('/genreQuery', {} , resp => {
        $("#genre-datalist").html(resp);
        $("#genre-datalist").show();
    });
}

function scrollTo(resultID) {
    var offset = $(`${resultID}`).offset();
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