let searchInput;
let selectValue;
let pagination;
let pageNum;
let pageStart;
let pageEnd;
const itemsPerPage = 100;

$(document).ready(function() {
    $(".loading").hide();

    $('#drop-box').on('change', function(e) {
        $("#search-box").prop("disabled", false);
        //clear text box
        $("#search-box").val("")
        $("#search-box").attr("placeholder", "Search");

        selectValue = $("#drop-box").val();
        if (selectValue === '1') {
            $("#search-box").prop("disabled", true);
        } else if (selectValue === '2') {
            // disable searchbar
            $("#search-box").prop("disabled", true);
        } else if (selectValue == '3') {
            // disable searchbar
            $("#search-box").prop("disabled", true);
        } else if (selectValue === '4') {
            $("#search-box").attr("placeholder", "Input an actor/actress");
        } else if (selectValue === '5') {
            $("#search-box").attr("placeholder", "Input a year");
        } else if (selectValue === '6' || selectValue === '7') {
            $("#search-box").attr("placeholder", "Input an actor/actress");
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

            hideAll();
            if (selectValue === '1') {
                $(".loading").show();
                selectedOne();
            } else if (selectValue === '2') {
                $(".loading").show();
                selectedTwo();
            } else if (selectValue === '3') {
                $(".loading").show();
                selectedThree();
            } else if (selectValue === '4') {
                $(".loading").show();
                selectedFour();
            } else if (selectValue === '5') {
                $(".loading").show();
                selectedFive();
            } else if (selectValue === '6') {
                $(".loading").show();
                selectedSix();
            } else if (selectValue === '7') {
                $(".loading").show();
                selectedSeventh();
            }
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
    $("#best_year").hide();
}

function selectedOne() {
    scrollToLoading();
    $.post('/firstQuery', resp => {
        $("#english-movies").html(resp);
        $("#english-movies").show();
        $(".loading").hide();
        window.location.href = '#english-movies';
    });
}

function selectedTwo() {
    scrollToLoading();
    $.post('/secondQuery', resp => {
        // console.log(resp);
        $("#universally-acclaimed").html(resp);
        $("#universally-acclaimed").show();
        $(".loading").hide();
        window.location.href = '#universally-acclaimed';
    });
}

function selectedThree() {
    scrollToLoading();
    $.post('/thirdQuery', resp => {
        // console.log(resp);
        $("#production-companies").html(resp);
        $("#production-companies").show();

        $(".loading").hide();
        window.location.href = '#production-companies-and-films';
    });
}

function selectedFour() {
    scrollToLoading();
    $.post('/fourthQuery', { searchInput: searchInput }, resp => {
        // console.log(resp);
        $("#actor-films").html(resp);
        $("#actor-films").show();

        $(".loading").hide();
        window.location.href = '#actor-films';
    });
}

function selectedFive() {
    scrollToLoading();
    $.post('/fifthQuery', { searchInput: searchInput }, resp => {
        // console.log(resp);
        $("#years-rating").html(resp);
        $("#years-rating").show();
        //in case none found
        $("#none-found").show();
        $(".loading").hide();
        window.location.href = '#years-rating';
    });
}

function selectedSix() {
    scrollToLoading();
    $.post('/sixthQuery', { searchInput: searchInput, page: 1 }, resp => {
        // console.log(resp);
        $("#character-job-actor").html(resp.partial);
        $("#character-job-actor").show();

        pagination = Math.ceil(resp.totalCount / itemsPerPage);
        pageNum = 1;
        pageStart = 1;
        pageEnd = pagination > 5 ? 5 : pagination;

        removePagination();
        if (resp.totalCount > itemsPerPage)
            setUpPagination(pagination, pageStart, pageEnd, pageNum);

        //in case none found
        $("#none-found").show();
        $(".loading").hide();
        window.location.href = '#character-job-actor';
    });
}

function selectedSeventh() {
    scrollToLoading();
    $.post('/seventhquery', { searchInput: searchInput }, resp => {
        $("#best-year").html(resp);
        $("#best-year").show();
        //in case none found
        $("#none-found").show();
        $(".loading").hide();
        window.location.href = '#best-year';
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
    $('#pagination-char-job-actor .page-item').remove();
}

function setUpPagination(pagination, pageStart, pageEnd, pageNum) {
    $('#pagination-char-job-actor').append(`
        <li class="page-item">
        <a class="page-link" id="prevPage">
            Prev
        </a>
        </li>
   `);

    for (var i = pageStart; i <= pageEnd; i++) {
        $('#pagination-char-job-actor').append(
            '<li class="page-item' + ((i == pageNum) ? ' active' : '') + '">' +
            '<a class="page-link page-number">' +
            i +
            '</a>' +
            '</li>'
        );
    }

    $('#pagination-char-job-actor').append(`
        <li class="page-item">
        <a class="page-link"id="nextPage">
            Next
        </a>
        </li>
    `);

    $('#pagination-char-job-actor .page-link').click(function() {
        searchInput = $("#search-box").val();
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

                //TODO: changed
                $("#character-job-actor").html(resp.partial);
                $("#character-job-actor").show();

                updatePagination(pageStart, pageNum)

                //in case none found
                $("#none-found").show();
                $(".loading").hide();
                window.location.href = '#character-job-actor';
            });
        }
    });
}

function updatePagination(pageStart, pageNum) {
    $('#pagination-char-job-actor .page-number').each(function(index, element) {
        $(element).text(pageStart + index);
        if ($(element).text() != pageNum)
            $(element).parent().removeClass('active');
        else
            $(element).parent().addClass('active');
    })
}