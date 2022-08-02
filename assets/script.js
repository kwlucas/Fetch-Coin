var coinEL = document.createElement("div"); //Is this necessary? -Kyle
var searchButtonEl = document.querySelector("#searchBtn");

var nameEl = document.querySelector("#coinName");
var symbolEl = document.querySelector("#coinSymbol");
var priceEl = document.querySelector("#coinPrice");

function searchHandler(event) {
  event.preventDefault();
  //get user input for search
  var searchInput = document.querySelector("#searchInput").value;
  console.log(searchInput);
  //TODO: Validate search input

  searchCoin(searchInput);
}

function fetchPrice(geckoID) {
  //get price of coin with coinGecko
  fetch(
    `https://api.coingecko.com/api/v3/simple/price?ids=${geckoID}&vs_currencies=usd`
  )
    .then(function (response) {
      //TODO Error check and throw
      return response.json();
    })
    .then(function (priceRes) {
      priceRes = priceRes[`${geckoID}`];
      priceEl.textContent = `$${priceRes.usd}`;
    });
}

function searchCoin(query) {
  //Get data from coinGecko
  fetch(`https://api.coingecko.com/api/v3/search?query=${query}`)
    .then(function (response) {
      //TODO Error check and throw
      //console.log(response);
      return response.json();
    })
    .then(function (coinRes) {
      //TODO Narrow search results to most relevant b/c they are ordered by market cap
      coinRes = coinRes.coins;
      //console.log(coinRes);
      var coinName = coinRes[0].name;
      //TODO getArticles(coinName);
      //set text on html
      nameEl.textContent = coinName;
      symbolEl.textContent = coinRes[0].symbol;
      fetchPrice(coinRes[0].id);
    });
}

searchButtonEl.addEventListener("click", searchHandler);
