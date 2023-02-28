# typesafe-axios

## Description

A tiny library that works with `yup` and `axios` to send requests and type them correctly, throwing readable errors if the types are mismatched.

## Installation

```sh
npm install typesafe-axios yup
```

## Usage

```typescript
import taxios from 'typesafe-axios';
import * as yup from 'yup';

const Role = ["admin", "user"] as const;
type Role = typeof Role[keyof typeof Role];

const schema = yup.object({
	name: yup.string().required(),
	age: yup.number().required(),
	role: yup.mixed<Role>().oneOf(Role).defined(),
})

function getMyData() {
	try {
		const { data } = taxios(schema).get("https://www.my-url.com");
		//       ^? const data: { age: number; name: string; role: Role }
	} catch (error) {
		// if `data` doesn't fit the schema we defined,
		// we'll get a yup.ValidationError
		if (error instanceof yup.ValidationError) {
			// we can handle the failure here
		}
	}
}
```

*Note that the `taxios` function is available both as a default import and a named one.*

## Useful Links

You should visit:
- the [yup docs](https://github.com/jquense/yup)
- the [axios docs](https://axios-http.com/docs/intro)