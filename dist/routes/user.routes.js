"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var router = express_1.default.Router();
/**
 * @swagger
 * /user/info:
 *  get:
 *    description: Use to request all user information
 *    responses:
 *      '200':
 *        description: A successful response
 */
router.get('/info', function (req, res, next) {
    res.json({
        message: 'Successfully',
        name: 'Oscar Valdivia',
        age: 23,
    });
});
exports.default = router;
