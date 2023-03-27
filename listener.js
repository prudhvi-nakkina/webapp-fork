const app = require('./server');
var logger = require('./middleware/logger')

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => { logger.info('Server started') });
