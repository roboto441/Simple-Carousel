canMove = true;
function simpleCarousel(params) {
    if(!params['container']) {params['container'] = '.slider'; }
    if(!params['animation']) {params['animation'] = ''; }
    if(!params['animationType']) {params['animationType'] = 'slide'; }
    if(!params['duration']) {params['duration'] = 400; }
    if(!params['width']) {params['width'] = '100%'; }
    if(!params['timer']) {params['timer'] = 3000; }
    if(!params['customBtn']) {params['customBtn'] = false; }
    if(!params['dots']) {params['dots'] = false; }
    if(!params['customDots']) {params['customDots'] = false; }
    if(!params['touchSensibility']) {params['touchSensibility'] = .03; }
    
    /* check if there is a container */
    if (!$(params['container']).length) { return; }
    
    /* CSS rules */
    loadCss(params['container'], params['customBtn'], params['customDots'],params['animationType']);
    $(params['container']).css('width', params['width']);
    
    /* Get higher image */
    nbImg = $(params['container']).children('img').length;
    
    hMax = 0;
    for(i=0; i<nbImg; i++) {
        var img = $(params['container'] + ' img:nth-child('+ (i+1) +')')[0];
        img.onload = function() {
            h = $(this).height();
            if(h > hMax) { hMax = h; }            
            if(i == nbImg-1) { $(params['container']).css('height', hMax + 'px'); } 
        }
    }
    
     
    /* HTML */
    var dots;
    if(params['dots']) {
        dots = '<div class="dots"><span class="selected"></span>';
        for(i=0; i<nbImg-1; i++) {
            dots = dots + '<span></span>';
        }
        dots = dots + '</div>';
    }
    $(params['container']).append('<div id="last"></div><div id="current"></div><div id="next"></div><span class="left-btn slider-btn">&lt;</span><span class="right-btn slider-btn">></span>'+ dots);
    
    /* Code */
        /* Init */
        currentImg = 1; 
        $(params['container'] + ' img:nth-child(1)').clone().appendTo('#current');
    
        /* Events */
            /* RIGHT */
            $(params['container'] + ' .right-btn').on('click', right);
            function right() {
                if (canMove == false) { return; }
                canMove = false;
                
                clearInterval(timer);
                if (params['animationType'] == 'slide') { rightSlide(params); } else if (params['animationType'] == 'fade') { fade(params, 'next'); }
                updateDots(params, nbImg, currentImg);
            }

            /* LEFT */
            $(params['container'] + ' .left-btn').on('click', left);   
            function left() {
                if (canMove == false) { return; }
                canMove = false;
                
                clearInterval(timer);
                if (params['animationType'] == 'slide') { leftSlide(params); } else if (params['animationType'] == 'fade') { fade(params, 'last'); }
                updateDots(params, nbImg, currentImg);
            }
    
            /* DOT CLICK */
            $(params['container'] + ' .dots span').on('click',function() {
                if (canMove == false) { return; }
                canMove = false;
                
                if($(this).attr('class') != 'selected') {
                    clearInterval(timer);
                    imgId = $(this).index();
                    lastImg = currentImg;
                    currentImg = imgId + 1;
                    updateDots(params, nbImg, currentImg);
                    if(params['animationType'] == 'slide') {
                        if(currentImg > lastImg) { rightSlide(params, currentImg); } else { leftSlide(params, currentImg); }
                    }
                    else if(params['animationType'] == 'fade') {
                        fade(params, '', currentImg);
                    }
                }
            });
            
            /* LOOP */
            function loop() {
                if (canMove == false) { return; }
                canMove = false;
                
                if (params['animationType'] == 'slide') { rightSlide(params); } else if (params['animationType'] == 'fade') { fade(params, 'next'); }
                updateDots(params, nbImg, currentImg);
                
            }
            var timer = window.setInterval(loop, params['timer']);
    
            /* TOUCH EVENT */
            $(params['container'])[0].addEventListener('touchstart', function(e) {
                e.preventDefault();
                clearInterval(timer);
                startX = e.changedTouches[0].screenX;
            }, false);

            $(params['container'])[0].addEventListener('touchend', function(e) {
                e.preventDefault();
                endX = e.changedTouches[0].screenX;                
                swipe(startX, endX, params, timer);
            }, false);
    
            $(params['container'] + ' .right-btn')[0].addEventListener('touchstart', right);
            $(params['container'] + ' .left-btn')[0].addEventListener('touchstart', left);
}

function fade(params, direction, imgId) {
    if(typeof(direction) !== 'undefined' && direction == 'next') { currentImg++; } else { currentImg--; }
    if(typeof(imgId) !=='undefined') { currentImg = imgId; }
    if (currentImg == nbImg + 1) { currentImg = 1;}
    if (currentImg == 0) { currentImg = nbImg;}
    cleanUpAll(params);
    
    $(params['container'] + ' #next').css({"opacity": '0'}); 
    $(params['container'] + ' #current').animate({"opacity": '1'}, 0); 
    $(params['container'] + ' img:nth-child('+ currentImg +')').clone().prependTo(params['container'] + ' #next');
    cleanUp(params);
    $(params['container'] + ' #next').animate({"opacity": '1'}, params['duration']); 
    $(params['container'] + ' #current').animate({"opacity": '0'}, params['duration']); 
    
    setTimeout(function () {
        $(params['container'] + ' img:nth-child('+ currentImg +')').clone().prependTo(params['container'] + ' #current');
        $(params['container'] + ' #current').animate({"opacity": '1'}, 0); 
        cleanUp(params);
        cleanUpAll(params);
        canMove = true;
    }, params['duration']);
        
}

function rightSlide(params, imgId) {
    currentImg++;
    if(typeof(imgId) !=='undefined') { currentImg = imgId; }
    if (currentImg == nbImg + 1) { currentImg = 1;}
    
    $(params['container'] + ' img:nth-child('+ currentImg +')').clone().prependTo(params['container'] + ' #next');
    cleanUp(params);
    $(params['container'] + ' #current,' + params['container'] +  ' #next').animate({"left": '-=100%'}, params['duration'], params['animation']);
    
    setTimeout(function () {
        $(params['container'] + ' img:nth-child('+ currentImg +')').clone().prependTo(params['container'] + ' #current');
        $(params['container'] + ' #current,' + params['container'] +  ' #next').animate({"left": '+=100%'}, 0);
        
        cleanUp(params);
        canMove = true;
    }, params['duration']);            
}
    
function leftSlide(params, imgId) {
    currentImg--;
    if(typeof(imgId) !=='undefined') { currentImg = imgId;}    
    if (currentImg == 0) { currentImg = nbImg;}
    
    $(params['container'] + ' img:nth-child('+ currentImg +')').clone().prependTo(params['container'] + ' #last');
    cleanUp(params);
    $(params['container'] + ' #current,' + params['container'] +  ' #last').animate({"left": '+=100%'}, params['duration'], params['animation']);
    
    setTimeout(function () {
        $(params['container'] + ' img:nth-child('+ currentImg +')').clone().prependTo(params['container'] + ' #current');
        $(params['container'] + ' #current,' + params['container'] +  ' #last').animate({"left": '-=100%'}, 0);                
                
        cleanUp(params);
        canMove = true;
    }, params['duration']);  
}

function cleanUp(params) {
    $(params['container'] + " #last *:not('img:nth-child(1)')").remove();
    $(params['container'] + " #current *:not('img:nth-child(1)')").remove();
    $(params['container'] + " #next *:not('img:nth-child(1)')").remove();
}

function cleanUpAll(params) {
    $(params['container'] + " #last").empty();
    $(params['container'] + " #next").empty();
}

function loadCss(container, customBtn, customDots, animationType) {    
    var buttons = '';
    if (!customBtn) { buttons = container + ' .slider-btn { background-color: #E5E5E5; width: 30px; height: 30px;	position: absolute;	bottom: 5px; z-index: 1; color: #838383; text-align: center; line-height: 30px; font-size: 20px; cursor: pointer; transition: 0.4s; }' + container + ' .slider-btn:hover { background-color: #838383; color: #FFF; } ' + container + ' .left-btn { right: 40px; }' + container + ' .right-btn { right: 5px; }'; }
    
    var dots = '';
    if( !customDots) { dots = container + ' .dots { position: absolute; bottom: 0; text-align: center; width: 100%; } ' + container + ' .dots span { position: relative; display: inline-block; width: 7px; height: 7px; border-radius: 50%; border: 2px solid #E5E5E5; margin: 0 3px 0 3px; background-color: transparent; box-shadow: 0 0 5px #555555; cursor: pointer; transition: .2s } ' + container + ' .dots span.selected { background-color: #E5E5E5; }' + container + ' .dots span:not(.selected):hover { background-color: #E5E5E5; }'; }
    
    var fade = '';
    if(animationType == 'fade') { fade = container + ' #next { left: 0; }' }
    
    $('head').append('<style>' + container + ' { box-sizing: content-box; background-color: #000000; overflow: hidden; position: relative; -webkit-touch-callout: none; -webkit-user-select: none; -khtml-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none;}' + container + ' img { display: none; width: 100%; } '  + container + ' #last,' + container + ' #current,' + container + ' #next { height: 100%; width: 100%; position: absolute; top: 0; }' + container + ' #last img,' + container + ' #current img,' + container + ' #next img { display: block; position: relative; top: 50%; transform: translateY(-50%);  -webkit-transform: translateY(-50%); }' + container + ' #last { left: -100% }' + container + ' #current { left: 0 }' + container + ' #next { left: 100% }' + buttons + dots + fade + '</style>');
}

function updateDots(params, nbImg, currentImg) {
    $(params['container'] + ' .dots .selected').removeClass('selected');
    $(params['container'] + ' .dots span:nth-child(' + currentImg + ')').addClass('selected');
}

function swipe(startX, endX, params) {
    percent = (startX-endX)/screen.width;
    if(Math.abs(percent) >= params['touchSensibility']) {
        if(percent < 0) {
            if (params['animationType'] == 'slide') { leftSlide(params); } else if (params['animationType'] == 'fade') { fade(params, 'last'); }
            updateDots(params, nbImg, currentImg);
        }
        else {
            if (params['animationType'] == 'slide') { rightSlide(params); } else if (params['animationType'] == 'fade') { fade(params, 'next'); }
            updateDots(params, nbImg, currentImg);
        }
    }
}