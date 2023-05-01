jest.mock("../models/user");
const User = require("../models/user");
const { follow } = require("./user");

describe("follow", () => {
  test("user가 있는 경우 addFollowing추가 후 success 반환", async () => {
    User.findOne.mockReturnValue({
      addFollowing(id) {
        return Promise.resolve(true);
      },
    });
    const result = await follow(1, 2);
    expect(result).toEqual("ok");
  });

  test("user가 없는 경우 404 에러", async () => {
    User.findOne.mockReturnValue(null);
    const result = await follow(1, 2);
    expect(result).toEqual("no user");
  });

  test("DB에서 에러나면 throw", async () => {
    const message = "DB에러";
    User.findOne.mockReturnValue(Promise.reject(message));
    try {
      await follow(1, 2);
    } catch (err) {
      expect(err).toEqual(message);
    }
  });
});
