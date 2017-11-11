import Schedule from 'node-schedule';
import moment from 'moment';
import axios from 'axios';
import babelPolyfill from 'babel-polyfill';
import CurrencyModel from './currencyModel';

const Cron = Schedule.scheduleJob('BuscarPrecios', '0 * * * * *', async() => {

    const promise = [];

    ['BTC', 'ETH', 'DASH'].map((currency, index) => {
        const urlFetch = `https://min-api.cryptocompare.com/data/pricehistorical?fsym=${currency}&tsyms=BTC,USD,EUR&ts=${new Date().getTime()}`;
        promise.push(axios.get(urlFetch).then(({data}) => data));
    });

    [...await Promise.all(promise)].map((currencyFetch) => {

        const [currency] = Object.keys(currencyFetch);

        const price = currencyFetch[currency];
        const Register = new CurrencyModel({
            currency,
            price,
            timestamp: (new Date).getTime()
        })
        Register.save()

    });

});

export default Cron;
