import { OrderBook } from './OrderBook'; 
const Okhttp = require('okhttp');
const ordersLimit = 10;

//represent a Kraken Order Book
export class KrakenOrderBook implements OrderBook
{
    private _bTCPrice: number;

    constructor() 
    {
        this._bTCPrice = 0;
    }

    public get bTCPrice() 
    {
        return this._bTCPrice;
    }

    public set bTCPrice(_bTCPrice: number) 
    {
        this._bTCPrice = _bTCPrice;
    }


    onCompleteKraken(message): number
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

    onErrorKraken(error) 
    {
        console.error(error);
    }

    async computeAverageBTCPrice()
    {
        var url = 'https://api.kraken.com/0/public/Depth?pair=XBTUSDT&count=' + ordersLimit;
        var RequestBuilder = Okhttp.RequestBuilder;
        var krakenBTCPrice = await new RequestBuilder().GET(url).buildAndExecute().then(this.onCompleteKraken).catch(this.onErrorKraken);
        this.bTCPrice = krakenBTCPrice;
    }
}