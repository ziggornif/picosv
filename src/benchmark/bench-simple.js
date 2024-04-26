const Benchmark = require('benchmark');
const picosv = require('picosv');
const Ajv = require('ajv');
const { z } = require('zod');
const suite = new Benchmark.Suite();

const ajv = new Ajv();

const ajvSchema = {
  type: 'object',
  properties: {
    foo: { type: 'integer' },
    bar: { type: 'string' },
  },
};

const picosvSchema = {
  foo: 'number',
  bar: 'string',
};

const zodSchema = z.object({
  foo: z.number(),
  bar: z.string(),
});

const entity = {
  foo: 42,
  bar: 'bar',
};

// add tests
suite
  .add('ajv#validate', function () {
    const ajvValidate = ajv.compile(ajvSchema);
    const valid = ajvValidate(entity);
    if (!valid) console.log(ajvValidate.errors);
  })
  .add('picosv#validate', function () {
    try {
      picosv.validate(picosvSchema, entity);
    } catch (error) {
      console.error(error);
    }
  })
  .add('zod#parse', function () {
    try {
      zodSchema.parse(entity);
    } catch (error) {
      console.error(error);
    }
  })
  .on('cycle', function (event) {
    console.log(String(event.target));
  })
  .on('complete', function () {
    console.log('Fastest is ' + this.filter('fastest').map('name'));
  })
  // run async
  .run({ async: true });
