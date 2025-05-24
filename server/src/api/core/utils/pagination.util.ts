export interface PaginatedResponse<T> {
	results: T[];
	total: number;
	totalPages: number;
	page: number;
	limit: number;
}


export const customPagination = <T>(
	data: T[],
	page: number,
	limit: number,
	totalRecords: number
): PaginatedResponse<T> => {
	return {
		results: data,
		page,
		limit,
		totalPages: Math.ceil(totalRecords / limit),
		total: totalRecords,
	};
};
