const express = require("express");
const router = express.Router();
const { follow } = require("../controllers/user");

const { isLoggedIn, isNotLoggedIn } = require("../middlewares");

// POST /user/follow
router.post("/:id/follow", isLoggedIn, follow);

module.exports = router;
