import { MigrationInterface, QueryRunner } from "typeorm";

export class InitSchema1747911528413 implements MigrationInterface {
    name = 'InitSchema1747911528413'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_1fc21e0a877f31597151179afb"`);
        await queryRunner.query(`CREATE UNIQUE INDEX "UQ_OUTBOX_IDEMPOTENCY_KEY" ON "outbox" ("idempotencyKey") `);
        await queryRunner.query(`CREATE INDEX "IDX_OUTBOX_STATUS" ON "outbox" ("status") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_OUTBOX_STATUS"`);
        await queryRunner.query(`DROP INDEX "public"."UQ_OUTBOX_IDEMPOTENCY_KEY"`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_1fc21e0a877f31597151179afb" ON "outbox" ("idempotencyKey") `);
    }

}
