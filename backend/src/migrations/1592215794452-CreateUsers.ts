import {MigrationInterface, QueryRunner} from "typeorm";

export class CreateUsers1592215794452 implements MigrationInterface {
    name = 'CreateUsers1592215794452'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT LOCALTIMESTAMP, "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT LOCALTIMESTAMP, "publicId" uuid NOT NULL DEFAULT uuid_generate_v4(), "displayName" character varying(50) NOT NULL, "confirmedEmail" character varying(50), "pendingEmail" character varying(50) NOT NULL, "emailConfirmationToken" character varying(16), "emailConfirmationRequestedAt" TIMESTAMP WITH TIME ZONE NOT NULL, "emailConfirmationCompletedAt" TIMESTAMP WITH TIME ZONE, "securityOperationPerformedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT LOCALTIMESTAMP, "passwordHash" character varying, CONSTRAINT "UQ_c360588ec8bbb2f67b59cfe2592" UNIQUE ("publicId"), CONSTRAINT "UQ_059e69c318702e93998f26d1528" UNIQUE ("displayName"), CONSTRAINT "UQ_934f524f5b655d6061ee140395f" UNIQUE ("confirmedEmail"), CONSTRAINT "UQ_f103f1e4534e4f4b342f5763c48" UNIQUE ("emailConfirmationToken"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "user"`);
    }

}
