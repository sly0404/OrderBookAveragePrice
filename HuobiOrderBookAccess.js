const Okhttp = require('okhttp');
const ordersLimit = 10;

function onCompleteHuobi(message)
{
  var orderBookHuobiJSON = JSON.parse(message.data);
  orderBookAsks = orderBookHuobiJSON.tick.asks;
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
    var url = 'https://api.huobi.pro/market/depth?symbol=btcusdt&type=step0&depth=' + ordersLimit;
    var RequestBuilder = Okhttp.RequestBuilder;
    var huobiBTCPrice = await new RequestBuilder().GET(url).buildAndExecute().then(onCompleteHuobi).catch(onErrorHuobi);
    return huobiBTCPrice;
}

module.exports = { getHuobiBTCPrice };