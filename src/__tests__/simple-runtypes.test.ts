import { taxios } from "..";

import * as st from "simple-runtypes";
import nock from "nock";
import * as UTILS from "./__utils__";

const SCHEMA = st.record({
  id: st.string(),
  username: st.string(),
  email: st.string(),
  address: st.record({
    street: st.string(),
    zipcode: st.optional(st.string()),
  }),
  followers: st.array(
    st.record({
      id: st.string(),
      role: st.optional(st.stringLiteralUnion("admin", "guest")),
    })
  ),
});

type TYPE = ReturnType<typeof SCHEMA>;
function ensure(_: TYPE) {}

describe("simple-runtypes interop", () => {
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
