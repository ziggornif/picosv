const ALLOWED_TYPES = ["string", "number", "bigint", "boolean"];

type Arr = string[] | Obj[];
type Obj = Record<string, string | Arr>
type Schema = Record<string, string | Arr | Obj>

class USV {
  #schema: Schema;
  #dummyObj;
  constructor(schema) {
    this.#schema = schema
    console.log(this.#dummyObjectFromSchema())
    this.#dummyObj = this.#dummyObjectFromSchema();
  }

  #fillPrimitive(type: string) {
    switch (type) {
      case "string":
        return "foo"
      case "number":
        return 42
      case "bigint":
        //@ts-ignore
        return BigInt(9007199254740991)
      case "boolean":
        return true
      default:
        break;
    }
  }

  #dummyObjectFromSchema(schema = this.#schema) {
    const obj = {};

    for (let key in schema) {
      if (typeof schema[key] === 'object') {
        if (Array.isArray(schema[key])) {
          if (typeof schema[key][0] === "string") {
            obj[key] = [this.#fillPrimitive(schema[key][0])]
          } else {
            obj[key] = this.#dummyObjectFromSchema(schema[key][0])
          }
        } else {
          obj[key] = this.#dummyObjectFromSchema(schema[key] as Obj)
        }
      } else {
        obj[key] = this.#fillPrimitive(schema[key] as string);
      }
    }
    return obj;
  }

  validate(schema = this.#schema, object) {
    for (let key in schema) {
      if (!object.hasOwnProperty(key)) {
        throw new Error(`Key ${key} is missing in object.`)
      }

      if (typeof schema[key] === 'object') {
        if (Array.isArray(schema[key])) {
          if (!Array.isArray(object[key])) {
            throw new Error(`Key ${key} has a non-array value of type ${typeof object[key]} which does not match its definition of type array.`);
          }

          if ((schema[key] as Arr).length > 1) {
            throw new Error(`Key ${key} is an array with multiple types which is not supported by the validator.`);
          }

          if ((schema[key] as Arr).length === 0) {
            throw new Error(`Key ${key} is an empty array which is not supported by the validator.`);
          }

          if (object[key].length === 0) {
            throw new Error(`Key ${key} is an empty array value which does not match its definition of type array.`);
          }

          if (typeof schema[key][0] === "string") {
            for (const val of object[key]) {
              if (typeof val !== schema[key][0]) {
                throw new Error(`Key ${key} has a value of type ${typeof val}[] which does not match its definition of type ${schema[key][0]}[].`);
              }
            }
          } else {
            for (let i = 0; i < object[key].length; i++) {
              this.validate(schema[key][0], object[key][i]);
            }
          }
        } else {
          this.validate(schema[key] as Obj, object[key]);
        }
        //@ts-ignore
      } else if (!ALLOWED_TYPES.includes(schema[key] as string)) {
        throw new Error(`Key ${key} is a non valid type, supported types are ${ALLOWED_TYPES.join(', ')}.`);
      } else if (typeof object[key] !== schema[key]) {
        throw new Error(`Key ${key} has a value of type ${typeof object[key]} which does not match its definition of type ${schema[key]}.`);
      }
    }
  }
}

export { USV }