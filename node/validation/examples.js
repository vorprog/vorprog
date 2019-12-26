let validation = require('./validation');

const US = `United States`;
const CAN = `Canada`;
const MEX = `Mexico`;

validation.validators.carYear = (target) => validation.isNumber(target) && target >= 1885 && target < new Date().getFullYear();
validation.validators.evenNumber = (target) => validation.isNumber(target) && target % 2 == 0;
validation.validators.country = (target) => validation.isString(target) && (target == US || target == CAN || target == MEX);

validation.definedTypes.address = {
    streetAddress: `string`,
    country: `country`
}

validation.definedTypes.company = {
    companyName: `string`,
    address: `address`
}

validation.definedTypes.tire = {
    expectedLifeSpan: `date`,
};

validation.definedTypes.car = {
    id: `number`,
    model: `string`,
    year: `carYear`,
    isUsed: `bool`,
    numberOfTailLights: `evenNumber`,
    tires: `tire[]`,
    make: `company`
};

let validCar = {
    id: 224873,
    model: `Focus`,
    year: 2010,
    isUsed: true,
    numberOfTailLights: 2,
    tires: [
        { expectedLifeSpan: `11/11/2011` },
        { expectedLifeSpan: `12/12/2012` },
        { expectedLifeSpan: `12/12/2012` },
        { expectedLifeSpan: `12/12/2012` },
    ],
    make: {
        companyName: `Ford`,
        address: {
            streetAddress: `1800 Ford Drive`,
            country: `United States`
        }
    }
};

let invalidCar = {
    make: 'ford',
    model: 'taurus',
    color: 'blue',
    tires: [
        { expectedLifeSpan: `graa` },
        { expectedLifeSpan: `12/12/2012` },
        { expectedLifeSpan: `12/12/2012` },
        { expectedLifeSpan: `12/12/2012` },
    ],
};


console.log(`Invalidations: ${JSON.stringify(validation.isInvalid(validCar, `car`),null, 2)}`);
console.log(`Invalidations: ${JSON.stringify(validation.isInvalid(null, `car`), null, 2)}`);

