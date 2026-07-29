// import { MigrationInterface, QueryRunner, Table } from 'typeorm';

// export class TaskTable1785117767097 implements MigrationInterface {
//   public async up(queryRunner: QueryRunner): Promise<void> {
//     await queryRunner.createTable(
//       new Table({
//         name: 'task',
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
//             name: 'user_id',
//             type: 'varchar',
//             length: '36',
//             isNullable: false,
//           },
//           {
//             name: 'parent_id',
//             type: 'varchar',
//             length: '36',
//             isNullable: true,
//           },
//           {
//             name: 'title',
//             type: 'varchar',
//             length: '100',
//             isNullable: false,
//           },
//           {
//             name: 'description',
//             type: 'text',
//             isNullable: true,
//           },
//           {
//             name: 'priority',
//             type: 'int',
//             default: 1,
//           },
//           {
//             name: 'status',
//             type: 'enum',
//             enum: ['todo', 'in_progress', 'done', 'pending'],
//             default: "'pending'",
//           },
//           {
//             name: 'start_at',
//             type: 'date',
//             isNullable: true,
//           },
//           {
//             name: 'due_at',
//             type: 'date',
//             isNullable: true,
//           },
//           {
//             name: 'estimated_hours',
//             type: 'float',
//             precision: 10,
//             scale: 2,
//             default: 0,
//           },
//           {
//             name: 'smart_score',
//             type: 'float',
//             precision: 10,
//             scale: 2,
//             default: 0,
//           },
//           {
//             name: 'done_at',
//             type: 'datetime',
//             isNullable: true,
//           },
//           {
//             name: 'created_at',
//             type: 'datetime',
//             default: 'CURRENT_TIMESTAMP',
//           },
//           {
//             name: 'updated_at',
//             type: 'datetime',
//             default: 'CURRENT_TIMESTAMP',
//             onUpdate: 'CURRENT_TIMESTAMP',
//           },
//         ],
//         foreignKeys: [
//           {
//             columnNames: ['user_id'],
//             referencedTableName: 'user',
//             referencedColumnNames: ['id'],
//             onDelete: 'CASCADE',
//           },
//           {
//             columnNames: ['parent_id'],
//             referencedTableName: 'task',
//             referencedColumnNames: ['id'],
//             onDelete: 'SET NULL',
//           },
//         ],
//       }),
//       true,
//     );
//   }

//   public async down(queryRunner: QueryRunner): Promise<void> {
//     await queryRunner.dropTable('task');
//   }
// }
