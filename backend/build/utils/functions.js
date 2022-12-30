"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkAndChange = exports.isErr = exports.error = exports.success = void 0;
function success(result) {
    const Response = {
        status: 'success',
        timestamp: Date.now(),
        result: result,
    };
    return Response;
}
exports.success = success;
function error(message) {
    const Response = {
        status: 'error',
        timestamp: Date.now(),
        message: message,
    };
    return Response;
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
//# sourceMappingURL=functions.js.map