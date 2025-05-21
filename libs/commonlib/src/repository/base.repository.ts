import { NotFoundException } from '@nestjs/common';
import { DataSource, Repository, FindOptionsWhere } from 'typeorm';

export abstract class BaseRepository<T> extends Repository<T> {
  constructor(entity: any, dataSource: DataSource) {
    super(entity, dataSource.createEntityManager());
  }

  async findByIdOrThrow(id: string): Promise<T> {
    const entity = await this.findOne({
      where: { id } as unknown as FindOptionsWhere<T>,
    });
    if (!entity) throw new NotFoundException();
    return entity;
  }

  /**
   * Cursor-based pagination
   * Options
   * @param where - filter conditions
   * @param cursor - the last seen cursor value (e.g id or any sortable column)
   * @param limit - number of records to fetch
   * @param order - 'ASC' or 'DESC'
   * @param orderBy - column to order by (defaults to primary column)
   */

  async paginateCursor(
    options: {
      where?: FindOptionsWhere<T>;
      cursor?: string;
      limit?: number;
      order?: 'ASC' | 'DESC';
      orderBy?: keyof T;
    } = {},
  ): Promise<{ data: T[]; nextCursor?: string }> {
    const { where, cursor, limit = 20, order = 'ASC', orderBy } = options;

    const primaryColumn =
      (orderBy as string) || this.metadata.primaryColumns[0].propertyAliasName;

    const alias = this.metadata.tableName;
    const queryBuilder = this.createQueryBuilder(alias as string);

    if (where) {
      queryBuilder.where(where);
    }

    if (cursor) {
      const operator = order === 'ASC' ? '>' : '<';

      queryBuilder.andWhere(`${alias}.${primaryColumn} ${operator} :cursor`, {
        cursor,
      });
    }

    queryBuilder.orderBy(`${alias}.${primaryColumn}`, order).take(limit + 1);

    const rows = await queryBuilder.getMany();
    const hasMore = rows.length > limit;
    const data = hasMore ? rows.slice(0, limit) : rows;
    const nextCursor = hasMore
      ? (data[data.length - 1] as any)[primaryColumn]
      : undefined;

    return { data, nextCursor };
  }
}
