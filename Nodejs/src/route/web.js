import express from "express"
import homeController from "../controller/homeController"
import userController from "../controller/userController"

let router = express.Router()

let initWebRoutes = app =>{
    router.get('/', homeController.getHomePage)
    router.get('/about', homeController.getAboutPage)
    router.get('/crud', homeController.getCRUD)
    router.post('/api/login', userController.handleLogin)

    return app.use("/", router)
}

module.exports = initWebRoutes