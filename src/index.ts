const ALLOWED_TYPES = ['string', 'number', 'bigint', 'boolean', 'object'];

type Literal = 'number' | 'string' | 'boolean' | 'object';
export type SchemaType = {
  [key: string]: Literal | SchemaType | Literal[] | SchemaType[];
};

interface Maping {
  number: number;
  string: string;
  boolean: boolean;
  object: object;
}

export type FromSchema<T extends SchemaType> = {
  [K in keyof T]: T[K] extends Literal
    ? Maping[T[K]]
    : T[K] extends SchemaType
      ? FromSchema<T[K]>
      : T[K] extends Literal[]
        ? Maping[T[K][0]][]
        : T[K] extends SchemaType[]
          ? FromSchema<T[K][0]>[]
          : never;
};

function validate(schema: SchemaType, object) {
  for (const key in schema) {
    if (!object.hasOwnProperty(key)) {
      throw new Error(`Key ${key} is missing in object.`);
    }

    if (typeof schema[key] === 'object') {
      if (Array.isArray(schema[key])) {
        if (!Array.isArray(object[key])) {
          throw new Error(
            `Key ${key} has a non-array value of type ${typeof object[key]} which does not match its definition of type array.`
          );
        }

        if ((schema[key] as Literal[] | SchemaType[]).length > 1) {
          throw new Error(`Key ${key} is an array with multiple types which is not supported by the validator.`);
        }

        if (schema[key].length === 0) {
          throw new Error(`Key ${key} is an empty array which is not supported by the validator.`);
        }

        if (object[key].length === 0) {
          throw new Error(`Key ${key} is an empty array value which does not match its definition of type array.`);
        }

        if (typeof schema[key][0] === 'string') {
          for (const val of object[key]) {
            if (typeof val !== schema[key][0]) {
              throw new Error(
                `Key ${key} has a value of type ${typeof val}[] which does not match its definition of type ${schema[key][0]}[].`
              );
            }
          }
        } else {
          for (let i = 0; i < object[key].length; i++) {
            validate(schema[key][0], object[key][i]);
          }
        }
      } else {
        validate(schema[key] as SchemaType, object[key]);
      }
    } else if (!ALLOWED_TYPES.includes(schema[key] as string)) {
      throw new Error(`Key ${key} is a non valid type, supported types are ${ALLOWED_TYPES.join(', ')}.`);
    } else if (typeof object[key] !== schema[key]) {
      throw new Error(
        `Key ${key} has a value of type ${typeof object[key]} which does not match its definition of type ${schema[key]}.`
      );
    }
  }
}

export { validate };
