$(document).ready(function() {
    /* How to use */
    /* This are the default values  */
    
    simpleCarousel({
        container: '.slider',       /* Container */
        animationType: 'slide',     /* Animation Type, can also be set to fade */
        animation: 'easeInOutCirc', /* If you want to use easing functions, import the library and set the one you want */
        duration: 400,              /* Duration of the animation */
        timer: 3000,                /* Time between 2 automatic slides, if you don't want automatic animations set it to 0 */
        width: '100%',              /* Width */
        customBtn: false,           /* Choose if you want to style the buttons yourself */
        dots: false,                /* If you want dots set it to true */
        customDots: false           /* Choose if you want to style the dots yourself */
    });
});