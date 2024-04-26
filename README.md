# picosv (Pico Schema Validator)

picosv is pico schema validator (1.58 KB) based on JavaScript data types and written in vanilla JavaScript with no dependencies.

Usable on both the frontend and backend, this lightweight validator is able to validate JavaScript entities from schemas.

## Install

```sh
npm install picosv
```

## Getting started

Picosv is designed to be easy to use. Here's how to get started with schema creation and entities validation.

### Schema Creation

A schema in Picosv is an object that defines the structure of your data. The following types are supported: string, number (including bigint), boolean, array of primitives or objects, and objects themselves.

Here's a simple example:

```ts
const schema = {
  name: 'string',
  age: 'number'
};
```

And here's a more complex example with arrays and objects:

```ts
const schema = {
  events: [
    { type: 'string', content: { message: 'string', source: 'string' } }
  ],
  data: {
    foo: 'string',
    bar: 'number'
  },
  count: 'number',
  active: 'boolean'
};
```

### Schema typing rules

- Only JS primitive types, arrays and objects are allowed
- All the properties declared in the schema are required
- Arrays with multiple types are not allowed (primitive or object)
- Empty arrays are not allowed

Examples :

```ts
const schema = {
  wrong: ['string', 'number'] // not allowed
  wrongbis: [] // not allowed
  wrongter: [{foo: 'string'}, {bar: 'string'}] // not allowed
  good: ['string'] // allowed
  goodbis: [{foo: 'string'}] //allowed
}
```

### Objects

Object properties can be defined in two ways:
- generically using the type `object'
- in detail by describing the properties of the object

In the first case, the properties of the object will not be checked.

**Generic example :**

```ts
const schema = {
  event: 'string',
  count: 'number',
  active: 'boolean',
  data: 'object'
}
```

**Detailed example :**

```ts
const schema = {
  event: 'string',
  count: 'number',
  active: 'boolean',
  data: {
    foo: 'string',
    bar: 'number'
  }
}
```

### Entities Validation

To validate an object against a schema, simply call the validate function and pass in the schema and the object to validate. The function will throw an error if the object does not match the schema.

Here's an example:

```ts
import { validate } from 'picosv';

const object = {
  events: [
    { type: 'foo', content: { message: 'hello world!', source: 'blu' } }
  ],
  data: {
    foo: 'test',
    bar: 55
  },
  count: 42,
  active: false
};

try {
  validate(schema, object);
} catch (error) {
  console.error(error);
}
```

## Typescript type inference

The library also provides Typescript type inference from your schemas.

Let's see how it's works :

First, declare your schema like this :

```ts
import type { FromSchema, SchemaType } from 'picosv';

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

Notice that the `as const statifies SchemaType` will validate that our schema respects the type `SchemaType`.

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

## Benchmark

| Library                                        | Size (Minified) | Size (Minified + Gzipped) | Bench (simple schema) | Bench (complex schema) |
| ---------------------------------------------- | --------------- | ------------------------- | --------------------- | ---------------------- |
| [Ajv](https://www.npmjs.com/package/ajv)       | 119.6 kb        | 35.2 kb                   | 112,429,047 ops/sec   | 43,209,702 ops/sec     |
| [Picosv](https://www.npmjs.com/package/picosv) | 1.4 kb          | 0.55 kb                   | 25,384,389 ops/sec    | 3,502,764 ops/sec      |
| [Zod](https://www.npmjs.com/package/zod)       | 60.9 kb         | 14.2 kb                   | 5,089,661 ops/sec     | 709,588 ops/sec        |

Benchmark files are available in the `src/benchmark` directory

## Contributors

- [luciani-c](https://github.com/luciani-c)
- [gabrielDevlog](https://github.com/gabrielDevlog)