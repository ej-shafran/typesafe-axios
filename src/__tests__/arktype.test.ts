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

    const response = await taxios(SCHEMA).get(UTILS.API);
    const { data, problems } = response.data;

    expect(data).toEqual(UTILS.VALID);
    expect(problems).toBeUndefined();
    ensure(data!);
  });

  it("throws a validation error when the data is invalid", async () => {
    nock(UTILS.API).get("/").reply(200, UTILS.INVALID);

    const response = await taxios(SCHEMA).get(UTILS.API);
    const { data, problems } = response.data;

    expect(data).toBeUndefined();
    expect(JSON.stringify(problems, null, 2)).toMatchSnapshot();
  });
});
