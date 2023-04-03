const express = require("express");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const path = require("path");
const session = require("express-session");
const nunjucks = require("nunjucks"); //추후 리엑트로 변경
const dotenv = require("dotenv");
//process.env.COOKIE_SECRET 없음
dotenv.config();
//process.env.COOKIE_SECRET 있음
const pageRouter = require("./routes/page");
const { sequelize } = require("./models");

const app = express(); //공식문서 가서 읽고 사용
app.set("port", process.env.PORT || 8001);
app.set("view engine", "html");
nunjucks.configure("views", {
  express: app,
  watch: true,
});

sequelize
  .sync({ force: false })
  .then(() => {
    console.log("데이터베이스 연결 성공");
  })
  .catch((err) => {
    console.error(err);
  });

app.use(morgan("dev")); //로그용
app.use(express.static(path.join(__dirname, "public"))); //front에서 자유롭게 public파일에 접근할수있게
app.use(express.json()); //bodyParser json
app.use(express.urlencoded({ extended: false })); //bodyParser form
app.use(cookieParser(process.env.COOKIE_SECRET)); //cookieParser
app.use(
  session({
    //공식문서가서 확인
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
      httpOnly: true, //자바스크립트에서 접근 못하게(보안)
      secure: false, //https 적용시 true
    },
  })
);

app.use("/", pageRouter);

app.use((req, res, next) => {
  //404 전용(없는 라우터)
  const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
  error.status = 404;
  next(error);
});

//에러처리 미들웨어(4개의 매개변수)
app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = process.env.NODE_ENV !== "production" ? err : {}; //베포모드|개발모드 일때 에러 출력(보안) /(베포 모드시 에러 전용 로그 기록)
  res.status(err.status || 500);
  res.render("error");
});

app.listen(app.get("port"), () => {
  console.log(app.get("port"), "번 포트에서 대기중");
});