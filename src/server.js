import Express from 'express';
import Helmet from 'helmet';
import path from 'path';
import {
  Server
} from 'http';
import Cors from 'cors';
import helmet from 'helmet';
import moment from 'moment';
import BodyParser from 'body-parser';
import axios from 'axios';
import Cron from './cryptoService';
import CurrencyModel from './currencyModel';

const app = Express();
const PORT = 8000;
const server = new Server(app);
app.use(Express.static(path.join(__dirname, '../public')));
app.use(helmet());
app.use(Cors());
app.use(BodyParser.urlencoded({
  extended: true
}));

app.use(BodyParser.json());

app.get('/now', async(req, res, next) => {
  const _result = await CurrencyModel
    .find({})
    .sort({
      timestamp: -1
    })
    .limit(3)
    .select({
      _id: 0,
      currency: 1,
      price: 1,
      timestamp: 1
    })
    .exec((err, data) => data);

  res.json(_result);

});

app.post('/api', async(req, res, next) => {
  const {range,interval}=req.body;
  const promise = [];
  if (!['month', 'year', 'day', 'hour'].some(e => e === range) ||  parseInt(interval)>5 ) {
    return res.json({
      success: false,
      content: `los formatos validos son ${ ['month', 'year', 'day', 'hour']} y un maximo de 5 iteraciones`
    })
  }
  let HistoryCurrent = ['BTC', 'ETH', 'DASH'].map(async(each) => {

    let current = {
      currency: each,
      prices: []

    };
    let p = [...await Promise.all([...Array(parseInt(interval)).keys()].reverse().map(async(value, index) => {
      const rangeTime = parseInt((moment().subtract(value, range).valueOf() / 1000), 10);
      const urlFetch = `https://min-api.cryptocompare.com/data/pricehistorical?fsym=${each}&tsyms=BTC,USD,EUR&ts=${rangeTime}`
      let priceTemp = [];
      priceTemp.push(axios.get(urlFetch).then(({
        data
      }) => data[each]?data[each]['USD']:null))

      const _resultPartial = [...await Promise.all(priceTemp)]
      if(_resultPartial[0]){
        return {
          price: _resultPartial.shift().toString()
        }
      }

    }))];
    current.prices = p;

    return current;

  });
  res.json([...await Promise.all(HistoryCurrent)])
});

server.listen(PORT, () => {
  console.log(`Server Running`);
});
