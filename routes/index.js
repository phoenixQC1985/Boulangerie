var express = require('express');
var router = express.Router();


const home = require('./controllers/home')
const search = require('./controllers/search')

/* GET home page. */
router.get('/', home)
router.get('/search', search);


module.exports = router;
