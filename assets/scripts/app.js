let pipValues = {
    'USD': 10.0,
    'JPY': 0.0,
    'CAD': 0.0,
    'CHF': 0.0,
    'GBP': 0.0,
}

function sendHttpRequest(url){
    return fetch(url).then(response => {
        if(response.status >= 200 && response.status < 300){
            return response.json();
        }else{
            return response.json().then(errData => {
                console.log(errData);
                throw new Error("It's Bad :(");
            })
        }
    })
    .catch(error => {
        console.lof(error);
        throw new Error("It's Bad :(");
    })
}

function setPipValues(exchangeRates){
    const prices = exchangeRates.price;
    console.log(prices);
   for(const price in prices){
       console.log(`${price.substring(3, 6)} - ${prices[price]}`);
       if(price.substring(3, 6) === "JPY"){
            pipValues[price.substring(3, 6)] = 10 / prices[price] * 100;
       }else{
           pipValues[price.substring(3, 6)] = 10 / prices[price];
       }
   }
   console.log(pipValues)
}

async function app(){
    const baseUrl = "https://fxmarketapi.com/apilive";
    const apiKey = "c2gkBAqRIn9CDdqEEyRY"
    const pairs = "USDCHF,USDJPY,USDCAD,USDGBP";
    const url = `${baseUrl}?api_key=${apiKey}&currency=${pairs}`;
    try{
        const result = await sendHttpRequest(url);
        //console.log(result);
        setPipValues(result);
    }catch(error){
        console.log(error);
    }
}

app();








/* 
    XXX/USD = $10/PIP
    USD/XXX = ( 10 / EXCHANGERATE ) / PIP -- (JPY: 10 / EXCHANGERATE * 100 )
    XXX/YYY: YYY gives fixed 10 pip value -> converts to your acc currency ZZZ => 10 / ZZZ/YYY  (JPY: * 100)
*/