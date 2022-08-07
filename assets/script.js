var searchButtonEl = document.querySelector("#searchBtn");

var searchModalEl = document.querySelector("#searchModal");
var resultSelectEl = document.querySelector("#result-select");

var sectionEl = document.querySelector(".section");

var coinData; //empty global variable to hold the coin data 
var searchNum = 0;

function searchHandler(event) {
    event.preventDefault();
    //get user input for search
    var searchInput = document.querySelector("#searchInput").value;
    //TODO: Validate search input
    searchCoin(searchInput);
}

function fetchPrice(geckoID) {
    var priceEl = document.querySelector(`.coinPrice.search${searchNum}`);
    //get price of coin with coinGecko
    fetch(
        `https://api.coingecko.com/api/v3/simple/price?ids=${geckoID}&vs_currencies=usd`
    )
        .then(function (response) {
            //TODO Error check and throw
            return response.json();
        })
        .then(function (priceRes) {
            priceRes = priceRes[`${geckoID}`];//get the object within the price results called `${geckoID}`
            priceEl.textContent = `$${priceRes.usd}`;
        });
}

function searchCoin(query) {
    coinData = '';//Clear coin data
    //Fetch data from coin gecko using search query
    fetch(`https://api.coingecko.com/api/v3/search?query=${query}`)
        .then(function (response) {
            //TODO Error check and throw
            return response.json();
        }).then(function (coinRes) {
            coinData = coinRes.coins;
            //If there are three or more results
            if (coinData.length >= 3) {
                for (let i = 0; i < 3; i++) {
                    resultSelectEl.children[i].textContent = coinData[i].name;
                }
                openModal(searchModalEl);
                document.querySelector('#selectBtn').addEventListener('click', coinSelect);
            }
            else {
                console.log("No select");
                writeCoinData(0);
            }
        });
}

function coinSelect() {
    let resNum = 0;
    if (resultSelectEl.value) {
        resNum = Number(resultSelectEl.value);
    }
    writeCoinData(resNum);
    //Remove event listener from the select button
    document.querySelector('#selectBtn').removeEventListener('click', coinSelect);
    closeModal(searchModalEl);
}

function writeCoinData(resNum) {
    if (!coinData) {
        console.log('No coin data!')
        return;
    }
    searchNum++;
    console.log(`SearchNum: ${searchNum}`);
    addBlock();
    var coinName = coinData[resNum].name;
    searchNews(coinName);
    //Write data to html
    var priceDispEl = document.querySelector(`.priceDisp.search${searchNum}`);
    var nameEl = document.createElement("div");
    var symbolEl = document.createElement("div");
    var priceEl = document.createElement("div");

    priceDispEl.appendChild(nameEl);
    priceDispEl.appendChild(symbolEl);
    priceDispEl.appendChild(priceEl);
    var addClasses = ['coinName', 'coinSymbol', 'coinPrice'];
    var addedElements = priceDispEl.children;
    for (let i = 0; i < addedElements.length; i++) {
        addedElements[i].classList.add(`search${searchNum}`, `${addClasses[i]}`);
    }
    nameEl.textContent = coinName;
    symbolEl.textContent = coinData[resNum].symbol;
    fetchPrice(coinData[resNum].id);
}

function searchNews(searchTerm) {
    //SHOULD NEVER PUT API KEYS IN PUBLIC REPO BUT IT IS HERE UNTIL WE GO OVER HOW TO HIDE IT
    const apiKey = '';//APIkey goes here
    if (!apiKey) {
        console.log('No APIkey');
        return;
    }
    fetch(`https://api.thenewsapi.com/v1/news/all?api_token=${apiKey}&language=en&search=${searchTerm}&limit=3&published_after=2022-03-01&categories=business,tech,politics`)
        .then(function (response) {
            return response.json();
        }).then(function (articleRes) {
            articleRes = articleRes['data'];
            articleRes.forEach(article => {//get info from each result
                var artTitle = article.title
                var artURL = article.url;
                var artDesc = article.description;
                var artDate = article.published_at;
                //console.log(`Title: ${artTitle}\nURL: ${artURL}\nDescription: ${artDesc}\nDate published: ${artDate}`);
                var titleListItem = document.createElement("a");
                var descListItem = document.createElement("div");
                var artDateListItem = document.createElement("div");
                var articleDispEl = document.querySelector(`.headLineDisp.search${searchNum}`);
                titleListItem.textContent = artTitle;
                titleListItem.href = artURL;
                titleListItem.target = "_blank";
                descListItem.textContent = "Description: " + artDesc;
                artDateListItem.textContent = "Published: " + artDate.split("T")[0];

                articleDispEl.appendChild(titleListItem);
                articleDispEl.appendChild(descListItem);
                articleDispEl.appendChild(artDateListItem);

                var addClasses = ['artTitle', 'artDesc', 'artDate']
                var addedElements = articleDispEl.children;
                for (let i = 0; i < addedElements.length; i++) {
                    addedElements[i].classList.add(`search${searchNum}`, `${addClasses[i]}`);
                }
            });
        });

}

function addBlock() {
    let containerEl = document.createElement("div");
    containerEl.classList.add(`search${searchNum}`, `container`);
    let columnsEl = document.createElement("div");
    columnsEl.classList.add(`search${searchNum}`, `columns`);
    let priceDispEl = document.createElement("div");
    priceDispEl.classList.add(`search${searchNum}`, `box-custom`, `column`, `is-one-third`, `priceDisp`);
    let headLineDispEl = document.createElement("div");
    headLineDispEl.classList.add(`search${searchNum}`, `box-custom`, `column`, `headLineDisp`);

    sectionEl.appendChild(containerEl);
    containerEl.appendChild(columnsEl);
    columnsEl.appendChild(priceDispEl);
    columnsEl.appendChild(headLineDispEl);
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

    (document.querySelectorAll('.modal-close') || []).forEach(close => {//get all elements with "modal-close" class and run for each
        var linkedModal = close.closest('.modal');

        close.addEventListener('click', () => {
            closeModal(linkedModal);
        })
    })
});
