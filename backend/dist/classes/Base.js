"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Base {
    constructor(app) {
        // Define the app main class
        Object.defineProperty(this, "app", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        if (!app)
            throw new Error("App is not defined");
        this.app = app;
    }
}
exports.default = Base;
//# sourceMappingURL=Base.js.map