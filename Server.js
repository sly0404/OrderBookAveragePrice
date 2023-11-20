const express = require('express');
const ArrayManagement = require('./ArrayManagement.js');
const ExchangeOrderBookAccess = require('./ExchangeOrderBookAccess.js');

const server = express();
const port = 8080;

async function getAverageBTCPrice(req, res)
{ 
    var krakenBTCPrice = await ExchangeOrderBookAccess.getKrakenBTCPrice();
    var binanceBTCPrice = await ExchangeOrderBookAccess.getBinanceBTCPriceWithWebSockets();
    var huobiBTCPrice = await ExchangeOrderBookAccess.getHuobiBTCPrice();
    var btcPriceArray = [];
    btcPriceArray.push(krakenBTCPrice);
    btcPriceArray.push(binanceBTCPrice);
    btcPriceArray.push(huobiBTCPrice);
  
    var averageBTCPrice = ArrayManagement.getArrayAverage(btcPriceArray);
    res.send({
        "averagePrice" : averageBTCPrice
      });
}

server.get("/orderBookAveragePrice", getAverageBTCPrice);
server.listen(port, () => {
    console.log(`listening on port ${port}`)
  });