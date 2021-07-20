// import express for routes
const router = require('express').Router();
// import our api
const apiRoutes = require('./api')
const htmlRoutes = require('./html-route')

router.use('/api', apiRoutes);

router.use('/', htmlRoutes)

router.use((req, res) => {
  res.send("<h1>Wrong Route!</h1>")
});

// export express as the router
module.exports = router;
