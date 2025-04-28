import { NextResponse } from 'next/server';
import { createLogger } from '@/app/lib/logger';
import { getTopQueriesBySearchType, getPopularHourStats } from '@/services/redis';

// Create a logger for this API route
const logger = createLogger('API:Stats');

export async function GET() {  
  try {
    logger.debug('GET /api/v1/stats');
    
    // Get stats for both search types and popular hour
    const [peopleStats, moviesStats, popularHourStats] = await Promise.all([
      getTopQueriesBySearchType('people'),
      getTopQueriesBySearchType('movies'),
      getPopularHourStats()
    ]);
    
    const queries = [];
    
    if (peopleStats) {
      queries.push({
        searchType: 'people',
        ...peopleStats
      });
    }
    
    if (moviesStats) {
      queries.push({
        searchType: 'movies',
        ...moviesStats
      });
    }
    
    if (queries.length === 0) {
      return NextResponse.json(
        { message: 'No statistics found' },
        { status: 404 }
      );
    }
    
    const response = {
      queries,
      ...(popularHourStats && { mostPopularSearchHour: popularHourStats })
    };
    
    logger.debug(`Returning stats: ${JSON.stringify(response)}`);
    
    return NextResponse.json(response);
  } catch (error) {
    logger.error('Error in stats API route:', error);
    
    // Default to 500 for unexpected errors
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
} 