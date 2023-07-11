import { taxios } from "..";

import { scope } from "arktype";
import nock from "nock";
import * as UTILS from "./__utils__";

const SCHEMA = scope({
  follower: {
    id: "string",
    "role?": '"admin" | "guest"',
  },
  user: {
    id: "string",
    username: "string",
    email: "string",
    address: {
      street: "string",
      "zipcode?": "string",
    },
    followers: "follower[]",
  },
}).compile().user;

type TYPE = typeof SCHEMA.infer;
function ensure(_: TYPE) { }

describe("ArkType interop", () => {
  it("passes along data with the correct type", async () => {
    nock(UTILS.API).get("/").reply(200, UTILS.VALID);
    const { data } = await taxios(SCHEMA).get(UTILS.API);

    expect(data).toEqual(UTILS.VALID);
    ensure(data);
  });

  it("throws a validation error when the data is invalid", async () => {
    nock(UTILS.API).get("/").reply(200, UTILS.INVALID);

    try {
      await taxios(SCHEMA).get(UTILS.API);
    } catch (error) {
      expect(JSON.stringify(error, null, 2)).toMatchSnapshot();
    }
  });
});
