const obj = {
  event: "demande-financement-updated",
  count: 42,
  active: true,
  data: {
    foo: "foo",
    bar: "bar",
  }
};

const obj2 = {
  event: "demande-financement-updated",
  count: "42",
  active: true
};

const definition = {
  event: "string",
  count: "number",
  active: "boolean",
  data: {
    foo: "string",
    bar: "string"
  },
  arr: []
};

const ALLOWED_TYPES = ["string", "number", "bigint", "boolean"];

function validate(contract, object) {
  // add type checking
  for (let key in contract) {
    if(!object.hasOwnProperty(key)) {
      throw new Error(`Key ${key} is missing in object`)
    }

    if (typeof contract[key] === 'object') {
      if (Array.isArray(contract[key])) { // Check if the value is an array
        if (!Array.isArray(object[key])) {
          throw new Error(`Key ${key} has a non-array value of type ${typeof object[key]} which does not match its definition of type array.`);
        } 

        if (contract[key].length > 1) {
          throw new Error(`Key ${key} is an array with multiple types which is not supported by the validator.`);
        }

        if(typeof contract[key][0] === "string") {
          for(const val of object[key]) {
            if(typeof val !== contract[key][0]) {
              throw new Error(`Key ${key} has a value of type ${typeof object[key]} which does not match its definition of type ${contract[key]}.`);
            }
          }
        }

        for (let i = 0; i < contract[key].length; i++) {
          validate(contract[key][i], object[key][i]);
        }
        
      } else {
        if (typeof object[key] !== 'object') { // Check if the value is not an array
          validate(contract[key], object[key]);
        }
      }
    } else if (typeof object[key] !== contract[key]) {
      throw new Error(`Key ${key} has a value of type ${typeof object[key]} which does not match its definition of type ${contract[key]}.`);
    }
  }
}

function generateType(name, contract) {
  const type = {};

  for (let key in contract) {
    if (typeof contract[key] === 'object') {
      const interfaceBody = `{${generateType(key.charAt(0).toUpperCase() + key.slice(1), contract[key]).split('\n').slice(1, -1).join(' ')}}`;
      type[key] = interfaceBody;
    } else {
      type[key] = contract[key];
    }
  }

  return `interface ${name} {\n${Object.keys(type).map((key) => `  ${key}: ${type[key]};\n`).join('')}\n}`;
}

try {
  console.log("validate obj1")
  validate(definition, obj);
  console.log("validate obj2")
  validate(definition, obj2);
} catch (error) {
  console.log(error)
}
// console.log("schema:", definition)
// console.log("generated type", generateType("demo", definition))