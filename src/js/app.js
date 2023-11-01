
$(function() {
    $("#button-addon").on('click', function() {
        $(".in-container").hide();
        $(".items-container").hide();
        $(".bigItem-container").show();
    });

    $("#home").on('click', function() {
        console.log("home");
        $(".in-container").show();
        $(".items-container").show();
        $(".bigItem-container").hide();
    });
    $(".dark-mode-button").on('click', function() {
        $("body").toggleClass("dark-mode");
        
    });
    
});


