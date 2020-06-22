import {MigrationInterface, QueryRunner} from "typeorm";
import { COLUMN_NULL_VALUE } from "src/user/user.entity";

export class CreateUserPhoneColumn1592789953982 implements MigrationInterface {
    name = 'CreateUserPhoneColumn1592789953982'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "phone" character varying(50) NOT NULL DEFAULT '${COLUMN_NULL_VALUE}`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "UQ_8e1f623798118e629b46a9e6299" UNIQUE ("phone")`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "phone" DROP DEFAULT`);
        
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "UQ_8e1f623798118e629b46a9e6299"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "phone"`);
    }

}
