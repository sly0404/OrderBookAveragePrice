import { OrderBook } from './OrderBook'; 
const Okhttp = require('okhttp');
const ordersLimit = 10;

export class HuobiOrderBook implements OrderBook
{
    private _bTCPrice: number;

    constructor() 
    {
        this._bTCPrice = 5;
    }

    public get bTCPrice() 
    {
        return this._bTCPrice;
    }

    public set bTCPrice(_bTCPrice: number) 
    {
        this._bTCPrice = _bTCPrice;
    }

    onCompleteHuobi(message)
    {
        var orderBookHuobiJSON = JSON.parse(message.data);
        var orderBookAsks = orderBookHuobiJSON.tick.asks;
        var orderBookBids = orderBookHuobiJSON.tick.bids;
        var bidsAndAsksSum = 0;
        orderBookAsks.forEach(x => bidsAndAsksSum += parseFloat(x[0]));
        orderBookBids.forEach(x => bidsAndAsksSum += parseFloat(x[0]));
        var huobiBTCPrice = bidsAndAsksSum / (orderBookAsks.length + orderBookBids.length);
        return huobiBTCPrice;
    }

    onErrorHuobi(error)
    {
        console.error(error);
    }

    async computeAverageBTCPrice()
    {
        var url = 'https://api.huobi.pro/market/depth?symbol=btcusdt&type=step0&depth=' + ordersLimit;
        var RequestBuilder = Okhttp.RequestBuilder;
        var huobiBTCPrice = await new RequestBuilder().GET(url).buildAndExecute().then(this.onCompleteHuobi).catch(this.onErrorHuobi);
        this.bTCPrice = huobiBTCPrice;
    }
}