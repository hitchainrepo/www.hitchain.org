$(function () {
    $('#FAQ').find('li').bind('click', function () {
        $(this).addClass('current').find('article').slideDown().end().siblings('.current').removeClass('current').find('article').slideUp();
    });


    $('#nav a').bind('click', function () {
        if ($(this).is('.phoneMenu')) {
            $('nav').slideToggle();
        }
    });

    $(".lang ul li").on('click', function () {
        $("#nav .txt em").text($(this).text());
        $("#nav .txt").removeClass('change');
        $(this).parent().hide();
    });

    $("#nav .txt").on('click', function () {
        if ($(this).attr('class').indexOf('change') > -1) {
            $(this).next().hide();
            $(this).removeClass('change');
        } else {
            $(this).next().show();
            $(this).addClass('change');
        }
    });

    var userAgent = navigator.userAgent;
    var isSafari = userAgent.indexOf("Safari") > -1;
    //Chrome
    var isChrome = userAgent.indexOf("Chrome") > -1;
    //iPhone
    var isiPhone = userAgent.indexOf("iPhone") > -1;
    if (isSafari) {
        if (!isChrome && !isiPhone) {
            $("#FAQ").css('height', $(window).height() + 'px');
            $("#FAQ").addClass("safari")
        }
    }
    $(window).resize(function () {
        if (isSafari) {
            if (!isChrome && !isiPhone) {
                $("#FAQ").css('height', $(window).height() + 'px');
            }
        }
    });

});


