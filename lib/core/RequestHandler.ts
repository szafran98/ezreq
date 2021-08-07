import { Request, Response } from 'express'
import Validator from './Validator'
import { IController, IControllerMethod } from './Interfaces'
import Application from './ezreq'

interface ValidationState {
    areValidationsPassed: boolean,
    errors: string[]
}

interface EndpointResponse {
    data: Record<string, unknown>,
    status?: number
}

export default class RequestHandler {
    private areMiddlewaresPassed

    private validationState: ValidationState

    private middlewaresState

    constructor(
        private app: Application,
        private req: Request,
        private res: Response,
        private controller: IController,
        private method: IControllerMethod,
    ) {
        this.evaluate()
    }

    get routeParametersMetadata() {
        return Reflect.getMetadata(
            '__routeArguments__',
            this.controller.constructor,
            this.method.name,
        ) || []
    }

    get routeParameters() {
        const requestParams = this.req.params
        const params = new Array(...this.routeParametersMetadata.length)

        Object.keys(requestParams).forEach((key) => {
            // try {
            this.routeParametersMetadata[key] = parseInt(requestParams[key])
            // } catch (e) {

            // }
        })

        Object.keys(this.routeParametersMetadata).forEach((key) => {
            switch (key) {
            case 'REQUEST':
                params[this.routeParametersMetadata[key].index] = this.req
                break
            case 'BODY':
                params[this.routeParametersMetadata[key].index] = this.req.body
                break
            case 'PARAM':
                params[this.routeParametersMetadata[key].index] = this.req.params
                break
            }
        })
        return params
    }

    async runValidators() {
        return Validator.dtoValidate(this.req, this.method.validators)
    }

    runMiddlewares(middlewares) {
        return middlewares
    }

    handleRequest(): EndpointResponse {
        return this.method.ref(...this.routeParameters)
    }

    createResponse(data, status) {
        return { data, status }
    }

    send(response) {
        if (response.status) this.res.status(response.status)
        this.res.json(response.data)
    }

    async evaluate(): Promise<void> {
        let response: EndpointResponse = { data: null, status: null }

        const { areValidationPassed, error } = await this.runValidators()

        if (areValidationPassed) {
            response = await this.handleRequest()
            this.send(response)
        } else {
            this.send({ data: error, status: 500 })
        }

        this.app.logger.logRequestMessage({
            hostname: this.req.hostname,
            path: this.req.path,
            method: this.req.method,
            status: response.status || 500,
        })
    }
}
