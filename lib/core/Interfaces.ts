import RequestMethod from '../enums/RequestMethod'

export type Class = { new(...args: any[]): any; };

export interface IController {
    name: string,
    constructor: Class,
    path: string,
    methods: any[]
}

export interface IControllerMethod {
    name: string,
    ref: (...args: any[]) => any,
    path: string,
    httpMethod: keyof RequestMethod,
    validators: Class[]
}
