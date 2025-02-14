import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateSetupControlTable1709001000002 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "setup_control",
                columns: [
                    {
                        name: "id",
                        type: "uuid",
                        isPrimary: true,
                        generationStrategy: "uuid",
                        default: "uuid_generate_v4()",
                    },
                    {
                        name: "templatesInitialized",
                        type: "boolean",
                        default: false,
                    },
                    {
                        name: "setupDate",
                        type: "timestamp",
                    },
                    {
                        name: "setupCompletedBy",
                        type: "varchar",
                        isNullable: true,
                    },
                    {
                        name: "createdAt",
                        type: "timestamp",
                        default: "now()",
                    },
                    {
                        name: "updatedAt",
                        type: "timestamp",
                        default: "now()",
                    },
                ],
            }),
            true
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("setup_control");
    }
}