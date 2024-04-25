const {validate} = require('picosv');

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
  console.log('valid');
} catch (error) {
  console.error(error);
}