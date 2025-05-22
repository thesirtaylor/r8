import { MigrationInterface, QueryRunner } from "typeorm";

export class InitSchema1747909377706 implements MigrationInterface {
    name = 'InitSchema1747909377706'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."outbox_status_enum" AS ENUM('pending', 'published')`);
        await queryRunner.query(`CREATE TABLE "outbox" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "idempotencyKey" character varying NOT NULL, "eventType" character varying NOT NULL, "payload" text NOT NULL, "status" "public"."outbox_status_enum" NOT NULL DEFAULT 'pending', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "publishedAt" TIMESTAMP, CONSTRAINT "PK_340ab539f309f03bdaa14aa7649" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_1fc21e0a877f31597151179afb" ON "outbox" ("idempotencyKey") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_1fc21e0a877f31597151179afb"`);
        await queryRunner.query(`DROP TABLE "outbox"`);
        await queryRunner.query(`DROP TYPE "public"."outbox_status_enum"`);
    }

}
