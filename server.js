const express = require('express');
const cors = require('cors');
const routes = require('./routes/userroutes');
const errorhandler = require('./middleware/errorhandler');
const app = express();

app.use(cors());

app.use(express.json());

// Mount routers
app.use('/', routes);
// make sure its after routes
app.use(errorhandler);

const server = app.listen(5000);