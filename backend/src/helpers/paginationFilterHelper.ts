export interface PaginationResult<T> {
  data: T[];
  pagination: {
    currentPage: number;
    hasPrevPage: boolean;
    hasNextPage: boolean;
    totalRecords: number;
  };
}
export const paginationFilterHelper = async <T>(
  model: any,
  filterOptions: any = {},
  includeOptions: any = {},
  page: number,
  limit: number,
): Promise<PaginationResult<T>> => {
  const totalRecords = await model.count({ where: filterOptions });
  const hasNextPage = page * limit + limit < totalRecords;
  const hasPrevPage = page > 0;
  const data = await model.findMany({
    where: filterOptions,
    include: includeOptions,
    skip: page * limit,
    take: limit,
  });

  return {
    data,
    pagination: {
      currentPage: Math.floor(page / limit) + 1,
      hasPrevPage,
      hasNextPage,
      totalRecords,
    },
  };
};
