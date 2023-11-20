const { Kraken } = require('node-kraken-api'); 
const Binance = require('binance-api-node').default;
const Huobi = require('node-huobi-api');
const Okhttp = require('okhttp');
const ordersLimit = 10;

async function getKrakenBTCPrice()
{ 
    const kraken = new Kraken();
    var orderBookKrakenJSON = await kraken.depth({ pair: "XBTUSDT", count: ordersLimit });
    var orderBookAsks = orderBookKrakenJSON.XBTUSDT.asks;
    var orderBookBids = orderBookKrakenJSON.XBTUSDT.bids;
    var bidsAndAsksSum = 0;
    orderBookAsks.forEach(x => bidsAndAsksSum += parseFloat(x[0]));
    orderBookBids.forEach(x => bidsAndAsksSum += parseFloat(x[0]));
    var btcPriceKraken = bidsAndAsksSum / (orderBookAsks.length + orderBookBids.length);
    return btcPriceKraken;
}

function computeBidsAndAsksAverage(resolve, reject)
{
    const binance = new Binance();
    try
    {
        binance.ws.partialDepth({ symbol: 'BTCUSDT', level: ordersLimit }, (depth) => { 
        var orderBookAsks = depth.asks;
        var orderBookBids = depth.bids;
        var bidsAndAsksSum = 0;
        orderBookAsks.forEach(x => bidsAndAsksSum += parseFloat(x.price));
        orderBookBids.forEach(x => bidsAndAsksSum += parseFloat(x.price));
        var btcPriceBinance = bidsAndAsksSum / (orderBookAsks.length + orderBookBids.length);
        resolve(btcPriceBinance); 
    });
    } 
    catch(err) 
    {
      reject(false);
    }
}

function getBinanceBTCPricePromise() 
{ 
    return new Promise(computeBidsAndAsksAverage);
}

async function getBinanceBTCPriceWithWebSockets()
{ 
    var rslt = await getBinanceBTCPricePromise().then(x => x);
    return rslt;
}

function onComplete(message)
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

function onError(error)
{
  console.error(error);
}

async function getHuobiBTCPrice()
{ 
    var url = 'https://api.huobi.pro/market/depth?symbol=btcusdt&type=step0';
    var RequestBuilder = Okhttp.RequestBuilder;
    var rslt = await new RequestBuilder().GET(url).buildAndExecute().then(onComplete).catch(onError);
    return rslt;
}

module.exports = { getKrakenBTCPrice, getBinanceBTCPriceWithWebSockets, getHuobiBTCPrice };