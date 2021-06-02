const router = require('express').Router();
const accountController = require('./accountcontroller');

router.use('/account', accountController);

module.exports = router;