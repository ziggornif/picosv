import type { FromSchema, SchemaType } from '..';
import { array, boolean, number, object, optional, picosv, string } from '..';

const schema = {
  event: string(),
  count: number(),
  active: boolean(),
  unknown: object(),
  data: object({
    foo: string(),
    bar: number(),
    infinite: object({
      infinity: number(),
    }),
  }),
  arr: array(array(string())),
  other: array(object()),
  events: array(
    object({
      type: string(),
      content: object({
        description: string(),
        author: string(),
        valid: boolean(),
      }),
    })
  ),
  op: optional(string()),
  opBis: object({
    something: boolean(),
    oth: optional(object()),
  }),
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
    bar: 12,
    foo: '',
    infinite: {
      infinity: 2122,
    },
  },
  arr: [['foo', 'bar']],
  other: [{ lol: '' }],
  events: [
    {
      type: 'foo',
      content: {
        author: '',
        valid: false,
        description: 'de',
      },
    },
  ],
  opBis: {
    something: true,
  },
};

const validation = picoSchema.validate(a);
console.log('validation', validation);
