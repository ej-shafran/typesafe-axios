import { taxios } from "..";

import { z } from "zod";
import nock from "nock";
import * as UTILS from "./__utils__";

const SCHEMA = z.object({
  id: z.string(),
  username: z.string(),
  email: z.string(),
  address: z.object({
    street: z.string(),
    zipcode: z.string().optional(),
  }),
  followers: z.array(
    z.object({
      id: z.string(),
      role: z.enum(["admin", "guest"]).optional(),
    })
  ),
});

type TYPE = z.infer<typeof SCHEMA>;
function ensure(_: TYPE) { }

describe("zod interop", () => {
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
