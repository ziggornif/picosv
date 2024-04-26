const Benchmark = require('benchmark');
const {picosv} = require('picosv');
const Ajv = require('ajv');
const {z} = require('zod');
const suite = new Benchmark.Suite;

const ajv = new Ajv()

const ajvSchema = {
  type: "object",
  properties: {
    event: {type: "string"},
    count: {type: "number"},
    active: {type: "boolean"},
    data: {
      type: "object",
      properties: {
        foo: {type: "string"},
        bar: {type: "number"},
      }
    },
    arr: {
      type: "array", 
      items: {
        type: "string"  
      }
    },
    events: {
      type: "array",
      items: {
        type: "object",
        properties: {
          type: {type: "string"},
          content: {
            type: "object",
            properties: {
              description: {type: "string"},
              author: {type: "string"},
              valid: {type: "boolean"},
            }
          }
        }
      }
    }
  }
}
const ajvValidate = ajv.compile(ajvSchema)

const picosvSchema = picosv({
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
})

const zodSchema = z.object({
  event: z.string(),
  count: z.number(),
  active: z.boolean(),
  data: z.object({
    foo: z.string(),
    bar: z.number(),
  }),
  arr: z.array(z.string()),
  events: z.array(z.object({
    type: z.string(),
    content: z.object({
      description: z.string(),
      author: z.string(),
      valid: z.boolean(),
    })
  }))
});

const entity = {
  count: 55,
  active: false,
  event: 'coucou',
  data: {
    bar: 55,
    foo: "test"
  },
  arr: ["foo", "bar"],
  events: [{
    type: "foo",
    content: {
      author: "blu",
      description: "qwe",
      valid: true
    }
  }]
}

// add tests
suite.add('ajv#validate', function() {
  const valid = ajvValidate(entity)
  if (!valid) console.log(ajvValidate.errors)
})
.add('picosv#validate', function() {
  try {
    picosvSchema.validate(entity);
  } catch (error) {
    console.error(error);
  }
})
.add('zod#parse', function() {
  try {
    zodSchema.parse(entity);
  } catch (error) {
    console.error(error);
  }
})
.on('cycle', function(event) {
  console.log(String(event.target));
})
.on('complete', function() {
  console.log('Fastest is ' + this.filter('fastest').map('name'));
})
// run async
.run({ 'async': true });