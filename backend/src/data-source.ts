import "reflect-metadata"
import { DataSource } from "typeorm"
import { BusinessTemplate } from "./models/templates/BusinessTemplate"
import { CustomField } from "./models/templates/CustomField"
import { SetupControl } from "./models/templates/setupcontrol"

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "robsbrz",  // Atualizado para seu usuário
    // password: "", // Não é necessário se estiver usando autenticação do sistema
    database: "erp_uk",
    synchronize: false,
    logging: true,
    entities: [BusinessTemplate, CustomField, SetupControl],
    migrations: ["src/database/migrations/*.ts"],
    subscribers: [],
})

export default AppDataSource