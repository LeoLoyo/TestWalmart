'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _helmet = require('helmet');

var _helmet2 = _interopRequireDefault(_helmet);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _http = require('http');

var _cors = require('cors');

var _cors2 = _interopRequireDefault(_cors);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

var _cryptoService = require('./cryptoService');

var _cryptoService2 = _interopRequireDefault(_cryptoService);

var _currencyModel = require('./currencyModel');

var _currencyModel2 = _interopRequireDefault(_currencyModel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var app = (0, _express2.default)();
var PORT = 8000;
var server = new _http.Server(app);
app.use(_express2.default.static(_path2.default.join(__dirname, '../public')));
app.use((0, _helmet2.default)());
app.use((0, _cors2.default)());
app.use(_bodyParser2.default.urlencoded({
  extended: true
}));

app.use(_bodyParser2.default.json());

app.get('/now', function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(req, res, next) {
    var _result;

    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return _currencyModel2.default.find({}).sort({
              timestamp: -1
            }).limit(3).select({
              _id: 0,
              currency: 1,
              price: 1,
              timestamp: 1
            }).exec(function (err, data) {
              return data;
            });

          case 2:
            _result = _context.sent;


            res.json(_result);

          case 4:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined);
  }));

  return function (_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}());

app.post('/api', function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(req, res, next) {
    var _req$body, range, interval, promise, HistoryCurrent;

    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _req$body = req.body, range = _req$body.range, interval = _req$body.interval;
            promise = [];

            if (!(!['month', 'year', 'day', 'hour'].some(function (e) {
              return e === range;
            }) || parseInt(interval) > 5)) {
              _context4.next = 4;
              break;
            }

            return _context4.abrupt('return', res.json({
              success: false,
              content: 'los formatos validos son ' + ['month', 'year', 'day', 'hour'] + ' y un maximo de 5 iteraciones'
            }));

          case 4:
            HistoryCurrent = ['BTC', 'ETH', 'DASH'].map(function () {
              var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(each) {
                var current, p;
                return regeneratorRuntime.wrap(function _callee3$(_context3) {
                  while (1) {
                    switch (_context3.prev = _context3.next) {
                      case 0:
                        current = {
                          currency: each,
                          prices: []

                        };
                        _context3.t0 = [];
                        _context3.t1 = _toConsumableArray;
                        _context3.next = 5;
                        return Promise.all([].concat(_toConsumableArray(Array(parseInt(interval)).keys())).reverse().map(function () {
                          var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(value, index) {
                            var rangeTime, urlFetch, priceTemp, _resultPartial;

                            return regeneratorRuntime.wrap(function _callee2$(_context2) {
                              while (1) {
                                switch (_context2.prev = _context2.next) {
                                  case 0:
                                    rangeTime = parseInt((0, _moment2.default)().subtract(value, range).valueOf() / 1000, 10);
                                    urlFetch = 'https://min-api.cryptocompare.com/data/pricehistorical?fsym=' + each + '&tsyms=BTC,USD,EUR&ts=' + rangeTime;
                                    priceTemp = [];

                                    priceTemp.push(_axios2.default.get(urlFetch).then(function (_ref5) {
                                      var data = _ref5.data;
                                      return data[each] ? data[each]['USD'] : null;
                                    }));

                                    _context2.t0 = [];
                                    _context2.t1 = _toConsumableArray;
                                    _context2.next = 8;
                                    return Promise.all(priceTemp);

                                  case 8:
                                    _context2.t2 = _context2.sent;
                                    _context2.t3 = (0, _context2.t1)(_context2.t2);
                                    _resultPartial = _context2.t0.concat.call(_context2.t0, _context2.t3);

                                    if (!_resultPartial[0]) {
                                      _context2.next = 13;
                                      break;
                                    }

                                    return _context2.abrupt('return', {
                                      price: _resultPartial.shift().toString()
                                    });

                                  case 13:
                                  case 'end':
                                    return _context2.stop();
                                }
                              }
                            }, _callee2, undefined);
                          }));

                          return function (_x8, _x9) {
                            return _ref4.apply(this, arguments);
                          };
                        }()));

                      case 5:
                        _context3.t2 = _context3.sent;
                        _context3.t3 = (0, _context3.t1)(_context3.t2);
                        p = _context3.t0.concat.call(_context3.t0, _context3.t3);

                        current.prices = p;

                        return _context3.abrupt('return', current);

                      case 10:
                      case 'end':
                        return _context3.stop();
                    }
                  }
                }, _callee3, undefined);
              }));

              return function (_x7) {
                return _ref3.apply(this, arguments);
              };
            }());
            _context4.t0 = res;
            _context4.t1 = [];
            _context4.t2 = _toConsumableArray;
            _context4.next = 10;
            return Promise.all(HistoryCurrent);

          case 10:
            _context4.t3 = _context4.sent;
            _context4.t4 = (0, _context4.t2)(_context4.t3);
            _context4.t5 = _context4.t1.concat.call(_context4.t1, _context4.t4);

            _context4.t0.json.call(_context4.t0, _context4.t5);

          case 14:
          case 'end':
            return _context4.stop();
        }
      }
    }, _callee4, undefined);
  }));

  return function (_x4, _x5, _x6) {
    return _ref2.apply(this, arguments);
  };
}());

server.listen(PORT, function () {
  console.log('Server Running');
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9zZXJ2ZXIuanMiXSwibmFtZXMiOlsiYXBwIiwiUE9SVCIsInNlcnZlciIsInVzZSIsInN0YXRpYyIsImpvaW4iLCJfX2Rpcm5hbWUiLCJ1cmxlbmNvZGVkIiwiZXh0ZW5kZWQiLCJqc29uIiwiZ2V0IiwicmVxIiwicmVzIiwibmV4dCIsImZpbmQiLCJzb3J0IiwidGltZXN0YW1wIiwibGltaXQiLCJzZWxlY3QiLCJfaWQiLCJjdXJyZW5jeSIsInByaWNlIiwiZXhlYyIsImVyciIsImRhdGEiLCJfcmVzdWx0IiwicG9zdCIsImJvZHkiLCJyYW5nZSIsImludGVydmFsIiwicHJvbWlzZSIsInNvbWUiLCJlIiwicGFyc2VJbnQiLCJzdWNjZXNzIiwiY29udGVudCIsIkhpc3RvcnlDdXJyZW50IiwibWFwIiwiZWFjaCIsImN1cnJlbnQiLCJwcmljZXMiLCJQcm9taXNlIiwiYWxsIiwiQXJyYXkiLCJrZXlzIiwicmV2ZXJzZSIsInZhbHVlIiwiaW5kZXgiLCJyYW5nZVRpbWUiLCJzdWJ0cmFjdCIsInZhbHVlT2YiLCJ1cmxGZXRjaCIsInByaWNlVGVtcCIsInB1c2giLCJ0aGVuIiwiX3Jlc3VsdFBhcnRpYWwiLCJzaGlmdCIsInRvU3RyaW5nIiwicCIsImxpc3RlbiIsImNvbnNvbGUiLCJsb2ciXSwibWFwcGluZ3MiOiI7O0FBQUE7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7O0FBR0E7Ozs7QUFFQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7Ozs7O0FBRUEsSUFBTUEsTUFBTSx3QkFBWjtBQUNBLElBQU1DLE9BQU8sSUFBYjtBQUNBLElBQU1DLFNBQVMsaUJBQVdGLEdBQVgsQ0FBZjtBQUNBQSxJQUFJRyxHQUFKLENBQVEsa0JBQVFDLE1BQVIsQ0FBZSxlQUFLQyxJQUFMLENBQVVDLFNBQVYsRUFBcUIsV0FBckIsQ0FBZixDQUFSO0FBQ0FOLElBQUlHLEdBQUosQ0FBUSx1QkFBUjtBQUNBSCxJQUFJRyxHQUFKLENBQVEscUJB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QWY7O0FBSmdGO0FBQUE7QUFBQTtBQUFBLDJDQVEvQ0csUUFBUUMsR0FBUixDQUFZVSxTQUFaLENBUitDOztBQUFBO0FBQUE7QUFBQTtBQVExRUcsa0RBUjBFOztBQUFBLHlDQVM3RUEsZUFBZSxDQUFmLENBVDZFO0FBQUE7QUFBQTtBQUFBOztBQUFBLHNFQVV2RTtBQUNMbEMsNkNBQU9rQyxlQUFlQyxLQUFmLEdBQXVCQyxRQUF2QjtBQURGLHFDQVZ1RTs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSwyQkFBcEQ7O0FBQUE7QUFBQTtBQUFBO0FBQUEsNEJBQVosQ0FQNEI7O0FBQUE7QUFBQTtBQUFBO0FBTzFDQyx5QkFQMEM7O0FBdUI5Q25CLGdDQUFRQyxNQUFSLEdBQWlCa0IsQ0FBakI7O0FBdkI4QywwREF5QnZDbkIsT0F6QnVDOztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLGVBQTNCOztBQUFBO0FBQUE7QUFBQTtBQUFBLGdCQVROO0FBQUEsMkJBcUNmM0IsR0FyQ2U7QUFBQTtBQUFBO0FBQUE7QUFBQSxtQkFxQ0k2QixRQUFRQyxHQUFSLENBQVlOLGNBQVosQ0FyQ0o7O0FBQUE7QUFBQTtBQUFBO0FBQUE7O0FBQUEseUJBcUNYM0IsSUFyQ1c7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsR0FBakI7O0FBQUE7QUFBQTtBQUFBO0FBQUE7O0FBd0NBUCxPQUFPeUQsTUFBUCxDQUFjMUQsSUFBZCxFQUFvQixZQUFNO0FBQ3hCMkQsVUFBUUMsR0FBUjtBQUNELENBRkQiLCJmaWxlIjoic2VydmVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEV4cHJlc3MgZnJvbSAnZXhwcmVzcyc7XG5pbXBvcnQgSGVsbWV0IGZyb20gJ2hlbG1ldCc7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCB7XG4gIFNlcnZlclxufSBmcm9tICdodHRwJztcbmltcG9ydCBDb3JzIGZyb20gJ2NvcnMnO1xuaW1wb3J0IGhlbG1ldCBmcm9tICdoZWxtZXQnO1xuaW1wb3J0IG1vbWVudCBmcm9tICdtb21lbnQnO1xuaW1wb3J0IEJvZHlQYXJzZXIgZnJvbSAnYm9keS1wYXJzZXInO1xuaW1wb3J0IGF4aW9zIGZyb20gJ2F4aW9zJztcbmltcG9ydCBDcm9uIGZyb20gJy4vY3J5cHRvU2VydmljZSc7XG5pbXBvcnQgQ3VycmVuY3lNb2RlbCBmcm9tICcuL2N1cnJlbmN5TW9kZWwnO1xuXG5jb25zdCBhcHAgPSBFeHByZXNzKCk7XG5jb25zdCBQT1JUID0gODAwMDtcbmNvbnN0IHNlcnZlciA9IG5ldyBTZXJ2ZXIoYXBwKTtcbmFwcC51c2UoRXhwcmVzcy5zdGF0aWMocGF0aC5qb2luKF9fZGlybmFtZSwgJy4uL3B1YmxpYycpKSk7XG5hcHAudXNlKGhlbG1ldCgpKTtcbmFwcC51c2UoQ29ycygpKTtcbmFwcC51c2UoQm9keVBhcnNlci51cmxlbmNvZGVkKHtcbiAgZXh0ZW5kZWQ6IHRydWVcbn0pKTtcblxuYXBwLnVzZShCb2R5UGFyc2VyLmpzb24oKSk7XG5cbmFwcC5nZXQoJy9ub3cnLCBhc3luYyhyZXEsIHJlcywgbmV4dCkgPT4ge1xuICBjb25zdCBfcmVzdWx0ID0gYXdhaXQgQ3VycmVuY3lNb2RlbFxuICAgIC5maW5kKHt9KVxuICAgIC5zb3J0KHtcbiAgICAgIHRpbWVzdGFtcDogLTFcbiAgICB9KVxuICAgIC5saW1pdCgzKVxuICAgIC5zZWxlY3Qoe1xuICAgICAgX2lkOiAwLFxuICAgICAgY3VycmVuY3k6IDEsXG4gICAgICBwcmljZTogMSxcbiAgICAgIHRpbWVzdGFtcDogMVxuICAgIH0pXG4gICAgLmV4ZWMoKGVyciwgZGF0YSkgPT4gZGF0YSk7XG5cbiAgcmVzLmpzb24oX3Jlc3VsdCk7XG5cbn0pO1xuXG5hcHAucG9zdCgnL2FwaScsIGFzeW5jKHJlcSwgcmVzLCBuZXh0KSA9PiB7XG4gIGNvbnN0IHtyYW5nZSxpbnRlcnZhbH09cmVxLmJvZHk7XG4gIGNvbnN0IHByb21pc2UgPSBbXTtcbiAgaWYgKCFbJ21vbnRoJywgJ3llYXInLCAnZGF5JywgJ2hvdXInXS5zb21lKGUgPT4gZSA9PT0gcmFuZ2UpIHx8ICBwYXJzZUludChpbnRlcnZhbCk+NSApIHtcbiAgICByZXR1cm4gcmVzLmpzb24oe1xuICAgICAgc3VjY2VzczogZmFsc2UsXG4gICAgICBjb250ZW50OiBgbG9zIGZvcm1hdG9zIHZhbGlkb3Mgc29uICR7IFsnbW9udGgnLCAneWVhcicsICdkYXknLCAnaG91ciddfSB5IHVuIG1heGltbyBkZSA1IGl0ZXJhY2lvbmVzYFxuICAgIH0pXG4gIH1cbiAgbGV0IEhpc3RvcnlDdXJyZW50ID0gWydCVEMnLCAnRVRIJywgJ0RBU0gnXS5tYXAoYXN5bmMoZWFjaCkgPT4ge1xuXG4gICAgbGV0IGN1cnJlbnQgPSB7XG4gICAgICBjdXJyZW5jeTogZWFjaCxcbiAgICAgIHByaWNlczogW11cblxuICAgIH07XG4gICAgbGV0IHAgPSBbLi4uYXdhaXQgUHJvbWlzZS5hbGwoWy4uLkFycmF5KHBhcnNlSW50KGludGVydmFsKSkua2V5cygpXS5yZXZlcnNlKCkubWFwKGFzeW5jKHZhbHVlLCBpbmRleCkgPT4ge1xuICAgICAgY29uc3QgcmFuZ2VUaW1lID0gcGFyc2VJbnQoKG1vbWVudCgpLnN1YnRyYWN0KHZhbHVlLCByYW5nZSkudmFsdWVPZigpIC8gMTAwMCksIDEwKTtcbiAgICAgIGNvbnN0IHVybEZldGNoID0gYGh0dHBzOi8vbWluLWFwaS5jcnlwdG9jb21wYXJlLmNvbS9kYXRhL3ByaWNlaGlzdG9yaWNhbD9mc3ltPSR7ZWFjaH0mdHN5bXM9QlRDLFVTRCxFVVImdHM9JHtyYW5nZVRpbWV9YFxuICAgICAgbGV0IHByaWNlVGVtcCA9IFtdO1xuICAgICAgcHJpY2VUZW1wLnB1c2goYXhpb3MuZ2V0KHVybEZldGNoKS50aGVuKCh7XG4gICAgICAgIGRhdGFcbiAgICAgIH0pID0+IGRhdGFbZWFjaF0/ZGF0YVtlYWNoXVsnVVNEJ106bnVsbCkpXG5cbiAgICAgIGNvbnN0IF9yZXN1bHRQYXJ0aWFsID0gWy4uLmF3YWl0IFByb21pc2UuYWxsKHByaWNlVGVtcCldXG4gICAgICBpZihfcmVzdWx0UGFydGlhbFswXSl7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgcHJpY2U6IF9yZXN1bHRQYXJ0aWFsLnNoaWZ0KCkudG9TdHJpbmcoKVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICB9KSldO1xuICAgIGN1cnJlbnQucHJpY2VzID0gcDtcblxuICAgIHJldHVybiBjdXJyZW50O1xuXG4gIH0pO1xuICByZXMuanNvbihbLi4uYXdhaXQgUHJvbWlzZS5hbGwoSGlzdG9yeUN1cnJlbnQpXSlcbn0pO1xuXG5zZXJ2ZXIubGlzdGVuKFBPUlQsICgpID0+IHtcbiAgY29uc29sZS5sb2coYFNlcnZlciBSdW5uaW5nYCk7XG59KTtcbiJdfQ==