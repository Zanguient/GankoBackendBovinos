"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var jsonwebtoken_1 = require("jsonwebtoken");
var global_1 = require("../config/global");
var response_body_1 = require("../controllers/response-body");
function ValidateToken(req, res, next) {
    var token = req.get('Authorization');
    console.log("Token : " + token);
    jsonwebtoken_1.verify(token, global_1.config["" + process.env.NODE_ENV].secret, function (err, decoded) {
        if (err) {
            res.status(401).send(new response_body_1.ResponseBody(false, "No Autorizado"));
        }
        else {
            console.log("Decoded id: " + decoded.id);
            req.id = decoded.id;
            next();
        }
    });
}
exports.ValidateToken = ValidateToken;
//# sourceMappingURL=token-validation.js.map