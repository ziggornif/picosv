import { USV } from ".";

const schema = {
  event: "string",
  count: "number",
  active: "boolean",
  data: ["string"],
};

console.log(schema)

const usv1 = new USV(schema);


// const schema2 = {
//   event: "string",
//   count: "number",
//   active: "boolean",
//   data: [{
//     foo: "string",
//     bar: "string"
//   }],
// };

// type SchemaObjectType2 = getType(schema2);

// const schema3 = {
//   event: "string",
//   count: "number",
//   active: "boolean",
//   data: {
//     foo: "string",
//     bar: "string"
//   },
//   events: [{
//     type: "string",
//     content: {
//       description: "string",
//       author: "string",
//       valid: "boolean"
//     }
//   }],
// };

// const toto = infer schema3
// type SchemaObjectType3 = typeof schema3;