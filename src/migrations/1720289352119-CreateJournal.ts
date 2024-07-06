import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateJournal1720289352119 implements MigrationInterface {
  name = 'CreateJournal1720289352119';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "journal" (
                "id" SERIAL NOT NULL,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                "title" character varying(256) NOT NULL,
                "content" text NOT NULL,
                CONSTRAINT "PK_396f862c229742e29f888b1abce" PRIMARY KEY ("id")
            )
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP TABLE "journal"
        `);
  }
}
