import { taxios } from "..";

import { String, Record, Array, Union, Literal, Static } from "runtypes";
import nock from "nock";
import * as UTILS from "./__utils__";

const SCHEMA = Record({
  id: String,
  username: String,
  email: String,
  address: Record({
    street: String,
    zipcode: String.optional(),
  }),
  followers: Array(
    Record({
      id: String,
      role: Union(Literal("admin"), Literal("guest")).optional(),
    })
  ),
});

type TYPE = Static<typeof SCHEMA>;
function ensure(_: TYPE) { }

describe("Runtypes interop", () => {
  it("passes along data with the correct type", async () => {
    nock(UTILS.API).get("/").reply(200, UTILS.VALID);

    const response = await taxios(SCHEMA).get(UTILS.API);

    expect(response.data.success).toBe(true);
    if (response.data.success) {
      expect(response.data.value).toEqual(UTILS.VALID);
      ensure(response.data.value);
    }
  });

  it("throws a validation error when the data is invalid", async () => {
    nock(UTILS.API).get("/").reply(200, UTILS.INVALID);

    const response = await taxios(SCHEMA).get(UTILS.API);

    expect(response.data.success).toBe(false);
    if (!response.data.success) {
      expect(response.data.message).toMatchSnapshot();
    }
  });
});
