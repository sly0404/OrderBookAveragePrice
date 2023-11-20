function getArrayAverage(btcPriceArray)
{ 
  var btcPriceSum = 0;
  btcPriceArray.forEach(x => btcPriceSum += x);
  var arrayAverage = btcPriceSum / btcPriceArray.length;
  return arrayAverage;
}


module.exports = { getArrayAverage };