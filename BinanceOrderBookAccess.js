const WebSocket = require('ws');
const ordersLimit = 10;


function getRawDataFromSocket(resolve, reject)
{
  const ws = new WebSocket('wss://ws-api.binance.com:443/ws-api/v3');
  ws.onopen = () => 
  {
    ws.send(JSON.stringify({
      id: '51e2affb-0aba-4821-ba75-f2625006eb43',
      params: { symbol: "BTCUSDT", "limit": ordersLimit },
      method: "depth"
    }));
  };
  ws.onerror = (e) => reject('error = ' + e);
  ws.onmessage = (e) => resolve(JSON.parse(e.data));
}

function getBinanceBTCPricePromise() 
{ 
    return new Promise(getRawDataFromSocket);
}


async function getBinanceBTCPriceWithWebSockets()
{ 
  var orderBookBinanceJSON = await getBinanceBTCPricePromise().then(x => x);
  var orderBookAsks = orderBookBinanceJSON.result.asks;
  var orderBookBids = orderBookBinanceJSON.result.bids;
  var bidsAndAsksSum = 0;
  orderBookAsks.forEach(x => bidsAndAsksSum += parseFloat(x[0]));
  orderBookBids.forEach(x => bidsAndAsksSum += parseFloat(x[0]));
  var binanceBTCPrice = bidsAndAsksSum / (orderBookAsks.length + orderBookBids.length);
  return binanceBTCPrice;
}

module.exports = { getBinanceBTCPriceWithWebSockets };