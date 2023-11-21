import { OrderBook } from './OrderBook'; 
const WebSocket = require('ws');
const ordersLimit = 10;

export class BinanceOrderBook implements OrderBook
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


    getRawDataFromSocket(resolve, reject)
    {
        const ws = new WebSocket('wss://ws-api.binance.com:443/ws-api/v3');
        ws.onopen = () => {
            ws.send(JSON.stringify({
                id: '51e2affb-0aba-4821-ba75-f2625006eb43',
                params: { symbol: "BTCUSDT", "limit": ordersLimit },
                method: "depth"
            }));
        };
        ws.onerror = (e) => reject('error = ' + e);
        ws.onmessage = (e) => {
            var orderBookBinanceJSON = JSON.parse(e.data);
            var orderBookAsks = orderBookBinanceJSON.result.asks;
            var orderBookBids = orderBookBinanceJSON.result.bids;
            var bidsAndAsksSum = 0;
            orderBookAsks.forEach(x => bidsAndAsksSum += parseFloat(x[0]));
            orderBookBids.forEach(x => bidsAndAsksSum += parseFloat(x[0]));
            var binanceBTCPrice = bidsAndAsksSum / (orderBookAsks.length + orderBookBids.length);
            resolve(binanceBTCPrice);
            }
    }

    getBinanceBTCPricePromise()
    {
        return new Promise(this.getRawDataFromSocket);
    }

    async computeAverageBTCPrice()
    { 
        var binanceBTCPrice = await this.getBinanceBTCPricePromise().then(x => x);
        this.bTCPrice = binanceBTCPrice as number;
    }
}
    