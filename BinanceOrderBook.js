"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BinanceOrderBook = void 0;
var WebSocket = require('ws');
var ordersLimit = 10;
var BinanceOrderBook = /** @class */ (function () {
    function BinanceOrderBook() {
        this._bTCPrice = 5;
    }
    Object.defineProperty(BinanceOrderBook.prototype, "bTCPrice", {
        get: function () {
            return this._bTCPrice;
        },
        set: function (_bTCPrice) {
            this._bTCPrice = _bTCPrice;
        },
        enumerable: false,
        configurable: true
    });
    BinanceOrderBook.prototype.getRawDataFromSocket = function (resolve, reject) {
        var ws = new WebSocket('wss://ws-api.binance.com:443/ws-api/v3');
        ws.onopen = function () {
            ws.send(JSON.stringify({
                id: '51e2affb-0aba-4821-ba75-f2625006eb43',
                params: { symbol: "BTCUSDT", "limit": ordersLimit },
                method: "depth"
            }));
        };
        ws.onerror = function (e) { return reject('error = ' + e); };
        ws.onmessage = function (e) {
            var orderBookBinanceJSON = JSON.parse(e.data);
            var orderBookAsks = orderBookBinanceJSON.result.asks;
            var orderBookBids = orderBookBinanceJSON.result.bids;
            var bidsAndAsksSum = 0;
            orderBookAsks.forEach(function (x) { return bidsAndAsksSum += parseFloat(x[0]); });
            orderBookBids.forEach(function (x) { return bidsAndAsksSum += parseFloat(x[0]); });
            var binanceBTCPrice = bidsAndAsksSum / (orderBookAsks.length + orderBookBids.length);
            resolve(binanceBTCPrice);
        };
    };
    BinanceOrderBook.prototype.getBinanceBTCPricePromise = function () {
        return new Promise(this.getRawDataFromSocket);
    };
    BinanceOrderBook.prototype.computeAverageBTCPrice = function () {
        return __awaiter(this, void 0, void 0, function () {
            var binanceBTCPrice;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getBinanceBTCPricePromise().then(function (x) { return x; })];
                    case 1:
                        binanceBTCPrice = _a.sent();
                        this.bTCPrice = binanceBTCPrice;
                        return [2 /*return*/];
                }
            });
        });
    };
    return BinanceOrderBook;
}());
exports.BinanceOrderBook = BinanceOrderBook;
