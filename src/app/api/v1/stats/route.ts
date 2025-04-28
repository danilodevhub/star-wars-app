import { NextRequest, NextResponse } from 'next/server';
import { createLogger } from '@/app/lib/logger';
import { getTopQueriesBySearchType } from '@/services/redis';

// Create a logger for this API route
const logger = createLogger('API:Stats');

export async function GET(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    logger.debug('GET /api/v1/stats');
    
    // Get stats for both search types
    const [peopleStats, moviesStats] = await Promise.all([
      getTopQueriesBySearchType('people'),
      getTopQueriesBySearchType('movies')
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
    
    logger.debug(`Returning stats: ${JSON.stringify(queries)}`);
    
    return NextResponse.json({ queries });
  } catch (error) {
    logger.error('Error in stats API route:', error);
    
    // Default to 500 for unexpected errors
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
} 