import { db } from '../database/database';

export const resolvers = {
  symbols: async (args: { option?: { limit?: number; cursor?: string } }) => {
    const { option } = args;

    try {
      // Base query for fetching symbols
      const baseQuery = db('symbols').select('id', 'code', 'name', 'currency');

      // Clone the base query to calculate the total count
      const totalQuery = baseQuery.clone().clearSelect().count('* as total');
      const totalResult = await totalQuery;
      const total = totalResult[0]?.total || 0;

      // Apply pagination options
      if (option?.cursor) {
        baseQuery.where('id', '>', option.cursor);
      }
      if (option?.limit) {
        baseQuery.limit(option.limit + 1); // Fetch one extra record to determine `hasNext`
      }

      // Execute the filtered query
      const results = await baseQuery;

      // Parse the results and handle pagination
      const nodes = results.slice(0, option?.limit || results.length);
      const hasNext = results.length > (option?.limit || 0);

      return {
        total, // Total count from the unfiltered base query
        nodes,
        info: {
          hasNext,
          cursor: nodes[nodes.length - 1]?.id || null,
        },
      };
    } catch (error) {
      console.error('Error fetching symbols:', error);
      throw new Error('Failed to fetch symbols');
    }
  },
  symbol: async (args: { code: string }) => {
    const { code } = args;
    return await db('symbols').where({ code }).first();
  },
  references: async (args: { startDate?: string; endDate?: string; symbol?: string, option?: { limit?: number; cursor?: string } }) => {
    const { startDate, endDate, symbol, option } = args;
    const date = startDate === endDate ? startDate : null;

    try {
      // Base query for fetching references
      const baseQuery = db('references')
        .join('symbols', 'references.symbol', '=', 'symbols.id')
        .select(
          'references.id',
          'references.rate',
          'references.date',
          db.raw('json_object(\'code\', symbols.code, \'name\', symbols.name, \'currency\', symbols.currency) as symbol')
        );

      // Apply filters and pagination to the base query
      if (date) {
        baseQuery.where('references.date', '=', date);
      }
      if (startDate && endDate) {
        baseQuery.whereBetween('references.date', [startDate, endDate]);
      } else if (startDate) {
        baseQuery.where('references.date', '>=', startDate);
      } else if (endDate) {
        baseQuery.where('references.date', '<=', endDate);
      }
      if (symbol) {
        baseQuery.where('symbols.code', '=', symbol); // Fixed alias
      }
      if (option?.cursor) {
        baseQuery.where('references.id', '>', option.cursor);
      }
      if (option?.limit) {
        baseQuery.limit(option.limit + 1); // Fetch one extra record to determine `hasNext`
      }

      // Clone the base query to calculate the total count
      const totalQuery = baseQuery.clone().count('* as total');
      const totalResult = await totalQuery;
      const total = totalResult[0]?.total || 0;

      // Execute the filtered query
      const results = await baseQuery;

      // Parse the results and handle pagination
      const nodes = results.slice(0, option?.limit || results.length).map((reference) => ({
        ...reference,
        symbol: JSON.parse(reference.symbol),
      }));

      const hasNext = results.length > (option?.limit || 0);

      return {
        total, // Total count from the unfiltered base query
        nodes,
        info: {
          hasNext,
          cursor: hasNext ? nodes[nodes.length - 1].id : null,
        },
      };
    } catch (error) {
      console.error('Error fetching references:', error);
      throw new Error('Failed to fetch references');
    }
  },
};