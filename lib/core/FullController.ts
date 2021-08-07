import {
    Get,
} from '../decorators/request'
import Application from './ezreq'

export default class FullController {
    entity

    @Get()
    async get() {
        const entities = await Application.dbConnection.getRepository(this.entity).find()
        return {
            data: entities,
            status: 200,
        }
    }
}
