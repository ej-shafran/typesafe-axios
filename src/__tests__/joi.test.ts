import { taxios } from "..";

import Joi from "joi";
import nock from "nock";
import * as UTILS from "./__utils__";

const SCHEMA = Joi.object({
  id: Joi.string().required(),
  username: Joi.string().required(),
  email: Joi.string().required(),
  address: Joi.object({
    street: Joi.string().required(),
    zipcode: Joi.string(),
  }),
  followers: Joi.array().items(
    Joi.object({
      id: Joi.string().required(),
      role: Joi.string().valid("admin", "guest"),
    })
  ),
});

describe("joi interop", () => {
  it("passes along data with the correct type", async () => {
    nock(UTILS.API).get("/").reply(200, UTILS.VALID);
    const { data } = await taxios(SCHEMA).get(UTILS.API);

    expect(data.value).toEqual(UTILS.VALID);
  });

  it("throws a validation error when the data is invalid", async () => {
    nock(UTILS.API).get("/").reply(200, UTILS.INVALID);

    const { data } = await taxios(SCHEMA).get(UTILS.API);
    expect(JSON.stringify(data.error, null, 2)).toMatchSnapshot();
  });
});
