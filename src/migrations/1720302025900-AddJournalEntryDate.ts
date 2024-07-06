import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddJournalEntryDate1720302025900 implements MigrationInterface {
  name = 'AddJournalEntryDate1720302025900';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "journal"
            ADD "entryDate" TIMESTAMP WITH TIME ZONE NOT NULL
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "journal" DROP COLUMN "entryDate"
        `);
  }
}
