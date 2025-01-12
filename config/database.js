let mongoose = require('mongoose');
mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost/portalcriptoapi')
.then(() => {
  console.log('Database is connected');
}).catch(err => {
  console.log('Can not connect to the database' + err);
});