import type { FromSchema, SchemaType } from '..';
import { picosv } from '..';

const schema = {
  event: 'string',
  count: 'number',
  active: 'boolean',
  unknown: 'object',
  data: {
    foo: 'string',
    bar: 'number',
    infinite: {
      infinity: 'number',
    },
  },
  arr: ['string'],
  events: [
    {
      type: 'string',
      content: {
        description: 'string',
        author: 'string',
        valid: 'boolean',
      },
    },
  ],
} as const satisfies SchemaType;

const picoSchema = picosv(schema);

type MyType = FromSchema<typeof schema>;

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
      content: {
        author: 'blu',
        description: 'qwe',
        valid: true,
      },
    },
  ],
};

picoSchema.validate(a);
