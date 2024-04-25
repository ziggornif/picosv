# tsv (Tiny Schema Validator)

tsv is tiny schema validator based on JS data types and written in vanilla with no dependencies.

## Install

```sh
npm install tsv
```

## Getting started

TODO : document schema and validation

## Type inference

The library also provide Typescript type inference from your schemas.

Let's see how it's works :

First, declare your schema like this :

```ts
import type { FromSchema, SchemaType } from 'tsv';

const schema = {
  event: "string",
  count: "number",
  active: "boolean",
  data: {
    foo: "string",
    bar: "number",
  },
  arr: ["string"],
  events: [{
    type: "string",
    content: {
      description: "string",
      author: "string",
      valid: "boolean"
    }
  }],
} as const satisfies SchemaType;
```

Notice that the `as const statifies SchemaType` which will validate that our schema respects the type SchemaType.

Then create your type :

```ts
type YourAwesomeType = FromSchema<typeof schema>;
```

And thats it ! You can use the schema inferred type on your objects.

```ts
const a: YourAwesomeType = {
  count: 55,
  active: false,
  event: 'coucou',
  data: {
    bar: 55,
    foo: "test",
    infinite: {
      infinity: 55
    }
  },
  arr: ["foo", "bar"],
  events: [{
    type: "foo",
    content: {
      author: "blu",
      description: "qwe",
      valid: 42 // Error: Type 'number' is not assignable to type 'boolean'.
    }
  }]
}
```

## Contributors

- [luciani-c](https://github.com/luciani-c)
- [gabrielDevlog](https://github.com/gabrielDevlog)