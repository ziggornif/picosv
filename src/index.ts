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

function string() {
  return {
    type: 'string',
  };
}

function boolean() {
  return {
    type: 'boolean',
  };
}

function number() {
  return {
    type: 'number',
  };
}

function bigint() {
  return {
    type: 'bigint',
  };
}

function object(properties?: object) {
  return {
    type: 'object',
    properties,
  };
}

function array(type) {
  if (!type) {
    throw new Error(`ArrayTypeError - array type must be defined`);
  }
  if (Array.isArray(type) || !ALLOWED_TYPES.includes(type.type as string)) {
    throw new Error(`ArrayTypeError - ${type} is a non valid type, supported types are ${ALLOWED_TYPES.join(', ')}.`);
  }

  return {
    type: 'array',
    items: type,
  };
}

function optional(type) {
  if (!type) {
    throw new Error(`OptionalTypeError - optional need a type`);
  }
  return {
    ...type,
    optional: true,
  };
}

// function _parse(schema: SchemaType) {
//   for (const key in schema) {
//     if (typeof schema[key] === 'object') {
//       if (Array.isArray(schema[key])) {
//         if ((schema[key] as Literal[] | SchemaType[]).length > 1) {
//           throw new Error(`Key ${key} is an array with multiple types which is not supported by the validator.`);
//         }

//         if (schema[key].length === 0) {
//           throw new Error(`Key ${key} is an empty array which is not supported by the validator.`);
//         }

//         if (typeof schema[key][0] === 'string' && !ALLOWED_TYPES.includes(schema[key][0] as string)) {
//           throw new Error(`Key ${key} is a non valid type, supported types are ${ALLOWED_TYPES.join(', ')}.`);
//         }
//       } else {
//         _parse(schema[key][0] as SchemaType);
//       }
//     } else {
//       if (!ALLOWED_TYPES.includes(schema[key] as string)) {
//         throw new Error(`Key ${key} is a non valid type, supported types are ${ALLOWED_TYPES.join(', ')}.`);
//       }
//     }
//   }

//   return schema;
// }

// function _validate(schema, object) {
//   for (const key in schema) {
//     if (object[key] === undefined && !schema[key]?.optional) {
//       throw new Error(`Key ${key} is missing in object.`);
//     }

//     if (!object[key] && schema[key]?.optional) {
//       continue;
//     }

//     if (schema[key].type === 'object' && schema[key].properties) {
//       _validate(schema[key].properties, object[key]);
//     } else if (schema[key].type === 'array') {
//       if (schema[key].items?.properties) {
//         for (let i = 0; i < object[key].length; i++) {
//           _validate(schema[key].items.properties, object[key][i]);
//         }
//       } else {
//         for (let i = 0; i < object[key].length; i++) {
//           const valType = typeof object[key][i];
//           if (valType !== schema[key].items.type) {
//             throw new Error(
//               `Key ${key} has a value of type ${object[key][i]}[] which does not match its definition of type ${schema[key].items}[].`
//             );
//           }
//         }
//       }
//     } else if (typeof object[key] !== schema[key].type) {
//       throw new Error(
//         `Key ${key} has a value of type ${typeof object[key]} which does not match its definition of type ${schema.type}.`
//       );
//     }
//   }
// }

function _validate(schema, object) {
  for (const key in schema) {
    const schemaKey = schema[key];
    const objectKey = object[key];

    if ((objectKey === null || objectKey === undefined) && !schemaKey.optional) {
      throw new Error(`Key ${key} is missing in object.`);
    }

    if ((objectKey === null || objectKey === undefined) && schemaKey.optional) {
      continue;
    }

    const objectType = typeof objectKey;

    if (schemaKey.properties) {
      if (objectType !== 'object') {
        throw new Error(
          `Key ${key} has a value of type ${objectType} which does not match its definition of type ${schemaKey.type}.`
        );
      }
      _validate(schemaKey.properties, objectKey);
    } else if (schemaKey.type === 'array') {
      const items = schemaKey.items;
      if (items?.properties) {
        objectKey.forEach((item) => _validate(items.properties, item));
      } else {
        if (!objectKey.every((item) => typeof item === items.type)) {
          throw new Error(`Key ${key} has a value which does not match its definition of type ${items.type}[].`);
        }
      }
    } else if (objectType !== schemaKey.type) {
      throw new Error(
        `Key ${key} has a value of type ${objectType} which does not match its definition of type ${schemaKey.type}.`
      );
    }
  }
}

function picosv(inputSchema) {
  // const schema = _parse(inputSchema);
  const schema = inputSchema;
  function validate(object) {
    return _validate(schema, object);
  }
  return {
    validate,
  };
}

export { picosv, string, number, bigint, boolean, object, array, optional };
