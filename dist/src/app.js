"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.App = void 0;
const express_1 = __importDefault(require("express"));
const dotenv = __importStar(require("dotenv"));
const postRoutes_1 = __importDefault(require("./routes/postRoutes"));
const likesRoutes_1 = __importDefault(require("./routes/likesRoutes"));
const commentsRoutes_1 = __importDefault(require("./routes/commentsRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
dotenv.config();
class App {
    app;
    port;
    base_url;
    constructor(port, base_url) {
        this.app = (0, express_1.default)();
        this.port = port;
        this.base_url = base_url;
    }
    async initialize() {
        try {
            this.app.listen(this.port, () => {
                console.log(` Server is running on ${this.base_url}${this.port}`);
            });
        }
        catch (error) {
            console.log("Server Connection error:", error);
            process.exit();
        }
        this.initializeMiddlewares();
        this.initializeRoutes();
    }
    initializeMiddlewares() {
        this.app.use(express_1.default.json());
        this.app.use(express_1.default.urlencoded({ extended: true }));
        this.app.use("/uploads", express_1.default.static("uploads"));
    }
    initializeRoutes() {
        this.app.use("/user", userRoutes_1.default);
        this.app.use("/post", postRoutes_1.default);
        this.app.use('/likes', likesRoutes_1.default);
        this.app.use('/comments', commentsRoutes_1.default);
    }
}
exports.App = App;
//# sourceMappingURL=app.js.map