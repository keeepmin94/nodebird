const express = require("express");
const router = express.Router();
const {
  renderProfile,
  renderJoin,
  renderMain,
  renderHashtag,
} = require("../controllers/page");
const { isLoggedIn, isNotLoggedIn } = require("../middlewares");

router.use((req, res, next) => {
  //밑에 라우터들에서 공통적으로 쓸 변수 == res.locals
  res.locals.user = req.user;
  res.locals.followerCount = req.user?.Followers?.length || 0;
  res.locals.followingCount = req.user?.Followings?.length || 0;
  res.locals.followingIdList = req.user?.Followings?.map((f) => f.id) || [];
  next();
});

router.get("/profile", isLoggedIn, renderProfile); //Controller분리 (라우터의 마지막 미들웨어 = 컨트롤러)
router.get("/join", isNotLoggedIn, renderJoin);
router.get("/", renderMain);
router.get("/hashtag", renderHashtag);

module.exports = router;
