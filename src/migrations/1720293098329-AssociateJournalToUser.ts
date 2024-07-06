import { MigrationInterface, QueryRunner } from 'typeorm';

export class AssociateJournalToUser1720293098329 implements MigrationInterface {
  name = 'AssociateJournalToUser1720293098329';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "journal"
            ADD "userId" integer
        `);
    await queryRunner.query(`
            ALTER TABLE "journal"
            ADD CONSTRAINT "FK_2201c5fdaf252e0d83b06975117" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "journal" DROP CONSTRAINT "FK_2201c5fdaf252e0d83b06975117"
        `);
    await queryRunner.query(`
            ALTER TABLE "journal" DROP COLUMN "userId"
        `);
  }
}
