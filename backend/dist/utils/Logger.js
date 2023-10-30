"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Logger {
    static info(message, details) {
        console.log(Logger.colors.info, message, Logger.colors.reset, details ? details : '');
    }
    static warn(message, details) {
        console.log(Logger.colors.warn, message, Logger.colors.reset, details ? details : '');
    }
    static error(message, details) {
        console.log(Logger.colors.error, message, Logger.colors.reset, details ? details : '');
    }
    static debug(message, details) {
        console.log(Logger.colors.debug, message, Logger.colors.reset, details ? details : '');
    }
    static success(message, details) {
        console.log(Logger.colors.success, message, Logger.colors.reset, details ? details : '');
    }
}
// Info, Warning, Error, Debug, Success
Object.defineProperty(Logger, "colors", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: {
        info: '\x1b[36m%s\x1b[0m',
        warn: '\x1b[33m%s\x1b[0m',
        error: '\x1b[31m%s\x1b[0m',
        debug: '\x1b[34m%s\x1b[0m',
        success: '\x1b[32m%s\x1b[0m',
        reset: '\x1b[0m',
    }
});
exports.default = Logger;
//# sourceMappingURL=Logger.js.map