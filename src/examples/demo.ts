import type { FromSchema, SchemaType } from '..'
import { validate } from '..'

const schema = {
  event: "string",
  count: "number",
  active: "boolean",
  data: {
    foo: "string",
    bar: "number",
    infinite: {
      infinity: "number"
    }
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

type MyType = FromSchema<typeof schema>;

const a: MyType = {
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
      valid: 42
    }
  }]

}

validate(schema, a);
