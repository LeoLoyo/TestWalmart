import moment from 'moment';
import Mongo from 'mongoose';
import babelPolyfill from 'babel-polyfill';

const Schema = Mongo.Schema;

Mongo.Promise = global.Promise;
const url =`mongodb://walmart_user:walmart_pass@ds249415.mlab.com:49415/walmartdb`;
Mongo.connect(url, {useMongoClient: true});

Mongo
    .connection
    .once('open', () => {
        console.log('Connection was Succesfull MongoDB');
    });

let ObjectId = Schema.ObjectId;

var currencySchema = new Schema({id: ObjectId, currency: String, price: Object, timestamp: Date});

let CurrencyModel = Mongo.model('Currency', currencySchema);

export default CurrencyModel;
