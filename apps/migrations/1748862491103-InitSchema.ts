import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitSchema1748862491103 implements MigrationInterface {
  name = 'InitSchema1748862491103';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "public"."IDX_RATINGS_ENTITY_DATE"`);
    await queryRunner.query(`ALTER TABLE "auth" DROP COLUMN "created_at"`);
    await queryRunner.query(`ALTER TABLE "auth" DROP COLUMN "updated_at"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "created_at"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "updated_at"`);
    await queryRunner.query(`ALTER TABLE "rating" DROP COLUMN "created_at"`);
    await queryRunner.query(`ALTER TABLE "rating" DROP COLUMN "updated_at"`);
    await queryRunner.query(`ALTER TABLE "entities" DROP COLUMN "created_at"`);
    await queryRunner.query(`ALTER TABLE "entities" DROP COLUMN "updated_at"`);
    await queryRunner.query(
      `ALTER TABLE "auth" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "auth" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "rating" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "rating" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "entities" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "entities" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "outbox" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_RATINGS_ENTITY_DATE" ON "rating" ("entityId", "createdAt") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "public"."IDX_RATINGS_ENTITY_DATE"`);
    await queryRunner.query(`ALTER TABLE "outbox" DROP COLUMN "updatedAt"`);
    await queryRunner.query(`ALTER TABLE "entities" DROP COLUMN "updatedAt"`);
    await queryRunner.query(`ALTER TABLE "entities" DROP COLUMN "createdAt"`);
    await queryRunner.query(`ALTER TABLE "rating" DROP COLUMN "updatedAt"`);
    await queryRunner.query(`ALTER TABLE "rating" DROP COLUMN "createdAt"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "updatedAt"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "createdAt"`);
    await queryRunner.query(`ALTER TABLE "auth" DROP COLUMN "updatedAt"`);
    await queryRunner.query(`ALTER TABLE "auth" DROP COLUMN "createdAt"`);
    await queryRunner.query(
      `ALTER TABLE "entities" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "entities" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "rating" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "rating" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "auth" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "auth" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_RATINGS_ENTITY_DATE" ON "rating" ("created_at", "entityId") `,
    );
  }
}
