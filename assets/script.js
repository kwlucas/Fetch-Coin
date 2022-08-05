var coinEL = document.createElement("div"); //Is this necessary? -Kyle
var searchButtonEl = document.querySelector("#searchBtn");

var searchModalEl = document.querySelector("#searchModal");
var resultSelectEl = document.querySelector("#result-select");

var nameEl = document.querySelector("#coinName");
var symbolEl = document.querySelector("#coinSymbol");
var priceEl = document.querySelector("#coinPrice");

var articleDispEl = document.querySelector("#headLineDisp");

var searchNum = 0;

function searchHandler(event) {
  event.preventDefault();
  //get user input for search
  var searchInput = document.querySelector("#searchInput").value;
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
            return response.json();
        }).then(function (coinRes) {
            coinRes = coinRes.coins;
            if (coinRes.length >= 3) {
                for (let i = 0; i < 3; i++) {
                    resultSelectEl.children[i].textContent = coinRes[i].name;
                }
                openModal(searchModalEl);
                document.querySelector('#selectBtn').addEventListener('click', function () { coinSelect(coinRes) });
            }
            else {
                console.log("No select");
                writeCoinData(coinRes, 0);
            }
        });
}

function coinSelect(results) {
    let resNum = 0;
    if (resultSelectEl.value) {
        resNum = Number(resultSelectEl.value);
    }
    writeCoinData(results, resNum);
    document.querySelector('#selectBtn').removeEventListener('click', function () { coinSelect() });
    closeModal(searchModalEl);
}

function writeCoinData(results, resNum) {
    if (!results) {
        return;
    }
    var coinName = results[resNum].name;
    searchNews(coinName);
    //set text on html
    nameEl.textContent = coinName;
    symbolEl.textContent = results[resNum].symbol;
    fetchPrice(results[resNum].id);
}

function searchNews(searchTerm) {
  //SHOULD NEVER PUT API KEYS IN PUBLIC REPO BUT IT IS HERE UNTIL WE GO OVER HOW TO HIDE IT
  const apiKey = "z2iUbTAjy0yD8xl2bqwIwJ2QgxfMRqZAvStnbuDk"; //APIkey goes here
  if (!apiKey) {
    console.log("No APIkey");
    return;
  }
  fetch(
    `https://api.thenewsapi.com/v1/news/all?api_token=${apiKey}&language=en&search=${searchTerm}&limit=3`
  )
    .then(function (response) {
      return response.json();
    })
    .then(function (articleRes) {
      articleRes = articleRes["data"];
      articleRes.forEach((article) => {
        //get info from each result
        var artTitle = article.title;
        var artURL = article.url;
        var artDesc = article.description;
        var artDate = article.published_at;
        //console.log(`Title: ${artTitle}\nURL: ${artURL}\nDescription: ${artDesc}\nDate published: ${artDate}`);
        var titleListItem = document.createElement("a");
        var descListItem = document.createElement("div");
        var artDateListItem = document.createElement("div");

                titleListItem.textContent = artTitle;
                titleListItem.href = artURL;
                titleListItem.target = "_blank";
                descListItem.textContent = "Description: " + artDesc;
                artDateListItem.textContent = "Published: " + artDate.split("T")[0];

                articleDispEl.appendChild(titleListItem);
                articleDispEl.appendChild(descListItem);
                articleDispEl.appendChild(artDateListItem);

                var addedElements = articleDispEl.children;
                for (let i = 0; i < addedElements.length; i++) {
                    addedElements[i].classList.add(`search${searchNum}`);
                }
            });
        });

}

function openModal(modalEl) {
    modalEl.classList.add('is-active');
}

function closeModal(modalEl) {
    if (modalEl) {
        modalEl.classList.remove('is-active');
    }
    else {
        document.querySelectorAll('.is-active').forEach(modal => {
            modal.classList.remove('is-active');
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    searchButtonEl.addEventListener('click', searchHandler);

    (document.querySelectorAll('.modal-close') || []).forEach(close => {
        var linkedModal = close.closest('.modal');

        close.addEventListener('click', () => {
            closeModal(linkedModal);
        })
    })
});
