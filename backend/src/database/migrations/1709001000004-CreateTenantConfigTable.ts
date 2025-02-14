import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreateTenantConfigTable1709001000004 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "tenant_configs",
                columns: [
                    {
                        name: "id",
                        type: "uuid",
                        isPrimary: true,
                        generationStrategy: "uuid",
                        default: "uuid_generate_v4()"
                    },
                    {
                        name: "ownerId",
                        type: "uuid"
                    },
                    {
                        name: "templateId",
                        type: "uuid"
                    },
                    {
                        name: "settings",
                        type: "jsonb",
                        default: "'{}'"
                    },
                    {
                        name: "activeModules",
                        type: "jsonb",
                        default: "'{}'"
                    },
                    {
                        name: "customFieldValues",
                        type: "jsonb",
                        default: "'{}'"
                    },
                    {
                        name: "createdAt",
                        type: "timestamp",
                        default: "now()"
                    },
                    {
                        name: "updatedAt",
                        type: "timestamp",
                        default: "now()"
                    }
                ]
            }),
            true
        );

        // Add foreign keys
        await queryRunner.createForeignKey(
            "tenant_configs",
            new TableForeignKey({
                columnNames: ["templateId"],
                referencedColumnNames: ["id"],
                referencedTableName: "business_templates",
                onDelete: "SET NULL"
            })
        );

        // Assuming you have a users table
        await queryRunner.createForeignKey(
            "tenant_configs",
            new TableForeignKey({
                columnNames: ["ownerId"],
                referencedColumnNames: ["id"],
                referencedTableName: "users",
                onDelete: "CASCADE"
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const table = await queryRunner.getTable("tenant_configs");
        if (table) {
            const foreignKeys = table.foreignKeys;
            await Promise.all(foreignKeys.map(foreignKey => 
                queryRunner.dropForeignKey("tenant_configs", foreignKey)
            ));
        }
        await queryRunner.dropTable("tenant_configs");
    }
}
