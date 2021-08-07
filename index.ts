import Apka from './apka'
import Application from './lib/core/ezreq'
// import UserController from './apka/controllers/UserController'

const app = Application.create()
app.registerModule(Apka)

// app.addController(UserController)
app.listen(3001, '127.0.0.1')
