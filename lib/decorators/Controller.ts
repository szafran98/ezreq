import 'reflect-metadata'
import { PATH_METADATA } from '../constants'

export default function Controller(
    prefix?: string,
): ClassDecorator {
    const defaultPath = '/'

    const path = prefix || defaultPath

    return (target: object) => {
        Reflect.defineMetadata(PATH_METADATA, path, target)
    }
}
