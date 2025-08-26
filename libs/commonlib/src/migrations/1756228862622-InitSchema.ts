import { MigrationInterface, QueryRunner } from "typeorm";

export class InitSchema1756228862622 implements MigrationInterface {
    name = 'InitSchema1756228862622'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "auth" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "access_token" text NOT NULL, "refresh_token" text NOT NULL, "userId" uuid, CONSTRAINT "PK_7e416cf6172bc5aec04244f6459" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "username" character varying(50), "name" character varying(50) NOT NULL, "email" character varying(100) NOT NULL, "avatar" text NOT NULL, CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE ("username"), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "rating" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "score" smallint NOT NULL, "comment" text, "tags" text array, "anonymous" boolean NOT NULL DEFAULT false, "entityId" uuid, "userId" uuid, CONSTRAINT "PK_ecda8ad32645327e4765b43649e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_RATINGS_ENTITY_DATE" ON "rating" ("entityId", "createdAt") `);
        await queryRunner.query(`CREATE INDEX "IDX_RATING_ENTITY" ON "rating" ("entityId") `);
        await queryRunner.query(`CREATE TYPE "public"."media_outbox_status_enum" AS ENUM('pending', 'published')`);
        await queryRunner.query(`CREATE TABLE "media_outbox" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "idempotencyKey" text NOT NULL, "status" "public"."media_outbox_status_enum" NOT NULL DEFAULT 'pending', "eventType" character varying NOT NULL, "payload" text NOT NULL, "publishedAt" TIMESTAMP, "batch_id" uuid NOT NULL, "attempts" integer NOT NULL DEFAULT '0', "nextAttemptAt" TIMESTAMP WITH TIME ZONE, "batchId" uuid, CONSTRAINT "UQ_fe0c0e0ceab75246419175c85ef" UNIQUE ("batch_id"), CONSTRAINT "REL_88a6e5396029427a0ee51c6d1c" UNIQUE ("batchId"), CONSTRAINT "PK_aa7595be77e116ea7696959e92c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_MEDIA_OUTBOX_IDEMPOTENCY_KEY" ON "media_outbox" ("idempotencyKey") `);
        await queryRunner.query(`CREATE INDEX "IDX_MEDIA_OUTBOX_STATUS" ON "media_outbox" ("status") `);
        await queryRunner.query(`CREATE TYPE "public"."media_batch_status_enum" AS ENUM('pending', 'completed', 'failed')`);
        await queryRunner.query(`CREATE TABLE "media_batch" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "entityId" text NOT NULL, "idempotencyKey" text NOT NULL, "status" "public"."media_batch_status_enum" NOT NULL DEFAULT 'pending', "processedAt" TIMESTAMP WITH TIME ZONE, CONSTRAINT "IDX_MEDIA_BATCH_ENTITY_ID_IDEMKEY" UNIQUE ("entityId", "idempotencyKey"), CONSTRAINT "PK_5db6887247ade810bb0020ddbef" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_MEDIA_BATCH_PROCESSED_AT" ON "media_batch" ("processedAt") `);
        await queryRunner.query(`CREATE INDEX "IDX_MEDIA_BATCH_ENTITY_ID" ON "media_batch" ("entityId") `);
        await queryRunner.query(`CREATE TYPE "public"."media_status_enum" AS ENUM('pending_upload', 'ready', 'rejected', 'failed')`);
        await queryRunner.query(`CREATE TABLE "media" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "entityId" uuid NOT NULL, "batchId" uuid NOT NULL, "url" character varying(255) NOT NULL, "description" text, "cfId" text NOT NULL, "mime" text NOT NULL, "size" bigint NOT NULL, "status" "public"."media_status_enum" NOT NULL DEFAULT 'pending_upload', "idempotencyKey" text NOT NULL, "expiresAt" TIMESTAMP WITH TIME ZONE, CONSTRAINT "UQ_42a60c07e4b566f0cc06a1eaaff" UNIQUE ("url"), CONSTRAINT "PK_f4e0fcac36e050de337b670d8bd" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_MEDIA_STATUS" ON "media" ("status") `);
        await queryRunner.query(`CREATE INDEX "IDX_MEDIA_URL" ON "media" ("url") `);
        await queryRunner.query(`CREATE INDEX "IDX_MEDIA_ENTITY" ON "media" ("entityId") `);
        await queryRunner.query(`CREATE TYPE "public"."entities_type_enum" AS ENUM('product', 'person', 'service', 'experience', 'event', 'place')`);
        await queryRunner.query(`CREATE TABLE "entities" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "type" "public"."entities_type_enum" NOT NULL, "name" text NOT NULL, "street" character varying(225), "city" character varying(100), "state" character varying(100), "country" character varying(100), "googlePlaceId" character varying(100), "latitude" double precision, "longitude" double precision, "socials" jsonb, CONSTRAINT "PK_8640855ae82083455cbb806173d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_ENTITIES_NAME" ON "entities" ("name") `);
        await queryRunner.query(`CREATE INDEX "IDX_ENTITIES_TYPE" ON "entities" ("type") `);
        await queryRunner.query(`CREATE TYPE "public"."outbox_status_enum" AS ENUM('pending', 'published')`);
        await queryRunner.query(`CREATE TABLE "outbox" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "idempotencyKey" character varying NOT NULL, "eventType" character varying NOT NULL, "payload" text NOT NULL, "status" "public"."outbox_status_enum" NOT NULL DEFAULT 'pending', "publishedAt" TIMESTAMP, CONSTRAINT "PK_340ab539f309f03bdaa14aa7649" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "UQ_OUTBOX_IDEMPOTENCY_KEY" ON "outbox" ("idempotencyKey") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_OUTBOX_IDEMPOTENCY_KEY" ON "outbox" ("idempotencyKey") `);
        await queryRunner.query(`CREATE INDEX "IDX_OUTBOX_STATUS" ON "outbox" ("status") `);
        await queryRunner.query(`ALTER TABLE "auth" ADD CONSTRAINT "FK_373ead146f110f04dad60848154" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "rating" ADD CONSTRAINT "FK_a74c512ccac42c2958f71188eb7" FOREIGN KEY ("entityId") REFERENCES "entities"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "rating" ADD CONSTRAINT "FK_a6c53dfc89ba3188b389ef29a62" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "media_outbox" ADD CONSTRAINT "FK_88a6e5396029427a0ee51c6d1cd" FOREIGN KEY ("batchId") REFERENCES "media_batch"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "media" ADD CONSTRAINT "FK_9aaae81aef2d184487da8476b84" FOREIGN KEY ("entityId") REFERENCES "entities"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "media" ADD CONSTRAINT "FK_87ca0980dbcfa48e101403655d1" FOREIGN KEY ("batchId") REFERENCES "media_batch"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "media" DROP CONSTRAINT "FK_87ca0980dbcfa48e101403655d1"`);
        await queryRunner.query(`ALTER TABLE "media" DROP CONSTRAINT "FK_9aaae81aef2d184487da8476b84"`);
        await queryRunner.query(`ALTER TABLE "media_outbox" DROP CONSTRAINT "FK_88a6e5396029427a0ee51c6d1cd"`);
        await queryRunner.query(`ALTER TABLE "rating" DROP CONSTRAINT "FK_a6c53dfc89ba3188b389ef29a62"`);
        await queryRunner.query(`ALTER TABLE "rating" DROP CONSTRAINT "FK_a74c512ccac42c2958f71188eb7"`);
        await queryRunner.query(`ALTER TABLE "auth" DROP CONSTRAINT "FK_373ead146f110f04dad60848154"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_OUTBOX_STATUS"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_OUTBOX_IDEMPOTENCY_KEY"`);
        await queryRunner.query(`DROP INDEX "public"."UQ_OUTBOX_IDEMPOTENCY_KEY"`);
        await queryRunner.query(`DROP TABLE "outbox"`);
        await queryRunner.query(`DROP TYPE "public"."outbox_status_enum"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_ENTITIES_TYPE"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_ENTITIES_NAME"`);
        await queryRunner.query(`DROP TABLE "entities"`);
        await queryRunner.query(`DROP TYPE "public"."entities_type_enum"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_MEDIA_ENTITY"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_MEDIA_URL"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_MEDIA_STATUS"`);
        await queryRunner.query(`DROP TABLE "media"`);
        await queryRunner.query(`DROP TYPE "public"."media_status_enum"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_MEDIA_BATCH_ENTITY_ID"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_MEDIA_BATCH_PROCESSED_AT"`);
        await queryRunner.query(`DROP TABLE "media_batch"`);
        await queryRunner.query(`DROP TYPE "public"."media_batch_status_enum"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_MEDIA_OUTBOX_STATUS"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_MEDIA_OUTBOX_IDEMPOTENCY_KEY"`);
        await queryRunner.query(`DROP TABLE "media_outbox"`);
        await queryRunner.query(`DROP TYPE "public"."media_outbox_status_enum"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_RATING_ENTITY"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_RATINGS_ENTITY_DATE"`);
        await queryRunner.query(`DROP TABLE "rating"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "auth"`);
    }

}
