// import "reflect-metadata";
// import {createConnection} from "typeorm";
// import { getAppsEntitiesPaths } from "../utils";
// import Application from "../core/ezreq";
// import {UserController} from "../../apka/controllers/UserController";
// import {User} from "../../apka/entities/User";

// createConnection({
//     name: "default",
//     type: "mysql",
//     host: "localhost",
//     port: 3306,
//     username: "root",
//     password: "Kogut100",
//     database: "ezreq",
//     entities: getAppsEntitiesPaths(),
//     synchronize: true,
// }).then(async connection => {
//     const userRep = connection.getRepository(User)
//     console.log(await userRep.find())
//
//
//     const app = Application.create()
//     app.addController(UserController)
//     app.listen(3000, '127.0.0.1')
//
// }).catch(error => console.log(error))
