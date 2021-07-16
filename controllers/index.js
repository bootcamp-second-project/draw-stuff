// import express for routes
const router = require('express').Router();
// import our api
const apiRoutes = require('./api')
// tell express to use our api in our routes
router.use('/api', apiRoutes);
// tell express to respond with the h1 tag below
router.use((req, res) => {
  res.send("<h1>Wrong Route!</h1>")
});

// export express as the router
module.exports = router;
