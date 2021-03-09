let pipValuesUSD = {
  USD: 10.0,
  JPY: 0.0,
  CAD: 0.0,
  CHF: 0.0,
  GBP: 0.0,
};
let pipValuesGBP = {
    USD: 0.0,
    JPY: 0.0,
    CAD: 0.0,
    CHF: 0.0,
    GBP: 10.0,
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

function renderHeader(maxPipRisk, table, currency){
    const caption = document.createElement('caption');
    caption.textContent = `${currency} - Account`;
    table.appendChild(caption);

    const tableRow = document.createElement('tr');
    table.append(tableRow);

    const first = document.createElement('th');
    table.querySelector('tr').append(first);

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

function renderTable(risk, table, pipValues, currency){
    //console.log(table);
    renderHeader(30, table, currency);
    renderTableContent(table, risk, pipValues);
}

function deleteTables(){
    tableUSD.innerHTML = "";
    tableGBP.innerHTML = "";
}

async function app(event) {
  const baseUrl = "https://fxmarketapi.com/apilive";
  const apiKey = "c2gkBAqRIn9CDdqEEyRY";
  const pairsUSD= "USDCHF,USDJPY,USDCAD,USDGBP";
  const pairsGBP= "GBPCHF,GBPJPY,GBPCAD,GBPUSD";
  const url_USD = `${baseUrl}?api_key=${apiKey}&currency=${pairsUSD}`;
  const url_GBP = `${baseUrl}?api_key=${apiKey}&currency=${pairsGBP}`;

  const resultUSD = await sendHttpRequest(url_USD);
  const resultGBP = await sendHttpRequest(url_GBP)

  calculatePipValues(resultUSD, pipValuesUSD);
  calculatePipValues(resultGBP, pipValuesGBP);
    console.log(pipValuesGBP);
  event.preventDefault();
  const riskValue = document.querySelector('#inputRisk').value;

  deleteTables(); // if there are tables rendered deletes them

  renderTable(riskValue, tableUSD, pipValuesUSD, 'USD');
  renderTable(riskValue, tableGBP, pipValuesGBP, 'GBP');
}



btnSubmit.addEventListener('click', event => {app(event)});

/* 
    XXX/USD = $10/PIP
    USD/XXX = ( 10 / EXCHANGERATE ) / PIP -- (JPY: 10 / EXCHANGERATE * 100 )
    XXX/YYY: YYY gives fixed 10 pip value -> converts to your acc currency ZZZ => 10 / ZZZ/YYY  (JPY: * 100)
*/
