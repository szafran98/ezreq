import { METHOD_METADATA, PATH_METADATA, VALIDATOR_METADATA } from '../constants'
import RequestMethod from '../enums/RequestMethod'

export interface RequestMappingMetadata {
    path?: string | string[];
    method?: RequestMethod;
}

const defaultMetadata = {
    [PATH_METADATA]: '/',
    [METHOD_METADATA]: RequestMethod.GET,
}

export const RequestMapping = (
    metadata: RequestMappingMetadata = defaultMetadata,
): MethodDecorator => {
    const pathMetadata = metadata[PATH_METADATA]
    const path = pathMetadata && pathMetadata.length ? `/${pathMetadata}` : '/'
    const requestMethod = metadata[METHOD_METADATA] || RequestMethod.GET

    return (
        // eslint-disable-next-line @typescript-eslint/ban-types
        target: object,
        key: string | symbol,
        descriptor: TypedPropertyDescriptor<any>,
    ) => {
        // console.log(descriptor.value)
        Reflect.defineMetadata(PATH_METADATA, path, descriptor.value)
        Reflect.defineMetadata(METHOD_METADATA, requestMethod, descriptor.value)
        return descriptor
    }
}

const createMappingDecorator = (method: RequestMethod) => (
    path?: string | string[],
): MethodDecorator => RequestMapping({
    [PATH_METADATA]: path,
    [METHOD_METADATA]: method,
})

export const Post = createMappingDecorator(RequestMethod.POST)

export const Get = createMappingDecorator(RequestMethod.GET)

export const Delete = createMappingDecorator(RequestMethod.DELETE)

export const Put = createMappingDecorator(RequestMethod.PUT)

export const Patch = createMappingDecorator(RequestMethod.PATCH)

export const Options = createMappingDecorator(RequestMethod.OPTIONS)

export const Head = createMappingDecorator(RequestMethod.HEAD)

export const All = createMappingDecorator(RequestMethod.ALL)

/// ///////////////////////////////////////////////////////////

// eslint-disable-next-line @typescript-eslint/ban-types
export const Middlewares = (middlewares: Function[]): MethodDecorator => (target, key, index) => {
    console.log(target, key, index)
    console.log(middlewares)
}

export const Validators = (validators: any[]): MethodDecorator => (target, key, descriptor) => {
    // console.log(target, key, descriptor)
    // console.log(validators)

    Reflect.defineMetadata(VALIDATOR_METADATA, validators, descriptor.value)
    return descriptor
}

function createRouteParamDecorator(paramtype: any) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return (data?: any): ParameterDecorator => (target, key, index) => {
        const args = Reflect.getMetadata('__routeArguments__', target.constructor, key) || {}

        // console.log(target, key)

        const metadata = {
            ...args,
        }
        metadata[paramtype] = {
            index,
        }

        Reflect.defineMetadata(
            '__routeArguments__',
            metadata,
            target.constructor,
            key,
        )
    }
}

export const Req: () => ParameterDecorator = createRouteParamDecorator(
    'REQUEST',
)

export const Body: () => ParameterDecorator = createRouteParamDecorator(
    'BODY',
)

export const Param: () => ParameterDecorator = createRouteParamDecorator(
    'PARAM',
)
