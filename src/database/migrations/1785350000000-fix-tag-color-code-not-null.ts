import { MigrationInterface, QueryRunner } from 'typeorm';

export class FixTagColorCodeNotNull1785350000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "UPDATE `tag` SET `color_code` = '#FF5733' WHERE `color_code` IS NULL",
    );

    await queryRunner.query(
      'ALTER TABLE `tag` MODIFY `color_code` varchar(36) NOT NULL',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `tag` MODIFY `color_code` varchar(36) NULL',
    );
  }
}
