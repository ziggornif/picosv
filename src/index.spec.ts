import { assert, describe, it, expect } from 'vitest';
import { validate } from '.'
describe('Tiny schema validator', () => {
  it('should validate a single level schema', () => {
    const schema = {
      event: "string",
      count: "number",
      active: "boolean",
    };

    assert.doesNotThrow(() => validate(schema, {
      event: "entity-created",
      count: 42,
      active: true,
    }), Error);

    expect(() => validate(schema, {
      event: "entity-created",
      count: "42",
      active: true,
    })).toThrowError('Key count has a value of type string which does not match its definition of type number.');

    expect(() => validate(schema, {
      event: "entity-created",
      count: 42,
    })).toThrowError('Key active is missing in object.');
  })

  it('should validate schema with nested object', () => {
    const schema = {
      event: "string",
      count: "number",
      active: "boolean",
      data: {
        foo: "string",
        bar: "string"
      },
    };

    assert.doesNotThrow(() => validate(schema, {
      event: "entity-created",
      count: 42,
      active: true,
      data: {
        foo: "foo",
        bar: "bar",
      },
    }), Error);

    expect(() => validate(schema, {
      event: "entity-created",
      count: 42,
      active: true,
      data: {
        foo: 42,
        bar: "bar",
      },
    })).toThrowError("Key foo has a value of type number which does not match its definition of type string.");

    expect(() => validate(schema, {
      event: "entity-created",
      count: 42,
      active: true,
      data: {
        bar: "bar",
      },
    })).toThrowError('Key foo is missing in object.');
  })

  it('should validate schema with nested objects', () => {
    const schema = {
      event: "string",
      count: "number",
      active: "boolean",
      data: {
        foo: "string",
        bar: "string",
        baz: {
          a: "number",
          b: "boolean"
        }
      },
    };

    assert.doesNotThrow(() => validate(schema, {
      event: "entity-created",
      count: 42,
      active: true,
      data: {
        foo: "foo",
        bar: "bar",
        baz: {
          a: 1,
          b: false
        }
      },
    }), Error);

    expect(() => validate(schema, {
      event: "entity-created",
      count: 42,
      active: true,
      data: {
        foo: "foo",
        bar: "bar",
        baz: {
          a: "1",
          b: false
        }
      },
    })).toThrowError("Key a has a value of type string which does not match its definition of type number.");

    expect(() => validate(schema, {
      event: "entity-created",
      count: 42,
      active: true,
      data: {
        foo: "foo",
        bar: "bar",
        baz: {
          a: 1,
        }
      },
    })).toThrowError('Key b is missing in object.');
  })

  it('should refuse non primitive JS types', () => {
    const schema = {
      event: "string",
      count: "number",
      active: "foo",
    };

    expect(() => validate(schema, {
      event: "entity-created",
      count: 42,
      active: true,
    })).toThrowError("Key active is a non valid type, supported types are string, number, bigint, boolean.");
  })

  it('should refuse empty schema arrays', () => {
    const schema = {
      event: "string",
      count: "number",
      active: "boolean",
      data: [],
    };

    expect(() => validate(schema, {
      event: "entity-created",
      count: 42,
      active: true,
      data: [{
        foo: 42,
        bar: "bar",
      }],
    })).toThrowError("Key data is an empty array which is not supported by the validator.");
  })

  it('should refuse schema arrays with multiple types', () => {
    const schema = {
      event: "string",
      count: "number",
      active: "boolean",
      data: ["string", "boolean"],
    };

    expect(() => validate(schema, {
      event: "entity-created",
      count: 42,
      active: true,
      data: [{
        foo: 42,
        bar: "bar",
      }],
    })).toThrowError("Key data is an array with multiple types which is not supported by the validator.");
  })

  it('should validate schema with primitive arrays', () => {
    const schema = {
      event: "string",
      count: "number",
      active: "boolean",
      data: ["string"],
    };

    assert.doesNotThrow(() => validate(schema, {
      event: "entity-created",
      count: 42,
      active: true,
      data: ["foo", "bar", "baz"],
    }), Error);

    expect(() => validate(schema, {
      event: "entity-created",
      count: 42,
      active: true,
      data: [{
        foo: 42,
        bar: "bar",
      }],
    })).toThrowError("Key data has a value of type object[] which does not match its definition of type string[].");

    expect(() => validate(schema, {
      event: "entity-created",
      count: 42,
      active: true,
      data: [],
    })).toThrowError("Key data is an empty array value which does not match its definition of type array.");

    expect(() => validate(schema, {
      event: "entity-created",
      count: 42,
      active: true,
      data: "foo",
    })).toThrowError("Key data has a non-array value of type string which does not match its definition of type array.");
  })

  it('should validate schema with objects arrays', () => {
    const schema = {
      event: "string",
      count: "number",
      active: "boolean",
      data: [{
        foo: "string",
        bar: "string"
      }],
    };

    assert.doesNotThrow(() => validate(schema, {
      event: "entity-created",
      count: 42,
      active: true,
      data: [{
        foo: "foo1",
        bar: "bar1",
      }, {
        foo: "foo2",
        bar: "bar2",
      }],
    }), Error);

    expect(() => validate(schema, {
      event: "entity-created",
      count: 42,
      active: true,
      data: [{
        foo: 42,
        bar: "bar",
      }],
    })).toThrowError("Key foo has a value of type number which does not match its definition of type string.");

    expect(() => validate(schema, {
      event: "entity-created",
      count: 42,
      active: true,
      data: [{
        foo: "foo1",
        bar: "bar1",
      }, {
        foo: "foo2",
        bar: 42,
      }],
    })).toThrowError("Key bar has a value of type number which does not match its definition of type string.");

    expect(() => validate(schema, {
      event: "entity-created",
      count: 42,
      active: true,
      data: [],
    })).toThrowError("Key data is an empty array value which does not match its definition of type array.");

    expect(() => validate(schema, {
      event: "entity-created",
      count: 42,
      active: true,
      data: "foo",
    })).toThrowError("Key data has a non-array value of type string which does not match its definition of type array.");
  })
})