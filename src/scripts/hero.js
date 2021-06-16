/* eslint-disable strict */
$(function () {
    initHero();
});

var lastBounce = Date.now();


function initHero() {
    var $scrollContainer = $("#heroScrollContainer");
    var $hero = $("#hero");
    var $navbar = $("header.navbar");
    var imageFixed = false;

    //timer for bouncing scroll helper
    var timer = null;
    //flag for checking in the scroll handler
    var scrollHelperVisible = false;

    //start scroll helper timer
    function startTimer() {
        scrollHelperVisible = true;
        timer = setInterval(showScrollHelper, 5000);
    }

    //stop scroll helper
    function stopTimer() {
        showScrollHelper = false;
        if (timer)
            clearInterval(timer);
        hideScrollHelper();
    }

    //make the hero image fixed
    function fixHero() {
        console.log("FIX");
        imageFixed = true;
        $hero.addClass("fixed");


        $navbar.css("opacity", 1.0);
        // $navbar.css("pointer-events", "all");
    }

    //make the hero image scroll
    function unFixHero() {
        console.log("UNFIX");
        imageFixed = false;
        $hero.removeClass("fixed");
        $hero.css("background-position-y", 0);
    }

    //update the image based on the scroll 
    function updateImage(scrollContainer) {
        if (imageFixed) {
            if ($hero[0].clientHeight - $scrollContainer[0].clientHeight >= $scrollContainer[0].scrollTop) {
                //if we haven't scrolled to bottom of image
                unFixHero();
            }
        } else {
            if ($hero[0].clientHeight - $scrollContainer[0].clientHeight <= $scrollContainer[0].scrollTop) {
                //if we have scrolled to bottom of image
                fixHero();
                $hero.css("background-position-y", $scrollContainer[0].clientHeight - $hero[0].clientHeight);
            }

            $navbar.css("opacity", $scrollContainer[0].scrollTop / ($hero[0].clientHeight - $scrollContainer[0].clientHeight));
        }
    }


    //init the image based on window size
    if ($hero[0].clientHeight <= $scrollContainer[0].clientHeight) {
        //here the image is smaller than the window
        if (!imageFixed) {
            fixHero();
        }
        $hero.css("background-position-y", 0);
    }
    else {
        //image is larger than the window so don't fix it

        //scroll to center if url asks us to
        if (window.location.href.endsWith("#center")) {
            var scroll = $hero[0].clientHeight - $scrollContainer[0].clientHeight;
            $scrollContainer.scrollTop(scroll + 1);
        }
    }

    //do in timeout to get past the scrolling if url has #center
    setTimeout(function () {
        //start timer if necessary
        if ($scrollContainer[0].clientHeight - $hero[0].clientHeight <= 25)
            startTimer();
    }, 100);


    //watch for window resize
    $(window).resize(function () {
        if ($hero[0].clientHeight <= $scrollContainer[0].clientHeight) {
            //image smaller than window

            if (!imageFixed) {
                fixHero();
            }
            $hero.css("background-position-y", 0);

        } else {
            updateImage($scrollContainer[0]);
        }
    });

    $scrollContainer.scroll(function () {
        updateImage(this);
        console.log("scroll");

        if (scrollHelperVisible) {
            stopTimer();
        }
    });


}

function showScrollHelper() {
    var $scrollHelper = $(".heroScrollHelper");
    $scrollHelper.css("visibility", "visible");
    if (!document.hidden) {
        $scrollHelper.effect("bounce", { times: 3, distance: 50 }, 600);
    } else {
        console.log("Skipping bounce...")
    }
}

function hideScrollHelper() {
    $(".heroScrollHelper").css("visibility", "hidden");
}



function throttle(func, limit) {
    var lastFunc;
    var lastRan;
    return function () {
        var context = this;
        var args = arguments;

        if (!lastRan) {
            func.apply(context, args);
            lastRan = Date.now();
        } else {
            clearTimeout(lastFunc);
            lastFunc = setTimeout(function () {
                if ((Date.now() - lastRan) >= limit) {
                    func.apply(context, args);
                    lastRan = Date.now();
                }
            }, limit - (Date.now() - lastRan));
        }
    };
}