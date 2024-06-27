const express = require('express')
const bodyParser = require('body-parser');

const AppController = require('../controllers/AppController')
const AuthController = require('../controllers/AuthController')
const UserController = require('../controllers/UserController')

module.exports = function (app) {
    const api = express.Router()
    app.use(bodyParser.json())
    
    // Auth Zone //
    api.post('/generateAdminToken', AuthController.generateAdminToken)
    api.post('/generateOracleToken', AuthController.generateOracleToken)

    // Private Zone
    api.post('/registerApp', AuthController.isAdminAuth, AuthController.registerApp)
    api.post('/registerUser', AuthController.isAdminAuth, AuthController.registerUser)
    api.post('/createOrModifySignature', AuthController.getUser, UserController.createOrModifySignature)
    api.get('/codifyData', AuthController.getUser, UserController.codifyData)

    // Should be a get, but DECO can't handle long urls
    api.post('/decodifyData', AuthController.isOracleAuth, AppController.decodifyData)
    api.post('/decodifyMultipleData', AuthController.isOracleAuth, AppController.decodifyMultipleData)
    api.get('/getUserInfo', AuthController.isAdminAuth, AppController.getUserInfo)

    // Error fallback //
    api.get('*', AuthController.methodNotFound)

    // Use router
    app.use('/', api)
}