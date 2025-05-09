import { db } from '../database/database';
import { ObjectId } from 'mongodb';

const formatDate2Number = (date?: string) => {
  return date ? parseInt(date.replace(/-/g, ''), 10) : NaN;
};

const formatDate2String = (date?: number) => {
  return date ? date.toString().replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3') : '';
};

export const resolvers = {
  symbols: async (args: { option?: { limit?: number; cursor?: string } }) => {
    const { option } = args;

    try {
      // Base query for fetching symbols
      const baseQuery = db.sqlite3('symbols').select('id', 'code', 'name', 'currency');

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
    return await db.sqlite3('symbols').where({ code }).first();
  },
  references: async (args: { startDate?: string; endDate?: string; symbol?: string, option?: { limit?: number; cursor?: string } }) => {
    const { startDate, endDate, symbol, option = {} } = args;
    const date = startDate === endDate ? startDate : null;
    const { limit, cursor } = option;

    // Build tradeDateYMD filter
    let tradeDateYMD: any = {};
    if (startDate) tradeDateYMD.$gte = formatDate2Number(startDate);
    if (endDate) tradeDateYMD.$lte = formatDate2Number(endDate);
    if (date) tradeDateYMD = formatDate2Number(date);

    // Combine filters
    const filters: Record<string, any> = { codeRic: symbol, tradeDateYMD };
    if (cursor) filters._id = { $lt: new ObjectId(cursor) };

    // Aggregation pipeline
    const pipeline: any[] = [
      { $match: filters }, // Apply filters
      { $sort: { _id: -1 } }, // Sort by _id in descending order
      {
        $facet: {
          total: [{ $count: "count" }], // Count total matching documents
          data: [
            ...(limit ? [{ $limit: limit + 1 }] : []), // Apply limit + 1 for pagination
            {
              $project: {
                id: "$_id",
                date: "$tradeDateYMD",
                rate: "$lastLocal",
                symbol: {
                  code: "$codeRic",
                  name: "$codeRic",
                  currency: "$currencyCode",
                },
              },
            },
          ],
        },
      },
    ];

    const result = await db.mongo().aggregate(pipeline).toArray();
    const total = result[0]?.total[0]?.count || 0;
    const references = result[0]?.data || [];
    const hasNext = !!limit && references.length > limit;

    return {
      total,
      nodes: references.slice(0, limit).map((r: any) => ({
        id: r.id.toString(),
        date: formatDate2String(r.date),
        rate: r.rate,
        symbol: r.symbol,
      })),
      info: {
        hasNext,
        cursor: hasNext ? references[limit - 1].id.toString() : null,
      },
    };
  },
};