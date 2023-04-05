const Post = require("../models/post");
const Hashtag = require("../models/hashtag");

exports.afterUploadImage = (req, res) => {
  console.log(req.file);
  res.json({ url: `/img/${req.file.filename}` });
};
exports.uploadPost = async (req, res, next) => {
  try {
    // 프론트에서 주는 정보(프론트와 정해야함) => req.body.content, req.body.url
    const post = await Post.create({
      content: req.body.content,
      img: req.body.url,
      UserId: req.user.id,
    });
    const hashtags = req.body.content.match(/#[^\s#]*/g); //정규표현식으로 #추출
    if (hashtags) {
      const result = await Promise.all(
        //findOrCreate가 promise라서 promise배열 처리
        hashtags.map((tag) => {
          return Hashtag.findOrCreate({
            //sequelize에서 제공하는 기존 데이터가있으면 찾아오고 없으면 만들어서 가져옴(공식문서 참조)
            where: { title: tag.slice(1).toLowerCase() },
          });
        })
      );
      console.log("result", result);
      await post.addHashtags(result.map((r) => r[0])); //가죠온 hashtag와 poast연결
    }
    res.redirect("/");
  } catch (error) {
    console.error(error);
    next(error);
  }
};
