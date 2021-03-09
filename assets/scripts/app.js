let pipValuesUSD = {
  USD: 10.0,
  JPY: 0.0,
  CAD: 0.0,
  CHF: 0.0,
  GBP: 0.0,
};
let pipValuesGBP = {
    USD: 10.0,
    JPY: 0.0,
    CAD: 0.0,
    CHF: 0.0,
    GBP: 0.0,
  };
const btnSubmit = document.querySelector('.btn-success');
const form = document.querySelector('#inputRisk');
const tableUSD = document.querySelector('.usd');
const tableGBP = document.querySelector('.gbp');

function sendHttpRequest(url) {
  return fetch(url)
    .then((response) => {
      if (response.status >= 200 && response.status < 300) {
        return response.json();
      } else {
        return response.json().then((errData) => {
          console.log(errData);
          throw new Error("It's Bad :(");
        });
      }
    })
    .catch((error) => {
      console.log(error);
      throw new Error("It's Bad :(");
    });
}

function calculatePipValues(exchangeRates, pipValues) {
  const prices = exchangeRates.price;
  console.log(prices);
  for (const price in prices) {
      console.log(`${price.substring(3, 6)} - ${prices[price]}`);
      if (price.substring(3, 6) === "JPY") {
        pipValues[price.substring(3, 6)] = (10 / prices[price]) * 100;///
        } else {
            pipValues[price.substring(3, 6)] = 10 / prices[price];////
        }
    }
    //console.log(pipValuesUSD);
}

function riskCalculator(pipsRisk, pipValue, dollarRisk){
    return dollarRisk / (pipsRisk * pipValue);
}

function renderHeader(maxPipRisk, table){
    const tableRow = document.createElement('tr');
    table.appendChild(tableRow);

    const first = document.createElement('th');
    table.querySelector('tr').appendChild(first);

    for(let index = 5; index <= maxPipRisk ; index++){
        const headerItem = document.createElement('th');
        //headerItem.className = "table-secondary";
        headerItem.textContent = index;
        table.querySelector('tr').appendChild(headerItem);
    }
}

function renderTableRow(pair, table, pipValue, risk){
    const tableRow = document.createElement('tr');
    const rowPair = document.createElement('td');
    rowPair.textContent = pair;
    table.appendChild(tableRow).appendChild(rowPair);

    for(let index = 5; index <= 30 ; index++){
        const tableItem = document.createElement('td');
        tableItem.textContent = riskCalculator(index, pipValue, risk).toFixed(2);
        table.querySelector('tr:last-of-type').appendChild(tableItem);
    }
}

function renderTableContent(table, risk, pipValues){
    for(const key in pipValues){
        renderTableRow(key, table, pipValues[key], risk);
    }
}

function renderTable(risk, table){
    //console.log(table);
    renderHeader(30, table);
    renderTableContent(table, risk, pipValuesUSD);
}



async function app() {
  const baseUrl = "https://fxmarketapi.com/apilive";
  const apiKey = "c2gkBAqRIn9CDdqEEyRY";
  const pairs = "USDCHF,USDJPY,USDCAD,USDGBP";
  const url = `${baseUrl}?api_key=${apiKey}&currency=${pairs}`;
  const result = await sendHttpRequest(url);

  calculatePipValues(result, pipValuesUSD);

}



btnSubmit.addEventListener('click', async (event) => {
  event.preventDefault();
  const riskValue = document.querySelector('#inputRisk').value;
  await app();
  tableUSD.innerHTML = "";
  renderTable(riskValue, tableUSD);
});

/* 
    XXX/USD = $10/PIP
    USD/XXX = ( 10 / EXCHANGERATE ) / PIP -- (JPY: 10 / EXCHANGERATE * 100 )
    XXX/YYY: YYY gives fixed 10 pip value -> converts to your acc currency ZZZ => 10 / ZZZ/YYY  (JPY: * 100)
*/
