const router = require('express').Router();
const ctr = require('../controller/controller');

router.get("/api/v1/getTickerPrice", ctr.getTickerPrice);
// router.get("/api/v1/getKLines", ctr.getKLines);

module.exports = router;