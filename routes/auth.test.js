// const request = require("supertest");
// const { sequelize } = require("../models");
// const app = require("../app");

// beforeAll(async () => {
//   await sequelize.sync();
// });

// describe("POST /join", () => {
//   test("로그인 안 했으면 가입", (done) => {
//     request(app)
//       .post("/auth/join")
//       .send({
//         email: "wjdwkjh@gmail.com",
//         nick: "ll",
//         password: "1111",
//       })
//       .expect("Location", "/")
//       .expect(302, done);
//   });
// });

// describe("POST /join", () => {
//   const agent = request.agent(app);
//   beforeEach((done) => {
//     agent
//       .post("/auth/login")
//       .send({
//         email: "wjdwkjh@gmail.com",
//         password: "1111",
//       })
//       .end(done);
//   });

//   test("이미 로그인했으면 redirect /", (done) => {
//     const message = encodeURIComponent("로그인한 상태입니다.");
//     agent
//       .post("/auth/join")
//       .send({
//         email: "wjdwkjh94@gmail.com",
//         nick: "ll",
//         password: "1111",
//       })
//       .expect("Location", `/?error=${message}`)
//       .expect(302, done);
//   });
// });

// describe("POST /login", () => {
//   test("가입되지 않은 회원", (done) => {
//     const message = encodeURIComponent("가입되지 않은 회원입니다.");
//     request(app)
//       .post("/auth/login")
//       .send({
//         email: "wjdwkjh94@gmail.com",
//         password: "1111",
//       })
//       .expect("Location", `/?error=${message}`)
//       .expect(302, done);
//   });

//   test("로그인 수행", (done) => {
//     request(app)
//       .post("/auth/login")
//       .send({
//         email: "wjdwkjh94@gmail.com",
//         password: "1111",
//       })
//       .expect("Location", "/")
//       .expect(302, done);
//   });

//   test("비밀번호 틀림", (done) => {
//     const message = encodeURIComponent("비밀먼보가 일치하지 않습니다.");
//     request(app)
//       .post("/auth/login")
//       .send({
//         email: "wjdwkjh94@gmail.com",
//         password: "1",
//       })
//       .expect("Location", `/?error=${message}`)
//       .expect(302, done);
//   });
// });

// describe("GET /logout", () => {
//   test("로그인 되어있지 않으면 403", (done) => {
//     request(app).get("/auth/logout").expect(403, done);
//   });

//   const agent = request.agent(app);
//   beforeEach((done) => {
//     agent
//       .post("/auth/login")
//       .send({
//         email: "wjdwkjh94@gmail.com",
//         password: "1111",
//       })
//       .end(done);
//   });

//   test("로그아웃 수행", (done) => {
//     agent.get("/auth/logout").expect("Location", `/`).expect(302, done);
//   });
// });

// afterAll(async () => {
//   await sequelize.sync({ force: true });
// });

//---------------

const app = require("../app");
const request = require("supertest");
const { sequelize } = require("../models");

//아예 디비쪽까지 전부다 확인하는 테스트

//서버를 실행한게 아니기 때문에 (모든)테스트 전에 매번 디비 연결
beforeAll(async () => {
  await sequelize.sync({ force: true }); //기존 찌꺼기 날리고 새로 생성
});

//beforeEch (각 함수가 실행되기 전)

describe("POST /join", () => {
  test("로그인 안했으면 가입", (done) => {
    request(app)
      .post("/auth/join")
      .send({
        email: "wjdwkjh94@gmail.com",
        nick: "ll",
        password: "1111",
      })
      .expect("Location", "/") // ==> return res.redirect('/')
      .expect(302, done);
  });

  test("회원가입 되어있는데 또 시도", (done) => {
    request(app)
      .post("/auth/join")
      .send({
        email: "wjdwkjh94@gmail.com",
        nick: "ll",
        password: "1111",
      })
      .expect("Location", "/join?error=exist") // ==> return res.redirect('/')
      .expect(302, done);
  });
});

//새로 분리한 이유는 이 테스트 경우 전에만 로그인 하고싶은데 그냥 beforeEach쓰면 모든 POST /join 테스트 전에 실행
describe("POST /join", () => {
  const agent = request.agent(app); //변수로 분리할 경우 request.agent로 따로 만듦
  beforeEach((done) => {
    //로그인
    agent
      .post("/auth/login")
      .send({
        email: "wjdwkjh94@gmail.com",
        password: "1111",
      })
      .end(done);
  });

  test("로그인 상태로 회원가입 시도", (done) => {
    const message = encodeURIComponent("로그인한 상태입니다.");
    agent
      .post("/auth/join")
      .send({
        email: "wjdwkjh94@gmail.com",
        nick: "ll",
        password: "1111",
      })
      .expect("Location", `/?error=${message}`)
      .expect(302, done);
  });
});

describe("POST /login", () => {
  test("로그인 수행", (done) => {
    request(app)
      .post("/auth/login")
      .send({
        email: "wjdwkjh94@gmail.com",
        password: "1111",
      })
      .expect("Location", "/")
      .expect(302, done); //비동기 done 호출을 해줘야 jest가 테스트가 끝났는지 앎
  });
});

//afterAll, afterEach
