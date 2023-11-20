const Okhttp = require('okhttp');
const ordersLimit = 10;

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

module.exports = { getHuobiBTCPrice };