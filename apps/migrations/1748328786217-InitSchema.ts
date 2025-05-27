import { MigrationInterface, QueryRunner } from "typeorm";

export class InitSchema1748328786217 implements MigrationInterface {
    name = 'InitSchema1748328786217'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."auth_provider_enum" AS ENUM('google', 'twitter', 'apple')`);
        await queryRunner.query(`CREATE TABLE "auth" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "access_token" text NOT NULL, "refresh_token" text NOT NULL, "provider" "public"."auth_provider_enum" NOT NULL, "userId" uuid, CONSTRAINT "PK_7e416cf6172bc5aec04244f6459" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "auth" ADD CONSTRAINT "FK_373ead146f110f04dad60848154" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "auth" DROP CONSTRAINT "FK_373ead146f110f04dad60848154"`);
        await queryRunner.query(`DROP TABLE "auth"`);
        await queryRunner.query(`DROP TYPE "public"."auth_provider_enum"`);
    }

}
