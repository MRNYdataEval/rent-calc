(function() {
  var $, $body, ref;

  $ = jQuery;

  window.lt_ie9 = (ref = $('html').hasClass('lt-ie9')) != null ? ref : {
    "true": false
  };

  window.isMobile = /iphone|ipad|ipod|android|blackberry|mini|windows\sce|palm/i.test(navigator.userAgent.toLowerCase());

  window.isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent.toLowerCase());

  $body = $('body');

  $.fn.initCalc = function() {
 
    var outputStrings = {
      "ES" : {
        "title" : "Calculadora de renta mensual anticipada",
        "subtitle" : "para apartamentos de renta regulada",
        "calc-label-rent" : "Renta actual",
        "calc-label-exp"  : "Fecha de vencimiento de su contrato de arrendamiento actual (MM/YYYY)",
        "1yrlease" : "Si Ud. renueva su contrato de arrendamiento por un a&ntilde;o, su rente sera",
        "2yrlease" : "Si Ud. renueva su contrato de arrendamiento por dos a&ntilde;os, su rente sera",
        "first6" : "Primeros seis meses",
        "next6" : "Siguientes seis meses",
        "same" : "(sin cambio)",
        "p/m" : " por mes",
        "inc" : "% de aumento",
        "rentmissing" : "Favor de llenar su renta actual en el formulario.",
        "toosoon" : "Todavia no sabemos cuanto seran los aumentos para los contratos de arrendamiento que comienzan despeus de 30 de septiembre. Favor de consular esta <a href='https://rentguidelinesboard.cityofnewyork.us/'>pagina web</a> o llenar este formulario para mantenerse informado."
      }, 
      "EN" : {
        "title" : "Future Monthly Rent Calculator",
        "subtitle" : "For Rent Stabilized Apartments",
        "calc-label-rent" : "Current Rent",
        "calc-label-exp"  : "Current Lease Expiration Date (MM/YYYY)",
        "1yrlease" : "If you renew your lease for ONE YEAR, your monthly rent will be ",
        "2yrlease" : "If you renew your lease for TWO YEARS, your monthly rent will be ",
        "first6" : "First six months",
        "next6" : "Next six months",
        "same" : "(No increase)",
        "p/m" : " per month",
        "inc" : "% increase",
        "rentmissing" : "Please enter your current rent.",
        "toosoon" : "The rates for renewed leases that begin after September 30, 2023 have not been set yet by the Rent Guidelines Board. For more information, <a href='https://rentguidelinesboard.cityofnewyork.us/'>click here</a> or sign up to receive more information or updates."
      }
    }

    var str = outputStrings["ES"];

    function formatRent(val){
      return commaSeparateNumber(parseFloat(val).toFixed(2));
    }

    function commaSeparateNumber(val){
      while (/(\d+)(\d{3})/.test(val.toString())){
        val = val.toString().replace(/(\d+)(\d{3})/, '$1'+','+'$2');
      }
      return val;
    }

    // A function that calculates the user's future rent
    // based on current rent, current lease expiration date,
    // and RGB set rates. 
    // @baseRent: user's current rent from input form
    // @expYear: current lease expiration year
    // @expMonth: current lease expiration month
    // @expDay: estimated current lease expiration day
    function calculateIncrease(baseRent, expYear, expMonth, expDay) {


      //an array of rent increase rates
      //as approved by the Rent Guideline Board
      var rentIncreaseRates = {
        "2021" : {
          "oneyear" : 1.5,
          "twoyear" : 2.5,
        },
        "2022" : {
          "oneyear" : 3.25,
          "twoyear" : 5,
        },
      }

      //rate change effective Date
      var rateChangeDate    = new Date("2022-10-01T00:00:00"); 
      var rateChangeEndDate = new Date("2023-09-30T00:00:00");
      
      //currrent ease expiration date
      var expirationDate  = new Date(expYear + "-" + expMonth + "-" + expDay + "T00:00:00");  

      // Validate that lease start date is valid
      if (expirationDate > rateChangeEndDate) {
        $("#calc-error").html(str["toosoon"]);
        return false;
      }


      // year of the last approved rent rate 
      var currentRateYear = rateChangeDate.getFullYear();

      // year of user's rent rate based on lease expiration date
      var rateYear = (expirationDate < rateChangeDate) ? currentRateYear - 1 : currentRateYear;
      console.log(  expYear + "-" + expMonth + "-" + expDay);

      // rates for user's rent rate year from array
      var rate1yr = rentIncreaseRates[rateYear]["oneyear"];   
      var rate2yr = rentIncreaseRates[rateYear]["twoyear"];  

      // calculated rent increase  
      var rentInc1yr = parseFloat(baseRent * (rate1yr/100));
      var rentInc2yr = parseFloat(baseRent * (rate2yr/100));

      // new rent for 1 or 2 years based on calculated rent increases
      var new1yrRent = baseRent + rentInc1yr;
      var new2yrRent = baseRent + rentInc2yr;

      // Output string to print new rent
      var calcOutput = "<dl class='new-rent-calculations'>";
      calcOutput += "<dt>" + str["1yrlease"] + "</dt>";
      calcOutput += "<dd><span class='new-rate'>";

      // Exception: in 2021, RGB declared that 1 year leases
      // would not see rents raised for first six months (0%)
      // but would be raised by 1.5% for the remaining six months.
      // Two year leases were not affected by this exception.
      if (rateYear == "2021") {
        var month1 = parseInt(expMonth) + 1;
        var month6 = (month1 + 5) <= 12 ? month1 + 5 + "/" + currentRateYear :  ((month1 + 5) - 12) + "/" + (currentRateYear + 1);
        var month7 = (month1 + 6) <= 12 ? (month1 + 6) + "/" + currentRateYear : ((month1 + 6) - 12) + "/" + (currentRateYear + 1);
        var month12 = month1 == 1 ? 12 + "/" + (currentRateYear) : ((month1 + 11) - 12) + "/" + (currentRateYear + 1); 

        calcOutput += str["first6"] + " (" + month1 + "/" + currentRateYear + "&ndash;" + month6 + "):<br>";
        calcOutput += "$" + formatRent(baseRent) + str["p/m"];
        calcOutput += "<small class='rate-breakdown'>" + str["same"] + "</small><br>";
        calcOutput += str["next6"] + " (" + month7 + "&ndash;" + month12 + "):<br>";
      }
      
      // Close 1 year lease rent output string
      calcOutput += "$" + formatRent(new1yrRent) + str["p/m"];
      calcOutput += "<small class='rate-breakdown'>$" + formatRent(baseRent) + " + " + rate1yr + str["inc"] + "</small>";
      calcOutput += "</span></dd>";

      // Add 2 year lease rent output string
      calcOutput += "<dt>" + str["2yrlease"] + "</dt>";
      calcOutput += "<dd><span class='new-rate'>$";
      calcOutput += formatRent(new2yrRent) + str["p/m"];
      calcOutput += "<small class='rate-breakdown'>$" + formatRent(baseRent) + " + " + rate2yr + str["inc"] + "</small>";
      calcOutput += "</span></dd>";
      calcOutput += "</dl>";

      // Write to DOM
      $("#calc-error").html();
      $("#calc-output").html(calcOutput);
    }

    function initCalcLabels() {

      str = outputStrings[$(".calc-lang-selector:checked").val()];
      $("#calc-title").html(str["title"]);
      $("#calc-subtite").html(str["subtitle"]);
      $("#calc-label-rent").html(str["calc-label-rent"]);
      $("#calc-label-exp").html(str["calc-label-exp"]);
    }

    return this.each(function() {




      $(".calc-lang-selector").on('change' , function(e) {

        console.log($(this).val());
        str = outputStrings[$(this).val()]; 
        initCalcLabels();
      
      });


      $("#calc-submit-button").on('click', function(e) {
     
        e.preventDefault();

        // Make sure that user entered rent amount
        if (($("#calc-rent").val() == null) || ($("#calc-rent").val() == 0)) {
          $("#calc-error").html(str["rentmissing"]);
          return false;
        }   
        
        // call main calculator function
        calculateIncrease(parseFloat($("#calc-rent").val()), $("#calc-exp-year").val(), $("#calc-exp-month").val(), $("#calc-exp-month").val() == 2 ? 28 : 30);

      });

      $(window).on('load', function() {
        initCalcLabels();
      });

    });
  };

  $('#rent-calculator').initCalc();
}).call(this);
