const { isLoggedIn, isNotLoggedIn } = require("./");

describe("isLogginedIn 함수 테스트", () => {
  //그룹 지정(같은 함수)

  const res = {
    status: jest.fn(() => res),
    send: jest.fn(),
  };
  const next = jest.fn(); //jest 제공 함수(추적 가능)
  test("로그인되어 있으면 isLogginedIn이 next를 호출해야함", () => {
    //moking(가짜로 req, res, next만들기)

    const req = {
      isAuthenticated: jest.fn(() => true),
    };

    isLoggedIn(req, res, next); //isLoggedIn 호출
    expect(next).toBeCalledTimes(1); //next란 함수가 1번 호출 되었는는가?
  });

  test("로그인되어 있지 않으면 isLogginedIn이 Error를 호출해야함", () => {
    const req = {
      isAuthenticated: jest.fn(() => false),
    };

    isLoggedIn(req, res, next);
    expect(res.status).toBeCalledWith(403);
    expect(res.send).toBeCalledWith("로그인 필요");
  });
});

describe("isNotLoggedIn", () => {
  const res = {
    redirect: jest.fn(),
  };
  const next = jest.fn();

  test("로그인 되어있으면 isNotLoggedIn이 에러를 응답해야 함", () => {
    const req = {
      isAuthenticated: jest.fn(() => true),
    };
    isNotLoggedIn(req, res, next);
    const message = encodeURIComponent("로그인한 상태입니다.");
    expect(res.redirect).toBeCalledWith(`/?error=${message}`);
  });

  test("로그인 되어있지 않으면 isNotLoggedIn이 next를 호출해야 함", () => {
    const req = {
      isAuthenticated: jest.fn(() => false),
    };
    isNotLoggedIn(req, res, next);
    expect(next).toHaveBeenCalledTimes(1);
  });
});
