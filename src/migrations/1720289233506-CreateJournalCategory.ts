import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateJournalCategory1720289233506 implements MigrationInterface {
  name = 'CreateJournalCategory1720289233506';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "journal_category" (
                "id" SERIAL NOT NULL,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                "name" character varying(256) NOT NULL,
                CONSTRAINT "UQ_e763854bce4705133f1cfbd6204" UNIQUE ("name"),
                CONSTRAINT "PK_6b105d9ef05ef62abac8b4e4032" PRIMARY KEY ("id")
            )
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP TABLE "journal_category"
        `);
  }
}
