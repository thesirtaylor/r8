import { MigrationInterface, QueryRunner } from "typeorm";

export class InitSchema1748344441411 implements MigrationInterface {
    name = 'InitSchema1748344441411'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "name" character varying(250) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "name"`);
    }

}
