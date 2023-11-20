const { Kraken } = require('node-kraken-api'); 
const Binance = require('binance-api-node').default;
const WebSocket = require('ws');
const Huobi = require('node-huobi-api');
const Okhttp = require('okhttp');
const ordersLimit = 10;

function onCompleteKraken(message)
{
  var orderBookKrakenJSON = JSON.parse(message.data);
  var orderBookAsks = orderBookKrakenJSON.result.XBTUSDT.asks;
  var orderBookBids = orderBookKrakenJSON.result.XBTUSDT.bids;
  var bidsAndAsksSum = 0;
  orderBookAsks.forEach(x => bidsAndAsksSum += parseFloat(x[0]));
  orderBookBids.forEach(x => bidsAndAsksSum += parseFloat(x[0]));
  var krakenBTCPrice = bidsAndAsksSum / (orderBookAsks.length + orderBookBids.length);
  return krakenBTCPrice;
}

function onErrorKraken(error)
{
  console.error(error);
}

async function getKrakenBTCPrice()
{ 
  var url = 'https://api.kraken.com/0/public/Depth?pair=XBTUSDT&count=' + ordersLimit;
  var RequestBuilder = Okhttp.RequestBuilder;
  var rslt = await new RequestBuilder().GET(url).buildAndExecute().then(onCompleteKraken).catch(onErrorKraken);
  return rslt;
}







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
  //ws.onclose = () => console.log('SOCKET CLOSED');
  ws.onmessage = (e) => resolve(JSON.parse(e.data));
}

function getBinanceBTCPricePromiseXXX() 
{ 
    return new Promise(getRawDataFromSocket);
}


async function getBinanceBTCPriceWithWebSockets()
{ 
  var orderBookBinanceJSON = await getBinanceBTCPricePromiseXXX().then(x => x);
  var orderBookAsks = orderBookBinanceJSON.result.asks;
  var orderBookBids = orderBookBinanceJSON.result.bids;
  var bidsAndAsksSum = 0;
  orderBookAsks.forEach(x => bidsAndAsksSum += parseFloat(x[0]));
  orderBookBids.forEach(x => bidsAndAsksSum += parseFloat(x[0]));
  var binanceBTCPrice = bidsAndAsksSum / (orderBookAsks.length + orderBookBids.length);
  return binanceBTCPrice;
}





function onCompleteHuobi(message)
{
  var orderBookHuobiJSON = JSON.parse(message.data);
  var orderBookAsks;
  if (ordersLimit < orderBookHuobiJSON.tick.asks.length)
    orderBookAsks = orderBookHuobiJSON.tick.asks.slice(0, ordersLimit);
  else
    orderBookAsks = orderBookHuobiJSON.tick.asks;
  var orderBookBids;
  if (ordersLimit < orderBookHuobiJSON.tick.bids.length)
    orderBookBids = orderBookHuobiJSON.tick.bids.slice(0, ordersLimit);
  else
    orderBookBids = orderBookHuobiJSON.tick.bids;
  var bidsAndAsksSum = 0;
  orderBookAsks.forEach(x => bidsAndAsksSum += parseFloat(x[0]));
  orderBookBids.forEach(x => bidsAndAsksSum += parseFloat(x[0]));
  var huobiBTCPrice = bidsAndAsksSum / (orderBookAsks.length + orderBookBids.length);
  return huobiBTCPrice;
}

function onErrorHuobi(error)
{
  console.error(error);
}

async function getHuobiBTCPrice()
{ 
    var url = 'https://api.huobi.pro/market/depth?symbol=btcusdt&type=step0';
    var RequestBuilder = Okhttp.RequestBuilder;
    var rslt = await new RequestBuilder().GET(url).buildAndExecute().then(onCompleteHuobi).catch(onErrorHuobi);
    return rslt;
}

module.exports = { getKrakenBTCPrice, getBinanceBTCPriceWithWebSockets, getHuobiBTCPrice };