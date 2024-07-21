"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const dotenv = require("dotenv");
const cors = require("cors");
async function bootstrap() {
    dotenv.config();
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.use(cors({
        origin: [
            'http://localhost:5173',
            'https://lost-and-found-delta.vercel.app',
        ],
        methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
        allowedHeaders: '*',
        credentials: true,
    }));
    await app.listen(3000);
}
bootstrap();
//# sourceMappingURL=main.js.map