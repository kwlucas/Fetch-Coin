# k5-Project1-finance_info
Title: 
FETCH COIN

Sub-Title: 
Quickly find status, basic information, and news for crypto coins

User Story: 
As an investor I want a tool to check the price of financial products (scrypto/currency/coins) so that I can evaluate and comnpare my current or future investments. 

Use:
To get started, enter a coin name in the text-input field and click on the search button. A modal will pop-up with three possible matches, select the coin you would like to see and click on the select button.

The page will populate two boxes. The first box will contain the name, trading symbol, and current price.The second box will include up to three articles relevent to the coin entered. The articles will comprosed of a headline, description of the article, and the date published. The article title is a link, it will open the article in a new window/tab.

For comparison purposes, you can search for multiple coins and additional boxes will be populated below your initial search.

If you refresh, close or navigate away from the page, don't worry, your previous searches will be saved and re-populated when you come back.

Function:
Input
Verfification
    Fetch coin name dat from API: 'CoinGecko'
Search
Request
    Fetch coin data from API: 'CoinGecko'
    Fetch article data ffrom API: 'theNewsAPI'
Response
    Add Block Elements
    Populate Block elements
Save to Local Storage






