import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitSchema1747757733625 implements MigrationInterface {
  name = 'InitSchema1747757733625';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "username" character varying(50) NOT NULL, "email" character varying(255) NOT NULL, CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE ("username"), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "rating" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "score" smallint NOT NULL, "comment" text, "tags" text array, "entityId" uuid, "userId" uuid, CONSTRAINT "PK_ecda8ad32645327e4765b43649e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_RATINGS_ENTITY_DATE" ON "rating" ("entityId", "created_at") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_RATING_ENTITY" ON "rating" ("entityId") `,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."entities_type_enum" AS ENUM('product', 'person', 'service', 'experience', 'event')`,
    );
    await queryRunner.query(
      `CREATE TABLE "entities" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "type" "public"."entities_type_enum" NOT NULL, "name" text NOT NULL, "street" character varying(225), "city" character varying(100), "state" character varying(100), "country" character varying(100), "googlePlaceId" character varying(100), "latitude" double precision, "longitude" double precision, "socials" jsonb, CONSTRAINT "PK_8640855ae82083455cbb806173d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_ENTITIES_NAME" ON "entities" ("name") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_ENTITIES_TYPE" ON "entities" ("type") `,
    );
    await queryRunner.query(
      `ALTER TABLE "rating" ADD CONSTRAINT "FK_a74c512ccac42c2958f71188eb7" FOREIGN KEY ("entityId") REFERENCES "entities"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "rating" ADD CONSTRAINT "FK_a6c53dfc89ba3188b389ef29a62" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "rating" DROP CONSTRAINT "FK_a6c53dfc89ba3188b389ef29a62"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rating" DROP CONSTRAINT "FK_a74c512ccac42c2958f71188eb7"`,
    );
    await queryRunner.query(`DROP INDEX "public"."IDX_ENTITIES_TYPE"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_ENTITIES_NAME"`);
    await queryRunner.query(`DROP TABLE "entities"`);
    await queryRunner.query(`DROP TYPE "public"."entities_type_enum"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_RATING_ENTITY"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_RATINGS_ENTITY_DATE"`);
    await queryRunner.query(`DROP TABLE "rating"`);
    await queryRunner.query(`DROP TABLE "users"`);
  }
}
