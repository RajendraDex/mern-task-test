export interface ListOptions {
	page: number,
	limit: number,
	filter: Record<string, any>,
	sortBy: { name: string, order: 'asc' | 'desc' }
}
