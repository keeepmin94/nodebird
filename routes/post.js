const express = require("express");
const router = express.Router();
const { isLoggedIn, isNotLoggedIn } = require("../middlewares");
const fs = require("fs");
const multer = require("multer");
const { afterUploadImage, uploadPost } = require("../controllers/post");
const path = require("path");

try {
  fs.readdirSync("uploads"); //uploads파일 있는지 체크
} catch (error) {
  fs.mkdirSync("uploads");
}

const upload = multer({
  //이미지를 서버 디스크에 저장
  storage: multer.diskStorage({
    //저장 경로
    destination(req, file, cb) {
      cb(null, "uploads/"); //uploads폴더에 저장하겠다
    },
    //저장 파일명
    filename(req, file, cb) {
      const ext = path.extname(file.originalname); //확장자 추출 console.log(file)로 구조 확인하기
      cb(null, path.basename(file.originalname, ext) + Date.now() + ext); //이미지.png -> 이미지20230329104301.png
    },
  }),
  limits: { fileSize: 20 * 1024 * 124 }, //파일 최대 용량
});

//브라우저 말고도 업로드 할 방법이 많기 때문에 항상 서버에서 막아주자(isLoggedIn) || upload.single(‘img’): 요청 본문의 img에 담긴 이미지 하나를 읽어 설정대로 저장하는 미들웨어
router.post("/img", isLoggedIn, upload.single("img"), afterUploadImage);

const upload2 = multer(); //upload와 설정이 달라서 새로 만듦
router.post("/", isLoggedIn, upload2.none(), uploadPost);

module.exports = router;
