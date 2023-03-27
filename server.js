const express = require('express');
const cors = require('cors');
const routes = require('./routes/userroutes');
const errorhandler = require('./middleware/errorhandler');
const dotenv = require('dotenv');
const morgan = require('morgan');
const bodyParser = require('body-parser')
var logger = require('./middleware/logger')

// load env vars
dotenv.config({ path: './config/config.env' });

const app = express();

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.json());

if (process.env.NODE_ENV === 'dev') {
    app.use(morgan('dev'));
}

// Mount routers
app.use('/', routes);
// make sure its after routes
app.use(errorhandler);

module.exports = app;