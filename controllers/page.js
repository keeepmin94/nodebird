const { User, Post } = require("../models");

exports.renderProfile = (req, res, next) => {
  //서비스를 호출
  res.render("profile", { title: "내 정보 - NodeBird" }); //res.locals들과 프론트로 넘겨줄 변수들
};
exports.renderJoin = (req, res, next) => {
  res.render("join", { title: "회원 가입- NodeBird" });
};
exports.renderMain = async (req, res, next) => {
  try {
    const posts = await Post.findAll({
      include: {
        model: User,
        attributes: ["id", "nick"], //비밀번호는 프론트로 보내지 않는다(보안)
      },
      order: [["createdAt", "DESC"]],
    });
    res.render("main", {
      title: "NodeBird",
      twits: posts,
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

//라우터 ->컨트롤러 ->서비스(요청, 응답을 모름)
