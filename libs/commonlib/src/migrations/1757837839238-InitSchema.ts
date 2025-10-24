import { MigrationInterface, QueryRunner } from "typeorm";

export class InitSchema1757837839238 implements MigrationInterface {
    name = 'InitSchema1757837839238'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "media_outbox" ADD "entity_id" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "media_outbox" ADD CONSTRAINT "UQ_174a80b47993f390d28d41673fe" UNIQUE ("entity_id")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "media_outbox" DROP CONSTRAINT "UQ_174a80b47993f390d28d41673fe"`);
        await queryRunner.query(`ALTER TABLE "media_outbox" DROP COLUMN "entity_id"`);
    }

}
