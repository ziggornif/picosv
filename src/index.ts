/* eslint-disable @typescript-eslint/no-explicit-any */
const ALLOWED_TYPES = ['string', 'number', 'bigint', 'boolean', 'object'];

type EntityType = StringType | NumberType | BigintType | BooleanType;

type StringType = {
  type: 'string';
};

type NumberType = {
  type: 'number';
};

type BigintType = {
  type: 'bigint';
};

type BooleanType = {
  type: 'boolean';
};

type ObjectType<T = SchemaType> = {
  type: 'object';
  properties: T;
};

type GenericObjectType = {
  type: 'object';
};

type SchemaItemType = EntityType | ObjectType | ArrayType<any> | GenericObjectType;

type ArrayType<T extends SchemaItemType> = {
  type: 'array';
  items: T;
};

type LiteralArrayType<T = EntityType> = {
  type: 'array';
  items: T;
};

type ObjectArrayType<T = ObjectType> = {
  type: 'array';
  items: T;
};

type Optional<T = SchemaItemType> = T & { optional: boolean };

export type SchemaType = {
  [key: string]: SchemaItemType | Optional<SchemaItemType>;
};

interface Mapping {
  number: number;
  string: string;
  bigint: bigint;
  boolean: boolean;
}

type TypeFromObjectType<T extends ObjectType | GenericObjectType> = T extends ObjectType
  ? FromSchema<T['properties']>
  : object;

type OptionalFields<T extends SchemaType> = {
  [K in keyof T]: T[K] extends Optional<SchemaItemType> ? K : never;
}[keyof T];

type RequiredFields<T extends SchemaType> = {
  [K in keyof T]: T[K] extends Optional<SchemaItemType> ? never : K;
}[keyof T];

type FromSchemaItem<T extends SchemaItemType> = T extends EntityType
  ? Mapping[T['type']]
  : T extends ObjectType | GenericObjectType
    ? TypeFromObjectType<T>
    : T extends ArrayType<any>
      ? FromSchemaItem<T['items']>[]
      : never;

export type FromSchema<T extends SchemaType> = {
  [K in keyof T as Exclude<K, OptionalFields<T>>]: FromSchemaItem<T[K]>;
} & {
  [K in keyof T as Exclude<K, RequiredFields<T>>]+?: FromSchemaItem<T[K]>;
};

function string(): StringType {
  return {
    type: 'string',
  };
}

function boolean(): BooleanType {
  return {
    type: 'boolean',
  };
}

function number(): NumberType {
  return {
    type: 'number',
  };
}

function bigint(): BigintType {
  return {
    type: 'bigint',
  };
}

function object(): GenericObjectType;
function object<T extends SchemaType>(properties: T): ObjectType<T>;
function object<T extends SchemaType>(properties?: T) {
  if (properties) {
    return { type: 'object', properties };
  }
  return { type: 'object' };
}

function array<T extends SchemaItemType>(type: T): ArrayType<T> {
  if (!type) {
    throw new Error(`ArrayTypeError - array type must be defined.`);
  }

  return {
    type: 'array',
    items: type,
  };
}

function optional<T extends SchemaItemType>(type: T): Optional<T> {
  if (!type) {
    throw new Error(`OptionalTypeError - optional need a type.`);
  }

  return {
    ...type,
    optional: true,
  };
}

function _parse(schema: SchemaType) {
  for (const key in schema) {
    const schemaKey = schema[key];
    if (!schemaKey.type) {
      throw new Error(`Key ${key} must have a type.`);
    } else if (
      schemaKey.type === 'array' &&
      (!(schemaKey as ObjectArrayType).items || !(schemaKey as ObjectArrayType).items?.type)
    ) {
      throw new Error(`Key ${key} is an empty array which is not supported by the validator.`);
    } else if (
      schemaKey.type === 'array' &&
      (schemaKey as ObjectArrayType).items.type === 'object' &&
      (schemaKey as ObjectArrayType).items?.properties
    ) {
      _parse((schemaKey as ObjectArrayType).items?.properties);
    } else if (schemaKey.type === 'array' && !ALLOWED_TYPES.includes((schemaKey as LiteralArrayType).items.type)) {
      throw new Error(`Key ${key} is an array of non valid type, supported types are ${ALLOWED_TYPES.join(', ')}.`);
    } else if (schemaKey.type === 'object' && (schemaKey as ObjectType).properties) {
      _parse((schemaKey as ObjectType).properties);
    } else if (schemaKey.type !== 'array' && schemaKey.type !== 'object' && !ALLOWED_TYPES.includes(schemaKey.type)) {
      throw new Error(`Key ${key} is a non valid type, supported types are ${ALLOWED_TYPES.join(', ')}.`);
    }
  }

  return schema;
}

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
      if (!Array.isArray(objectKey)) {
        throw new Error(
          `Key ${key} has a non-array value of type string which does not match its definition of type array.`
        );
      }

      if (items?.properties) {
        objectKey.forEach((item) => _validate(items.properties, item));
      } else {
        if (!objectKey?.every((item) => typeof item === items.type)) {
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

function picosv(inputSchema: SchemaType) {
  const schema = _parse(inputSchema);
  function validate(object) {
    return _validate(schema, object);
  }
  return {
    validate,
  };
}

export { picosv, string, number, bigint, boolean, object, array, optional };
