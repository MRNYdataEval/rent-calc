# Interaction Flags
$ = jQuery;

window.lt_ie9 = $('html').hasClass('lt-ie9') ? true : false
window.isMobile = (/iphone|ipad|ipod|android|blackberry|mini|windows\sce|palm/i.test(navigator.userAgent.toLowerCase()))
window.isIOS    = (/iphone|ipad|ipod/i.test(navigator.userAgent.toLowerCase()))

$body = $('body')



$.fn.initCalc = -> 

  @each ->


    baseRent = $("#rent").val()
    expDate = $("#exp-month").val() + "/01/" + $("#exp-year").val()

    prevRate1yr = 0
    prevRate2yr = 0

    rateChangeDate = "10/01/2022"
    newRate1yr = 3.25
    newRate2yr = 5 
    new1yrRent = (baseRent/100 * newRate1yr) + baseRent
    new2yrRent = (baseRent/100 * newRate2yr) + baseRent



    e.preventDefault()

    

$('#rent-calculator').initCalc()



