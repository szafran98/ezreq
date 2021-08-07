import * as http from 'http'
import * as express from 'express'
import { Express, Response, Request } from 'express'
import { ClassConstructor } from 'class-transformer'
import { Connection, createConnection } from 'typeorm'
import 'reflect-metadata'
import {
    METHOD_METADATA,
    PATH_METADATA,
    VALIDATOR_METADATA,
} from '../constants'
import { getAppsEntitiesPaths } from '../utils'
import FullController from './FullController'

import Logger from './Logger'
import RequestHandler from './RequestHandler'

const dotenv = require('dotenv')

export default class Application {
    protected httpServer: http.Server

    protected readonly instance = express()

    private _controllers = []

    private _routes = []

    public static dbConnection: Connection

    public logger = new Logger()

    private modules = []

    constructor() {
        dotenv.config()

        this.initHttpServer()
    }

    get controllers() {
        return this._controllers
    }

    get modulesEntities() {
        const entities = []
        this.modules.forEach((module) => {
            entities.push(...module.entities)
        })
        return entities
    }

    get modulesControllers() {
        const controllers = []
        this.modules.forEach((module) => {
            controllers.push(...module.controllers)
        })
        return controllers
    }

    // get dbConnection () {
    //     return this._dbConnection
    // }

    static create() {
        const app = new Application()
        return app
    }

    public getInstance(): Express {
        return this.instance
    }

    public initHttpServer() {
        this.instance.use(express.json())
        this.httpServer = http.createServer(this.getInstance())
    }

    public listen(port: any, hostname = '127.0.0.1') {
        this.beforeListen()

        this.httpServer.listen(port, hostname)
        // console.log(this.httpServer.address())
        console.log(`App listening on  ${port}`)
    }

    public registerModule(module) {
        this.modules.push(module)
    }

    public initializeControllers() {
        this.modulesControllers.forEach((controller) => this.addController(controller))
    }

    public addController(ControllerClass: ClassConstructor<any>) {
        // console.log(Object.getPrototypeOf(ControllerClass), FullController)
        if (Object.getPrototypeOf(ControllerClass) === FullController) {
            // console.log('elo kurwa')
            const instance = new ControllerClass()

            const ParentClass = Object.getPrototypeOf(ControllerClass)
            const parentInstance = new ParentClass()

            // console.log(ControllerClass.prototype.constructor.name)

            const controllerPath =
                Reflect.getMetadata(PATH_METADATA, ControllerClass) || ''

            const controller = {
                name: ControllerClass.prototype.constructor.name,
                constructor: ControllerClass,
                path: `/${controllerPath}`,
                methods: [],
            }

            // console.log(Reflect.getPrototypeOf(parentInstance))

            // DODAJEMY DO METADATA METODY KLASY RODZICA
            Object.entries(Reflect.getPrototypeOf(parentInstance)).forEach(
                (entry) => {
                    const method = entry[0]
                    const pathMetadata = Reflect.getMetadata(
                        PATH_METADATA,
                        parentInstance[method],
                    )
                    const methodMetadata = Reflect.getMetadata(
                        METHOD_METADATA,
                        parentInstance[method],
                    )
                    // console.log()

                    controller.methods.push({
                        name: method,
                        ref: parentInstance[method].bind(instance),
                        path: `${controller.path}${pathMetadata}`,
                        httpMethod: methodMetadata,
                    })
                },
            )
            // console.log(controller)
            this._controllers.push(controller)
        } else {
            const instance = new ControllerClass()

            // console.log(ControllerClass.prototype)

            const controllerPath =
                Reflect.getMetadata(PATH_METADATA, ControllerClass) || ''

            const controller = {
                name: ControllerClass.name,
                constructor: ControllerClass,
                path: `/${controllerPath}`,
                methods: [],
            }
            Object.entries(Reflect.getPrototypeOf(instance)).forEach(
                (entry) => {
                    const method = entry[0]
                    const pathMetadata = Reflect.getMetadata(
                        PATH_METADATA,
                        instance[method],
                    )
                    const methodMetadata = Reflect.getMetadata(
                        METHOD_METADATA,
                        instance[method],
                    )
                    const validatorMetadata = Reflect.getMetadata(
                        VALIDATOR_METADATA,
                        instance[method],
                    )

                    controller.methods.push({
                        name: method,
                        ref: instance[method],
                        path: `${controller.path}${pathMetadata}`,
                        httpMethod: methodMetadata,
                        validators: validatorMetadata || [],
                    })
                },
            )
            // console.log(controller)
            this._controllers.push(controller)
        }
    }

    runMiddlewares(middlewares, routeMethod, routeParams) {
        let areMiddlewaresPassed = true

        // eslint-disable-next-line no-restricted-syntax
        for (const middleware of middlewares) {
            areMiddlewaresPassed = middleware(...routeParams)

            if (!areMiddlewaresPassed) break
        }
        return areMiddlewaresPassed

        // middlewares.forEach(middleware => {
        //     isMiddlewaresPassed = middleware(...routeParams)
        //
        // })
    }

    public initializeRoutes() {
        this.controllers.forEach((controller) => {
            controller.methods.forEach((method) => {
                this.instance[method.httpMethod](
                    method.path,
                    async (req: Request, res: Response) =>
                        new RequestHandler(this, req, res, controller, method),
                )
            })
        })
    }

    private async beforeListen() {
        this.initializeControllers()
        this.initializeRoutes()

        Application.dbConnection = await createConnection({
            type: process.env.DB_TYPE as 'mysql',
            host: process.env.DB_HOST,
            port: parseInt(process.env.DB_PORT),
            username: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            entities: getAppsEntitiesPaths(),
            synchronize: true,
        })
    }
}
