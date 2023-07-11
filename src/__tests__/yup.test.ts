import { taxios } from "..";

import * as yup from "yup";
import nock from "nock";
import * as UTILS from "./__utils__";

const SCHEMA = yup.object({
  id: yup.string().required(),
  username: yup.string().required(),
  email: yup.string().required(),
  address: yup.object({
    street: yup.string().required(),
    zipcode: yup.string(),
  }),
  followers: yup.array().of(
    yup.object({
      id: yup.string().required(),
      role: yup.string().oneOf(["admin", "guest"]),
    })
  ),
});

type TYPE = yup.InferType<typeof SCHEMA>;
function ensure(_: TYPE) { }

describe("yup interop", () => {
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
