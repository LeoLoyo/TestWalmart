'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _nodeSchedule = require('node-schedule');

var _nodeSchedule2 = _interopRequireDefault(_nodeSchedule);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

var _babelPolyfill = require('babel-polyfill');

var _babelPolyfill2 = _interopRequireDefault(_babelPolyfill);

var _currencyModel = require('./currencyModel');

var _currencyModel2 = _interopRequireDefault(_currencyModel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var Cron = _nodeSchedule2.default.scheduleJob('BuscarPrecios', '0 * * * * *', _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
    var promise;
    return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
            switch (_context.prev = _context.next) {
                case 0:
                    promise = [];


                    ['BTC', 'ETH', 'DASH'].map(function (currency, index) {
                        var urlFetch = 'https://min-api.cryptocompare.com/data/pricehistorical?fsym=' + currency + '&tsyms=BTC,USD,EUR&ts=' + new Date().getTime();
                        promise.push(_axios2.default.get(urlFetch).then(function (_ref2) {
                            var data = _ref2.data;
                            return data;
                        }));
                    });

                    _context.t0 = [];
                    _context.t1 = _toConsumableArray;
                    _context.next = 6;
                    return Promise.all(promise);

                case 6:
                    _context.t2 = _context.sent;
                    _context.t3 = (0, _context.t1)(_context.t2);

                    _context.t4 = function (currencyFetch) {
                        var _Object$keys = Object.keys(currencyFetch),
                            _Object$keys2 = _slicedToArray(_Object$keys, 1),
                            currency = _Object$keys2[0];

                        var price = currencyFetch[currency];
                        var Register = new _currencyModel2.default({
                            currency: currency,
                            price: price,
                            timestamp: new Date().getTime()
                        });
                        Register.save();
                    };

                    _context.t0.concat.call(_context.t0, _context.t3).map(_context.t4);

                case 10:
                case 'end':
                    return _context.stop();
            }
        }
    }, _callee, undefined);
})));

exports.default = Cron;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9jcnlwdG9TZXJ2aWNlLmpzIl0sIm5hbWVzIjpbIkNyb24iLCJzY2hlZHVsZUpvYiIsInByb21pc2UiLCJtYXAiLCJjdXJyZW5jeSIsImluZGV4IiwidXJsRmV0Y2giLCJEYXRlIiwiZ2V0VGltZSIsInB1c2giLCJnZXQiLCJ0aGVuIiwiZGF0YSIsIlByb21pc2UiLCJhbGwiLCJjdXJyZW5jeUZldGNoIiwiT2JqZWN0Iiwia2V5cyIsInByaWNlIiwiUmVnaXN0ZXIiLCJ0aW1lc3RhbXAiLCJzYXZlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7Ozs7Ozs7QUFFQSxJQUFNQSxPQUFPLHVCQUFTQyxXQUFULENBQXFCLGVBQXJCLEVBQXNDLGFBQXRDLDBEQUFxRDtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFFeERDLDJCQUZ3RCxHQUU5QyxFQUY4Qzs7O0FBSTlELHFCQUFDLEtBQUQsRUFBUSxLQUFSLEVBQWUsTUFBZixFQUF1QkMsR0FBdkIsQ0FBMkIsVUFBQ0MsUUFBRCxFQUFXQyxLQUFYLEVBQXFCO0FBQzVDLDRCQUFNQyw0RUFBMEVGLFFBQTFFLDhCQUEyRyxJQUFJRyxJQUFKLEdBQVdDLE9BQVgsRUFBakg7QUFDQU4sZ0NBQVFPLElBQVIsQ0FBYSxnQkFBTUMsR0FBTixDQUFVSixRQUFWLEVBQW9CSyxJQUFwQixDQUF5QjtBQUFBLGdDQUFFQyxJQUFGLFNBQUVBLElBQUY7QUFBQSxtQ0FBWUEsSUFBWjtBQUFBLHlCQUF6QixDQUFiO0FBQ0gscUJBSEQ7O0FBSjhEO0FBQUE7QUFBQTtBQUFBLDJCQVNwREMsUUFBUUMsR0FBUixDQUFZWixPQUFaLENBVG9EOztBQUFBO0FBQUE7QUFBQTs7QUFBQSxrQ0FTMUIsVUFBQ2EsYUFBRCxFQUFtQjtBQUFBLDJDQUVoQ0MsT0FBT0MsSUFBUCxDQUFZRixhQUFaLENBRmdDO0FBQUE7QUFBQSw0QkFFNUNYLFFBRjRDOztBQUluRCw0QkFBTWMsUUFBUUgsY0FBY1gsUUFBZCxDQUFkO0FBQ0EsNEJBQU1lLFdBQVcsNEJBQWtCO0FBQy9CZiw4Q0FEK0I7QUFFL0JjLHdDQUYrQjtBQUcvQkUsdUNBQVksSUFBSWIsSUFBSixFQUFELENBQVdDLE9BQVg7QUFIb0IseUJBQWxCLENBQWpCO0FBS0FXLGlDQUFTRSxJQUFUO0FBRUgscUJBckI2RDs7QUFBQSxzRUFTOUJsQixHQVQ4Qjs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxDQUFyRCxHQUFiOztrQkF5QmVILEkiLCJmaWxlIjoiY3J5cHRvU2VydmljZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBTY2hlZHVsZSBmcm9tICdub2RlLXNjaGVkdWxlJztcbmltcG9ydCBtb21lbnQgZnJvbSAnbW9tZW50JztcbmltcG9ydCBheGlvcyBmcm9tICdheGlvcyc7XG5pbXBvcnQgYmFiZWxQb2x5ZmlsbCBmcm9tICdiYWJlbC1wb2x5ZmlsbCc7XG5pbXBvcnQgQ3VycmVuY3lNb2RlbCBmcm9tICcuL2N1cnJlbmN5TW9kZWwnO1xuXG5jb25zdCBDcm9uID0gU2NoZWR1bGUuc2NoZWR1bGVKb2IoJ0J1c2NhclByZWNpb3MnLCAnMCAqICogKiAqIConLCBhc3luYygpID0+IHtcblxuICAgIGNvbnN0IHByb21pc2UgPSBbXTtcblxuICAgIFsnQlRDJywgJ0VUSCcsICdEQVNIJ10ubWFwKChjdXJyZW5jeSwgaW5kZXgpID0+IHtcbiAgICAgICAgY29uc3QgdXJsRmV0Y2ggPSBgaHR0cHM6Ly9taW4tYXBpLmNyeXB0b2NvbXBhcmUuY29tL2RhdGEvcHJpY2VoaXN0b3JpY2FsP2ZzeW09JHtjdXJyZW5jeX0mdHN5bXM9QlRDLFVTRCxFVVImdHM9JHtuZXcgRGF0ZSgpLmdldFRpbWUoKX1gO1xuICAgICAgICBwcm9taXNlLnB1c2goYXhpb3MuZ2V0KHVybEZldGNoKS50aGVuKCh7ZGF0YX0pID0+IGRhdGEpKTtcbiAgICB9KTtcblxuICAgIFsuLi5hd2FpdCBQcm9taXNlLmFsbChwcm9taXNlKV0ubWFwKChjdXJyZW5jeUZldGNoKSA9PiB7XG5cbiAgICAgICAgY29uc3QgW2N1cnJlbmN5XSA9IE9iamVjdC5rZXlzKGN1cnJlbmN5RmV0Y2gpO1xuXG4gICAgICAgIGNvbnN0IHByaWNlID0gY3VycmVuY3lGZXRjaFtjdXJyZW5jeV07XG4gICAgICAgIGNvbnN0IFJlZ2lzdGVyID0gbmV3IEN1cnJlbmN5TW9kZWwoe1xuICAgICAgICAgICAgY3VycmVuY3ksXG4gICAgICAgICAgICBwcmljZSxcbiAgICAgICAgICAgIHRpbWVzdGFtcDogKG5ldyBEYXRlKS5nZXRUaW1lKClcbiAgICAgICAgfSlcbiAgICAgICAgUmVnaXN0ZXIuc2F2ZSgpXG5cbiAgICB9KTtcblxufSk7XG5cbmV4cG9ydCBkZWZhdWx0IENyb247XG4iXX0=