import { taxios } from "..";

import myzod, { Infer } from "myzod";
import nock from "nock";
import * as UTILS from "./__utils__";

const SCHEMA = myzod.object({
  id: myzod.string(),
  username: myzod.string(),
  email: myzod.string(),
  address: myzod.object({
    street: myzod.string(),
    zipcode: myzod.string().optional(),
  }),
  followers: myzod.array(
    myzod.object({
      id: myzod.string(),
      role: myzod.enum(["admin", "guest"]).optional(),
    })
  ),
});

type TYPE = Infer<typeof SCHEMA>;
function ensure(_: TYPE) { }

describe("myzod interop", () => {
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
      fail("Did not throw error.");
    } catch (error) {
      expect(JSON.stringify(error, null, 2)).toMatchSnapshot();
    }
  });
});
