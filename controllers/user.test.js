jest.mock("../models/user");
const User = require("../models/user");
const { follow } = require("./user");

describe("follow", () => {
  test("user가 있는 경우 addFollowing추가 후 success 반환", async () => {
    const req = {
      user: { id: 1 },
      params: { id: 2 },
    };
    const res = {
      send: jest.fn(),
    };
    const next = jest.fn();

    User.findOne.mockReturnValue({
      addFollowing(id) {
        return Promise.resolve(true);
      },
    });
    await follow(req, res, next);
    expect(res.send).toBeCalledWith("success");
  });

  test("user가 없는 경우 404 에러", async () => {
    const req = {
      user: { id: 1 },
      params: { id: 2 },
    };
    const res = {
      send: jest.fn(),
      status: jest.fn(() => res),
    };
    const next = jest.fn();
    User.findOne.mockReturnValue(null);
    await follow(req, res, next);
    expect(res.status).toBeCalledWith(404);
    expect(res.send).toBeCalledWith("no user");
  });
  test("DB에서 에러나면 next(error) 호출함", async () => {
    const req = {
      user: { id: 1 },
      params: { id: 2 },
    };
    const res = {};
    const next = jest.fn();
    const message = "DB에러";
    User.findOne.mockReturnValue(Promise.reject(message));
    await follow(req, res, next);
    expect(next).toBeCalledWith(message);
  });
});
