import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateUserTable1709001000003 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Adicione DROP TYPE para evitar erros de tipo já existente
        await queryRunner.query(`DROP TYPE IF EXISTS user_role_enum CASCADE`);
        await queryRunner.query(`CREATE TYPE user_role_enum AS ENUM ('admin', 'manager', 'user')`);

        await queryRunner.createTable(
            new Table({
                name: "users",
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
                        name: "email",
                        type: "varchar",
                        isUnique: true
                    },
                    {
                        name: "password",
                        type: "varchar"
                    },
                    {
                        name: "company",
                        type: "varchar",
                        isNullable: true
                    },
                    {
                        name: "phone",
                        type: "varchar",
                        isNullable: true
                    },
                    {
                        name: "role",
                        type: "user_role_enum",
                        default: "'user'"
                    },
                    {
                        name: "emailVerified",
                        type: "boolean",
                        default: false
                    },
                    {
                        name: "verificationToken",
                        type: "varchar",
                        isNullable: true
                    },
                    {
                        name: "resetPasswordToken",
                        type: "varchar",
                        isNullable: true
                    },
                    {
                        name: "resetPasswordExpires",
                        type: "timestamp",
                        isNullable: true
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
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("users");
        await queryRunner.query(`DROP TYPE IF EXISTS user_role_enum CASCADE`);
    }
}
