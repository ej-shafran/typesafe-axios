# typesafe-axios

## Description

A tiny library that works with any runtime-type library and `axios` to send requests and type them correctly, throwing readable errors if the types are mismatched.

## Installation

Download `typesafe-axios` alongside a runtime type validation library, such as `yup`, `zod`, `arktype`, etc.

```sh
npm install typesafe-axios [validation library]
```

## Examples

### `yup`

```typescript
import taxios from "typesafe-axios";
import * as yup from "yup";

const schema = yup.object({
  name: yup.string().required(),
  age: yup.number().required(),
  role: yup.string().oneOf(["admin", "guest"]),
});

async function getMyData() {
  try {
    const { data } = await taxios(schema).get("https://www.my-url.com");
    //       ^? const data: { age: number; name: string; role: "admin" | "guest" }
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      // we can handle the failure here
    }
  }
}
```

### `zod`

```typescript
import taxios from "typesafe-axios";
import { z } from "zod";

const schema = z.object({
  name: z.string(),
  age: z.number(),
  role: z.enum(["admin", "guest"]).optional(),
});

async function getMyData() {
  try {
    const { data } = await taxios(schema).get("https://www.my-url.com");
    //       ^? const data: { age: number; name: string; role: "admin" | "guest" }
  } catch (error) {
    if (error instanceof z.ZodError) {
      // we can handle the failure here
    }
  }
}
```

### `ArkType`

```typescript
import taxios from "typesafe-axios";
import { type } from "arktype";

const schema = type({
  name: "string",
  age: "integer",
  "role?": '"admin" | "guest"',
});

async function getMyData() {
  const response = await taxios(schema).get("https://www.my-url.com");
  const { data, problems } = response.data;

  if (data) {
    // ^? const data: { age: number; name: string; role: "admin" | "guest" }
  } else {
    // we can handle the errors here
  }
}
```

_Note that the `taxios` function is available both as a default import and a named one._

## Useful Links

You should visit the [axios docs](https://axios-http.com/docs/intro)
