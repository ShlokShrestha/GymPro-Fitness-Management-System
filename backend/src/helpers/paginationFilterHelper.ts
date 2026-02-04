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
  skip: number,
  take: number
): Promise<PaginationResult<T>> => {
  const totalRecords = await model.count({ where: filterOptions });
  const hasNextPage = skip * take + take < totalRecords;
  const hasPrevPage = skip > 0;
  const data = await model.findMany({
    where: filterOptions,
    skip: skip * take,
    take: take,
  });
 
  return {
    data,
    pagination: {
      currentPage: Math.floor(skip / take) + 1,
      hasPrevPage,
      hasNextPage,
      totalRecords,
    },
  };
};
