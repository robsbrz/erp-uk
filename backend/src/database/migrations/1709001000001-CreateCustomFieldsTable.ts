import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreateCustomFieldsTable1709001000001 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Drop existing enum types if they exist and create new ones
        await queryRunner.query(`DROP TYPE IF EXISTS field_type_enum CASCADE`);
        await queryRunner.query(`DROP TYPE IF EXISTS entity_type_enum CASCADE`);

        await queryRunner.query(`
            CREATE TYPE field_type_enum AS ENUM (
                'text', 'number', 'date', 'select', 'multiselect', 'file'
            )
        `);

        await queryRunner.query(`
            CREATE TYPE entity_type_enum AS ENUM (
                'customers', 'products', 'services', 'appointments'
            )
        `);

        // Create custom_fields table
        await queryRunner.createTable(
            new Table({
                name: "custom_fields",
                columns: [
                    {
                        name: "id",
                        type: "uuid",
                        isPrimary: true,
                        generationStrategy: "uuid",
                        default: "uuid_generate_v4()"
                    },
                    {
                        name: "name",
                        type: "varchar"
                    },
                    {
                        name: "label",
                        type: "varchar"
                    },
                    {
                        name: "type",
                        type: "field_type_enum"
                    },
                    {
                        name: "entityType",
                        type: "entity_type_enum"
                    },
                    {
                        name: "required",
                        type: "boolean",
                        default: false
                    },
                    {
                        name: "options",
                        type: "varchar",
                        isArray: true,
                        isNullable: true
                    },
                    {
                        name: "validation",
                        type: "varchar",
                        isNullable: true
                    },
                    {
                        name: "segmentSpecific",
                        type: "boolean",
                        default: false
                    },
                    {
                        name: "settings",
                        type: "jsonb",
                        isNullable: true
                    },
                    {
                        name: "templateId",
                        type: "uuid"
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

        // Add foreign key
        await queryRunner.createForeignKey(
            "custom_fields",
            new TableForeignKey({
                columnNames: ["templateId"],
                referencedColumnNames: ["id"],
                referencedTableName: "business_templates",
                onDelete: "CASCADE"
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop foreign key first
        const table = await queryRunner.getTable("custom_fields");
        const foreignKey = table?.foreignKeys.find(
            fk => fk.columnNames.indexOf("templateId") !== -1
        );
        if (foreignKey) {
            await queryRunner.dropForeignKey("custom_fields", foreignKey);
        }

        // Drop table
        await queryRunner.dropTable("custom_fields");

        // Drop enum types
        await queryRunner.query(`DROP TYPE IF EXISTS field_type_enum CASCADE`);
        await queryRunner.query(`DROP TYPE IF EXISTS entity_type_enum CASCADE`);
    }
}
