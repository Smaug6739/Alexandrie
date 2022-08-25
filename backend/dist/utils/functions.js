"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkAndChange = exports.isErr = exports.error = exports.success = void 0;
function success(result) {
    const responce = {
        status: 'success',
        timestamp: Date.now(),
        result: result,
    };
    return responce;
}
exports.success = success;
function error(message) {
    const responce = {
        status: 'error',
        timestamp: Date.now(),
        message: message,
    };
    return responce;
}
exports.error = error;
function isErr(param) {
    return param instanceof Error;
}
exports.isErr = isErr;
function checkAndChange(obj) {
    if (isErr(obj))
        return error(obj.message || obj);
    else
        return success(obj);
}
exports.checkAndChange = checkAndChange;
