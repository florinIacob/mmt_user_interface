app.factory('CurrencyUtilFactory', function($http, $cookieStore, host_name) {
  var service = {};

  /**
   * Get the list with available currencies
   */
  service.getAvailableCurrencies = function() {
    return ["EUR", "USD", "GBP", "RON","JPY", "CNY", "SDG", "MKD", "MXN", "CAD",
               "ZAR", "AUD", "NOK", "ILS", "ISK", "SYP", "LYD", "UYU", "YER", "CSD",
               "EEK", "THB", "IDR", "LBP", "AED", "BOB", "QAR", "BHD", "HNL", "HRK",
               "COP", "ALL", "DKK", "MYR", "SEK", "RSD", "BGN", "DOP", "KRW", "LVL",
               "VEF", "CZK", "TND", "KWD", "VND", "JOD", "NZD", "PAB", "CLP", "PEN",
               "DZD", "CHF", "RUB", "UAH", "ARS", "SAR", "EGP", "INR", "PYG",
               "TWD", "TRY", "BAM", "OMR", "SGD", "MAD", "BYR", "NIO", "HKD", "LTL",
               "SKK", "GTQ", "BRL", "HUF", "IQD", "CRC", "PHP", "SVC", "PLN"];
  }

  /**
   * Get default currency for the current user from backend
   */
  service.getDefaultCurrency = function() {
    // prepare post request
      var req = {
          method: 'GET',
          url: host_name + '/user/default_currency',
          headers: {
            'Content-Type': "application/json",
            'Authorization': $cookieStore.get('mmtlt')
         }
       }
      // make server request
      return $http(req);
  }

  return service;
});
