import type { FromSchema, SchemaType } from '..';
import { array, boolean, number, object, optional, picosv, string } from '..';

const schema = {
  event: string(),
  count: number(),
  active: optional(boolean()),
  unknown: optional(object()),
  data: object({
    foo: string(),
    bar: optional(number()),
    infinite: object({
      infinity: number(),
    }),
  }),
  arr: array(string()),
  events: optional(
    array(
      object({
        type: string(),
        content: object({
          description: string(),
          author: string(),
          valid: optional(boolean()),
        }),
      })
    )
  ),
} as const satisfies SchemaType;
type MyType = FromSchema<typeof schema>;

const picoSchema = picosv(schema);

const a: MyType = {
  count: 55,
  active: false,
  event: 'coucou',
  unknown: {
    foo: 'bar',
  },
  data: {
    bar: 55,
    foo: 'test',
    infinite: {
      infinity: 55,
    },
  },
  arr: ['foo', 'bar'],
  events: [
    {
      type: 'foo',
      content: 'qwe',
    },
  ],
};

const validation = picoSchema.validate(a);
console.log('validation', validation);
