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
  var krakenBTCPrice = await new RequestBuilder().GET(url).buildAndExecute().then(onCompleteKraken).catch(onErrorKraken);
  return krakenBTCPrice;
}

module.exports = { getKrakenBTCPrice };