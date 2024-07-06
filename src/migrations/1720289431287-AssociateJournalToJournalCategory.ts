import { MigrationInterface, QueryRunner } from 'typeorm';

export class AssociateJournalToJournalCategory1720289431287
  implements MigrationInterface
{
  name = 'AssociateJournalToJournalCategory1720289431287';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "journal"
            ADD "categoryId" integer
        `);
    await queryRunner.query(`
            ALTER TABLE "journal"
            ADD CONSTRAINT "FK_fe7320d5383500efb6d7f08f40e" FOREIGN KEY ("categoryId") REFERENCES "journal_category"("id") ON DELETE RESTRICT ON UPDATE CASCADE
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "journal" DROP CONSTRAINT "FK_fe7320d5383500efb6d7f08f40e"
        `);
    await queryRunner.query(`
            ALTER TABLE "journal" DROP COLUMN "categoryId"
        `);
  }
}
