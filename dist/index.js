"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// envioroment variables
var NODE_ENV = process.env.NODE_ENV || 'development';
var PORT = process.env.PORT || 8080;
var MONGO_DB_URL = process.env.MONGO_URI;
var dotenv_1 = __importDefault(require("dotenv"));
var express_1 = __importDefault(require("express"));
var body_parser_1 = __importDefault(require("body-parser"));
var mongoose_1 = __importDefault(require("mongoose"));
var swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
var swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
// Imports
var user_routes_1 = __importDefault(require("./routes/user.routes"));
var app = express_1.default();
dotenv_1.default.config({
    path: ".env." + NODE_ENV
});
// SwaggerUi configuration
var swaggerOptions = {
    swaggerDefinition: {
        info: {
            version: '1.0.0',
            title: 'Forum API',
            description: 'Forum API Information',
            contact: {
                name: 'Oscar Valdivia'
            },
            servers: ['http://localhost:8080']
        }
    },
    apis: ['./routes/*.js']
    //apis: ['index.ts']
};
var swaggerDoc = swagger_jsdoc_1.default(swaggerOptions);
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerDoc));
app.use(body_parser_1.default.json()); // application/json
// Api settings
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});
app.use('/user', user_routes_1.default);
// Error handler
app.use(function (error, req, res, next) {
    var status = error.statusCode || 500;
    var message = error.message;
    var data = error.data;
    res.status(status).json({
        message: message,
        data: data
    });
});
mongoose_1.default
    .connect('mongodb+srv://Oscar1996:quiwi25550@nodejs-raroh.mongodb.net/messages?retryWrites=true&w=majority ', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(function () {
    app.listen(PORT, function () {
        console.log("Server running in port " + PORT);
    });
})
    .catch(function (err) {
    console.log(err);
});
