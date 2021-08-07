import {FullController} from "../../lib/core/FullController";
import { User } from "../entities/User";
import {Controller} from "../../lib/decorators/Controller";

@Controller('/test')
export class TestController extends FullController {
    entity = User

}