// import { MigrationInterface, QueryRunner, Table } from 'typeorm';

// export class TagTable1785306187099 implements MigrationInterface {
//   public async up(queryRunner: QueryRunner): Promise<void> {
//     await queryRunner.createTable(
//       new Table({
//         name: 'tag',
//         columns: [
//           {
//             name: 'id',
//             type: 'varchar',
//             length: '36',
//             isPrimary: true,
//             isGenerated: true,
//             generationStrategy: 'uuid',
//           },
//           {
//             name: 'name',
//             type: 'varchar',
//             length: '100',
//             isNullable: false,
//           },
//           {
//             name: 'user_id',
//             type: 'varchar',
//             length: '36',
//             isNullable: false,
//           },
//           {
//             name: 'color_code',
//             type: 'varchar',
//             length: '36',
//             isNullable: true,
//           },
//           {
//             name: 'created_at',
//             type: 'datetime',
//             default: 'CURRENT_TIMESTAMP',
//           },
//         ],
//         foreignKeys: [
//           {
//             columnNames: ['user_id'],
//             referencedTableName: 'user',
//             referencedColumnNames: ['id'],
//             onDelete: 'CASCADE',
//           },
//         ],
//       }),
//     );
//   }

//   public async down(queryRunner: QueryRunner): Promise<void> {
//     await queryRunner.dropTable('tag');
//   }
// }
