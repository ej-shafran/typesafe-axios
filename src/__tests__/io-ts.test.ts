import * as t from "io-ts";
import { isLeft, isRight } from "fp-ts/Either";
import nock from "nock";
import { taxios } from "..";
import * as UTILS from "./__utils__";

const SCHEMA = t.type({
  id: t.string,
  username: t.string,
  email: t.string,
  address: t.intersection([
    t.type({ street: t.string }),
    t.partial({ zipcode: t.string }),
  ]),
  followers: t.array(
    t.intersection([
      t.type({ id: t.string }),
      t.partial({ role: t.union([t.literal("admin"), t.literal("guest")]) }),
    ])
  ),
});

type TYPE = t.TypeOf<typeof SCHEMA>;
function ensure(_: TYPE) { }

describe("io-ts interop", () => {
  it("returns a Right with the data if the data is valid", async () => {
    nock(UTILS.API).get("/").reply(200, UTILS.VALID);

    const { data } = await taxios(SCHEMA.decode).get(UTILS.API);

    expect(isRight(data)).toBe(true);
    if (isRight(data)) {
      expect(data.right).toEqual(UTILS.VALID);
      ensure(data.right);
    }
  });

  it("returns a Left with the errors if the data is invalid", async () => {
    nock(UTILS.API).get("/").reply(200, UTILS.INVALID);

    const { data } = await taxios(SCHEMA.decode).get(UTILS.API);

    expect(isLeft(data)).toBe(true);
    if (isLeft(data)) {
      expect(data.left).toMatchSnapshot();
    }
  });
});
