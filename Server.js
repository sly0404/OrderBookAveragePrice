const express = require('express');
const ArrayManagement = require('./ArrayManagement.js');
const KrakenOrderBookAccess = require('./KrakenOrderBookAccess.js');
const BinanceOrderBookAccess = require('./BinanceOrderBookAccess.js');
const HuobiOrderBookAccess = require('./HuobiOrderBookAccess.js');

const server = express();
const port = 8080;

async function getAverageBTCPrice(req, res)
{ 
    var krakenBTCPrice = await KrakenOrderBookAccess.getKrakenBTCPrice();
    var binanceBTCPrice = await BinanceOrderBookAccess.getBinanceBTCPriceWithWebSockets();
    var huobiBTCPrice = await HuobiOrderBookAccess.getHuobiBTCPrice();
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