import { taxios } from "..";

import {
  array,
  literal,
  object,
  optional,
  string,
  union,
  Infer,
} from "superstruct";
import nock from "nock";
import * as UTILS from "./__utils__";

const SCHEMA = object({
  id: string(),
  username: string(),
  email: string(),
  address: object({
    street: string(),
    zipcode: optional(string()),
  }),
  followers: array(
    object({
      id: string(),
      role: optional(union([literal("admin"), literal("guest")])),
    })
  ),
});

type TYPE = Infer<typeof SCHEMA>;
function ensure(_: TYPE) { }

describe("superstruct interop", () => {
  it("returns `data` and not `error` when the data is valid", async () => {
    nock(UTILS.API).get("/").reply(200, UTILS.VALID);

    const response = await taxios(SCHEMA).get(UTILS.API);
    const [error, data] = response.data;

    expect(error).toBeUndefined();
    expect(data).toEqual(UTILS.VALID);
    ensure(data!);
  });

  it("returns `error` and not `data` when the data is invalid", async () => {
    nock(UTILS.API).get("/").reply(200, UTILS.INVALID);

    const response = await taxios(SCHEMA).get(UTILS.API);
    const [error, data] = response.data;

    expect(data).toBeUndefined();
    expect(JSON.stringify(error, null, 2)).toMatchSnapshot();
  });
});
