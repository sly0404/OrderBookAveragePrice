import * as express from 'express';
const ArrayManagement = require('./ArrayManagement.js');
import { KrakenOrderBook } from './KrakenOrderBook';
import { BinanceOrderBook } from './BinanceOrderBook';
import { HuobiOrderBook } from './HuobiOrderBook';

const server = express();
const port = 8080;


// compute and provide the average price of an array of BTC price extract from differents exchanges 
async function getAverageBTCPrice(req, res)
{ 
  var krakenOrderBook = new KrakenOrderBook();
  await krakenOrderBook.computeAverageBTCPrice();
  var krakenBTCPrice:number = krakenOrderBook.bTCPrice;
  
  var binanceOrderBook = new BinanceOrderBook();
  await binanceOrderBook.computeAverageBTCPrice();
  var binanceBTCPrice: number = binanceOrderBook.bTCPrice;

  var huobiOrderBook = new HuobiOrderBook();
  await huobiOrderBook.computeAverageBTCPrice();
  var huobiBTCPrice: number = huobiOrderBook.bTCPrice;

  var btcPriceArray: number[] = [];
  btcPriceArray.push(krakenBTCPrice);
  btcPriceArray.push(binanceBTCPrice);
  btcPriceArray.push(huobiBTCPrice);

  /*to simply add others exchanges :
    - create class XXX that implements interface OrderBook
    - implements computeAverageBTCPrice() in XXX
    - add     var xxxBTCPrice: number = xxxOrderBook.bTCPrice;
    - use  xxxBTCPrice.push(huobiBTCPrice);*/

  var averageBTCPrice = ArrayManagement.getArrayAverage(btcPriceArray);
  res.send({
      "averagePrice" : averageBTCPrice
    });
}

server.get("/orderBookAveragePrice", getAverageBTCPrice);
server.listen(port, () => {
    console.log(`listening on port ${port}`)
  });