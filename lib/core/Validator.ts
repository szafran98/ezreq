import { validate } from 'class-validator'
import { Request } from 'express'
// import FastestValidator from 'fastest-validator'
const FastestValidator = require('fastest-validator')

export default class Validator {
    static _fastestValidator = new FastestValidator()

    static get builtins() {
        return {
            isParamNumber,
            isIdNumber,
        }
    }

    static validate(schema, object) {
        const schemaValidator = this.getChecker(schema)
        return schemaValidator(object)
    }

    static getChecker(schema) {
        return this._fastestValidator.compile(schema)
    }

    static async dtoValidate(req: Request, validators: any[]) {
        let areValidationPassed = true
        const error = {}

        // eslint-disable-next-line no-restricted-syntax
        for (const validationItem of validators) {
            const objectToValidate = Object.keys(validationItem)[0]
            const validatingData = req[objectToValidate]

            // eslint-disable-next-line no-restricted-syntax
            for (const ValidationClass of validationItem[objectToValidate]) {
                const instance = new ValidationClass()

                // eslint-disable-next-line guard-for-in,no-restricted-syntax
                for (const key in validatingData) {
                    instance[key] = validatingData[key]
                }

                // eslint-disable-next-line no-await-in-loop
                const validationResult = await validate(instance)
                // console.log(validationResult)

                if (validationResult.length > 0) areValidationPassed = false

                validationResult.forEach((err) => {
                    error[err.property] = Object.values(err.constraints)
                })

                console.log(areValidationPassed, 'in loop')
            }
        }

        return { areValidationPassed, error }
    }
}

const isParamNumber = (param) => {
    const schema = {
        $$root: true,
        type: 'number',
    }
    return Validator.validate(schema, param)
}

const isIdNumber = (params) => {
    const schema = {
        id: {
            type: 'number',
        },
    }

    return Validator.validate(schema, params)
}
