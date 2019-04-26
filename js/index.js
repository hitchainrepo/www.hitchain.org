$(function () {
    $(".closeBtn").on("click", function () {
        $(".videoDialog").hide();
        $(".videoDialogMask").hide();
    });
    $(".videoBtn").on("click", function () {
        $(".videoDialog").show();
        $(".videoDialogMask").show();
    });
    $('#FAQ').find('li').bind('click', function () {
        $(this).addClass('current').find('article').slideDown().end().siblings('.current').removeClass('current').find('article').slideUp();
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
    /*
    $("#nav .lang ul li").on('click', function () {
        $("#nav .txt em").text($(this).text());
        $("#nav .txt").removeClass('change');
        $(this).parent().hide();
    });
*/
    var navHeight = $('#nav').height();
    var versionTop = $("#vision").offset().top;
    $("#home .home article img").addClass("vis_animate");
    $("#home .bigTitleFont").addClass("vis_animate");
    $("#home .smallTitleFont").addClass("vis_animate");
    $("#home .home article .groupBtn").addClass("vis_animate");

    $(document).scroll(function () {
        var c = null;
        $('#fullPage section').each(function () {
            if ($(document).scrollTop() - $(this).offset().top >= navHeight) {
                c = $(this).attr('id');
            } else {
                return false;
            }
        });
        //
        if (c) {
            $('nav').find('a[href$="' + c + '"]').addClass('current').siblings().removeClass('current');
        }
        //版本区块效果
        var docScrollTop = $(document).scrollTop();
        if (versionTop < docScrollTop + 200) {
            $("#vision h1").addClass("vis_animate");
            for (var i = 0; i < 4; i++) {
                $("#vision .current").addClass("vis_animate");

            }
        }
    });
    $('#nav a').bind('click', function () {
        if ($(this).is('.phoneMenu')) {
            $('nav').slideToggle();
        } else {
            if ($(this).is('.logo')) {
                $('html,body').animate({scrollTop: 0}, 300);
            } else {
                var $target = $(this).attr('href');
                var path = $(this).attr('href').replace(/^#/, '');

                var sct = $('#' + path).offset().top - 73;

                $('html,body').animate({scrollTop: sct}, 300);

            }
            if ($('.phoneMenu').is(':visible')) {
                $('nav').hide();
            }
        }
        return false;
    });

    //

    $(".submitBtn").on("click", function () {
        submitAjax();
    });
    var reg = /\w+[@]{1}\w+[.]\w+/;

    function submitAjax() {
        var emailTxt = $("#txt-email").val();
        if (emailTxt) {
            if (reg.test(emailTxt)) {
                $.ajax({
                    url: '/server/email.do?email=' + emailTxt,
                    type: 'get',
                    success: function (res) {
                        var res1 = JSON.parse(res);
                        if (res1.code === '0') {
                            alert("Save success");
                        } else {
                            alert("Save error");
                        }
                    }
                });
            } else {
                alert("Mailbox error")
            }

        } else {
            alert("Mailbox cannot be empty")
        }

    }

    //


    var userAgent = navigator.userAgent;
    var isSafari = userAgent.indexOf("Safari") > -1;
    //Chrome
    var isChrome = userAgent.indexOf("Chrome") > -1;
    //iPhone
    var isiPhone = userAgent.indexOf("iPhone") > -1;
    if (isSafari) {
        if (!isChrome && !isiPhone) {
            $("#home").css('height', $(window).height() + 'px');
            $("#home").addClass("safari")
        }
    }
    $(window).resize(function () {
        if (isSafari) {
            if (!isChrome && !isiPhone) {
                $("#home").css('height', $(window).height() + 'px');
            }
        }
    });
    //FAQ
});


