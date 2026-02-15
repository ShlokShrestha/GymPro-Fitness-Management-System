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
  selectOptions: any = {},
  page: number,
  limit: number,
): Promise<PaginationResult<T>> => {
  const totalRecords = await model.count({ where: filterOptions });
  const hasNextPage = page * limit + limit < totalRecords;
  const hasPrevPage = page > 0;

  const query: any = {
    where: filterOptions,
    skip: page * limit,
    take: limit,
  };

  console.log(filterOptions, includeOptions, selectOptions);

  if (Object.keys(selectOptions).length) {
    query.select = selectOptions;
  } else if (Object.keys(includeOptions).length) {
    query.include = includeOptions;
  }
  const data = await model.findMany(query);

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
