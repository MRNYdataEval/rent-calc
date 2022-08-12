(function() {
  var $, $body, ref;

  $ = jQuery;

  window.lt_ie9 = (ref = $('html').hasClass('lt-ie9')) != null ? ref : {
    "true": false
  };

  window.isMobile = /iphone|ipad|ipod|android|blackberry|mini|windows\sce|palm/i.test(navigator.userAgent.toLowerCase());

  window.isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent.toLowerCase());

  var userLang = navigator.language.substring(0, 2) || navigator.userLanguage.substring(0, 2); 


  $body = $('body');

  $.fn.initCalc = function() {
    
    // Array of string literals used for display copy
    // based on user selected language

    var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    var meses = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];

    var outputStrings = {
      "es" : {
        "title" : "Calculadora de renta mensual anticipada",
        "subtitle" : "para apartamentos de renta regulada",
        "calc-label-rent" : "Renta actual",
        "calc-label-exp"  : "Fecha de inicio de nuevo contrato de arrendamiento<br>(Mes/Día/Año)",
        "1yrlease-label" : "Contrato de Un Año",
        "2yrlease-label" : "Contrato de Dos Años",
        "1yrlease" : "Si Ud. renueva su contrato de arrendamiento por un a&ntilde;o, su rente sera",
        "2yrlease" : "Si Ud. renueva su contrato de arrendamiento por dos a&ntilde;os, su rente sera",
        "first6" : "Primeros seis meses",
        "next6" : "Siguientes seis meses",
        "same" : "(sin cambio)",
        "p/m" : " por mes",
        "inc" : "% de aumento",
        "rentmissing" : "Favor de llenar su renta actual en el formulario.",
        "toosoon" : "Todavia no sabemos cuanto seran los aumentos para los contratos de arrendamiento que comienzan despeus del " + rateChangeEndDate.getDate() + " de " + meses[rateChangeEndDate.getMonth()] + " del " + rateChangeEndDate.getFullYear() + ". Favor de consular esta <a href='https://rentguidelinesboard.cityofnewyork.us/'>pagina web</a> o llenar este formulario para mantenerse informado.",
        "submit" : "Calcular",
        "disclaimer" : "La intención de esta calculadora es de darle una idea básica sobre su renta si es que Ud. vive en un apartamento con renta estabilizada. La información ofrecida aquí no tienen valor jurídico. Consulte con un abogado si tiene preguntas tal como si quiere saber si Ud. vive en un apartamento con renta estabilizada y si Ud. esta sobre pagando en su renta."
 
      
      }, 
      "en" : {
        "title" : "Future Monthly Rent Calculator",
        "subtitle" : "For Rent Stabilized Apartments",
        "calc-label-rent" : "Current Rent",
        "calc-label-exp"  : "New Lease Start Date<br>(MM/DD/YYYY)",
        "1yrlease-label" : "One Year Lease",
        "2yrlease-label" : "Two Year Lease",
        "1yrlease" : "If you renew your lease for one year, your monthly rent will be ",
        "2yrlease" : "If you renew your lease for two years, your monthly rent will be ",
        "first6" : "First six months",
        "next6" : "Next six months",
        "same" : "(No increase)",
        "p/m" : " per month",
        "inc" : "% increase",
        "rentmissing" : "Please enter your current rent.",
        "toosoon" : "The rates for renewed leases that begin after " + months[rateChangeEndDate.getMonth()] + " " + rateChangeEndDate.getDate() + ", " + rateChangeEndDate.getFullYear() + ", have not been set yet by the Rent Guidelines Board. For more information, <a href='https://rentguidelinesboard.cityofnewyork.us/'>click here</a> or sign up to receive more information or updates.",
        "submit" : "Calculate",
        "disclaimer" : "This calculator is intended to provide a basic estimate of your future rent if you live in a rent stabilized apartments and should not be interpreted as legally binding. You should consult with a lawyer for more complicated questions, including determining if you live in a rent stabilized building and if your current rent is correct."
      
      }
    }

    //set default language
    var str = outputStrings["es"];

    // Format calculated rent value as X00.00
    function formatRent(val){
      return commaSeparateNumber(parseFloat(val).toFixed(2));
    }

    // Format number as X000,000
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
    function calculateIncrease(baseRent, startYear, startMonth, startDay) {


      //an array of rent increase rates
      //as approved by the Rent Guideline Board
      var rentIncreaseRates = rates;


      //rate change effective Date
      //var rateChangeDate    = new Date("2022-10-01T00:00:00"); 
      //var rateChangeEndDate = new Date("2023-09-30T00:00:00");
      
     
      //New lease start date
      var startDate  = new Date(startYear + "-" + startMonth + "-" + startDay + "T00:00:00");  
      expMonth = parseInt(startMonth) == 1 ? 12 : parseInt(startMonth) - 1;
      expYear  = parseInt(startMonth) == 1 ? parseInt(startYear) - 1 : parseInt(startYear);
      expDay   = expMonth   == 2 ? 28 : 30;

    
      //currrent lease expiration date
      var expirationDate  = new Date(expYear + "-" + (expMonth < 10 ? "0" + expMonth : expMonth) + "-" + expDay + "T00:00:00");  


      $("#rent-calc-output-wrapper").addClass("show");
      $("#rent-arrow-right").addClass("show");

      // Validate that lease start date is valid
      if (startDate > rateChangeEndDate) {
        $("#rent-calc-output").html("<p class='new-rental-term'>" + str["toosoon"] + "</p>").addClass("show");
        return false;
      }


      // year of the last approved rent rate 
      var currentRateYear = rateChangeDate.getFullYear();

      // year of user's rent rate based on lease expiration date
      var rateYear = (startDate < rateChangeDate) ? currentRateYear - 1 : currentRateYear;
      

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
      var calcOutput = "<div class='new-rent-calc'>";
      calcOutput += "<h1 class='new-rent-label'>" + str["1yrlease-label"] + "</h1>";
        

      // Exception: in 2021, RGB declared that 1 year leases
      // would not see rents raised for first six months (0%)
      // but would be raised by 1.5% for the remaining six months.
      // Two year leases were not affected by this exception.
      if (rateYear == "2021") {
        var month1 = parseInt(startMonth);
        var month6 = (month1 + 5) <= 12 ? month1 + 5 + "/" + currentRateYear :  ((month1 + 5) - 12) + "/" + (currentRateYear + 1);
        var month7 = (month1 + 6) <= 12 ? (month1 + 6) + "/" + currentRateYear : ((month1 + 6) - 12) + "/" + (currentRateYear + 1);
        var month12 = month1 == 1 ? 12 + "/" + (currentRateYear) : ((month1 + 11) - 12) + "/" + (currentRateYear + 1); 

        calcOutput += "<p class='new-rental-term'>";
        calcOutput += str["first6"] + " (" + month1 + "/" + currentRateYear + "&ndash;" + month6 + "):<br>";
        calcOutput += "<span class='new-rental-cost'>$" + formatRent(baseRent) + str["p/m"] + "</span>";
        calcOutput += "<br /><small class='new-rate-breakdown'>" + str["same"] + "</small><br>";
        calcOutput += "</p><br>";
        calcOutput += "<p class='new-rental-term'>";
        calcOutput += str["next6"] + " (" + month7 + "&ndash;" + month12 + "):<br>";
        calcOutput += "<span class='new-rental-cost'>$" + formatRent(new1yrRent) + str["p/m"] + "</span>";
        calcOutput += "<br /><small class='new-rate-breakdown'>($" + formatRent(baseRent) + " + " + rate1yr + str["inc"] + ")</small><br>";
        calcOutput += "</p>";
      } 
      // End Exception
      // Standard 1 Year Lease
      else {

        calcOutput += "<div class='new-rent-amount'><h2>$" + formatRent(new1yrRent) + "</h2><span class='new-rent-per-month'>" + str["p/m"] + "</span></div>";
        calcOutput += "<p class='new-rental-term'>" + str["1yrlease"] + " $" + formatRent(new1yrRent);
        calcOutput += " <small class='new-rent-breakdown'>($" + formatRent(baseRent) + " + " + rate1yr + str["inc"] + ")</small>.";
        calcOutput += "</p>";
      }
      // End Standard 1 Year Lease
      


      calcOutput += "</div>";

      // Add 2 year lease rent output string
      calcOutput += "<div class='new-rent-calc'>";
      calcOutput += "<h1 class='new-rent-label'>" + str["2yrlease-label"] + "</h1>";
      calcOutput += "<div class='new-rent-amount'><h2>$" + formatRent(new2yrRent) + "</h2><span class='new-rent-per-month'>" + str["p/m"] + "</span></div>";
      calcOutput += "<p class='new-rental-term'>" + str["2yrlease"] + " $" + formatRent(new2yrRent);
      calcOutput += " <small class='new-rent-breakdown'>($" + formatRent(baseRent) + " + " + rate2yr + str["inc"] + ")</small>.";

      calcOutput += "</p>";
      calcOutput += "</div>";


      // Write to DOM
      $("#rent-calc-output").html(calcOutput).addClass("show");
    }


    // Set text labels based on selected language
    function translateCalcLabels(selected) {

      // Change visibility states
      $(".rent-calc-lang-option").removeClass("selected")
      selected.addClass("selected");

      // Replace strings with selected language
      str = outputStrings[selected.data("lang")];
      $("#rent-calc-title").html(str["title"]);
      $("#rent-calc-subtitle").html(str["subtitle"]);
      $("#rent-calc-label-rent").html(str["calc-label-rent"]);
      $("#rent-calc-label-start").html(str["calc-label-exp"]);
      $("#rent-calc-submit-button").html(str["submit"]);
      $("#rent-calc-disclaimer").html(str["disclaimer"]);

      var m = selected.data("lang") == 'es' ? meses : months;
      $("#rent-calc-start-month option").each(function(i)
      {
        $(this).text(m[i]);
      });
      
      if (($("#rent-calc-rent").val() > 0) && ($("#rent-calc-rent").val() != null)) {
        calculateIncrease(parseFloat($("#rent-calc-rent").val()), $("#rent-calc-start-year").val(), $("#rent-calc-start-month").val(), 1); 
      }
    }


    return this.each(function() {

      // Init on submit
      $("#rent-calc-submit-button").on('click', function(e) {

        // e.preventDefault();

        // Make sure that user entered rent amount
        if (($("#rent-calc-rent").val() == null) || ($("#rent-calc-rent").val() == 0)) {
          $("#rent-calc-rent-missing").text(str["rentmissing"]);
          return false;
        }  else { 

          $("#rent-calc-rent-missing").text('');
          // call main calculator function
          calculateIncrease(parseFloat($("#rent-calc-rent").val()), $("#rent-calc-start-year").val(), $("#rent-calc-start-month").val(), $("#rent-calc-start-day").val()); // $("#rent-calc-start-month").val() == 2 ? 28 : 30);
        }

      });


      // Init language picker
      $(".rent-calc-lang-option").on('click' , function(e) {

        translateCalcLabels($(this));
        

      });

      $("#rent-calc-start-month").on('change', function(e) {

        var lastDay = 0;
        switch(parseInt($(this).val())) {
          case 2 :
            lastDay = 29;
            break;
          case 4 :
          case 6 :
          case 9 :
          case 11 :
            lastDay = 30;
            break;
          default:
            lastDay = 31;
        }

        $("#rent-calc-start-day").html("");
        var options = "";
        for (var i = 1; i <= lastDay; i++) {
          var day = i < 10 ? "0" + i : i;
          options += "<option value='"+day+"''>"+day+"</option>";
        };

        $("#rent-calc-start-day").html(options);

      });

      $(window).on('load', function() {

        translateCalcLabels($("[data-lang='"+userLang+"']"));
      });

    });
  };

  $('#rent-calculator').initCalc();
}).call(this);
