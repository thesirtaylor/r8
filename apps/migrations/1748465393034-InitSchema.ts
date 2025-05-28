import { MigrationInterface, QueryRunner } from "typeorm";

export class InitSchema1748465393034 implements MigrationInterface {
    name = 'InitSchema1748465393034'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "rating" ADD "anonymous" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "rating" DROP COLUMN "anonymous"`);
    }

}
