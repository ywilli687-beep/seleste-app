"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const clerk_sdk_node_1 = require("@clerk/clerk-sdk-node");
dotenv_1.default.config();
const audit_1 = __importDefault(require("./routes/audit"));
const dashboard_1 = __importDefault(require("./routes/dashboard"));
const history_1 = __importDefault(require("./routes/history"));
const report_1 = __importDefault(require("./routes/report"));
const explain_1 = __importDefault(require("./routes/explain"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use('/api/audit', audit_1.default);
app.use('/api/explain', explain_1.default);
app.use('/api/dashboard', (0, clerk_sdk_node_1.ClerkExpressRequireAuth)(), dashboard_1.default);
app.use('/api/history', (0, clerk_sdk_node_1.ClerkExpressRequireAuth)(), history_1.default);
app.use('/api/report', (0, clerk_sdk_node_1.ClerkExpressRequireAuth)(), report_1.default);
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
