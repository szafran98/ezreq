import { IsString } from 'class-validator'
import User from '../entities/User'
import Controller from '../../lib/decorators/Controller'
import Application from '../../lib/core/ezreq'

// import { Req} from "@nestjs/common";
import {
    Body,
    Param,
    Get, Post,
    Validators,
} from '../../lib/decorators/request'
import Validator from '../../lib/core/Validator'

class UserDTO {
    @IsString()
    username: string
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { isIdNumber } = Validator.builtins

@Controller('users')
export default class UserController {
    // static middlewares = [isParamNumber]

    @Get()
    async getElo() {
        // console.log(await User.find())
        const users = await Application.dbConnection.getRepository(User).find()
        // console.log(users)
        return {
            data: users,
            status: 200,
        }
    }

    // @Validators([isIdNumber])
    @Get(':id')
    async getOneElo(@Param() params) {
        try {
            const users = await Application.dbConnection
                .getRepository(User)
                .findOne(params.id)
            return {
                data: users,
                status: 200,
            }
        } catch (e) {
            return {
                data: { message: 'Bad param' },
                status: 500,
            }
        }
    }

    // @Validators([{
    //     body: (data) => [Validator.classValidator(UserDTO, data)]
    // }])
    @Validators([
        {
            body: [UserDTO],
        },
    ])
    @Post()
    async createElo(@Body() body) {
        console.log(body)

        try {
            const user = await Application.dbConnection
                .getRepository(User)
                .create()
            user.username = body.username
            await Application.dbConnection.getRepository(User).save(user)
            return {
                data: user,
                status: 201,
            }
        } catch (e) {
            console.log(e)

            return {
                data: { message: 'Bad data' },
                status: 500,
            }
        }
    }
}

// export { UserController };
