import { NextRequest, NextResponse } from 'next/server';
import swapiClient, { SwapiResponse, SwapiMovie } from '@/app/lib/swapi-client';
import { createLogger } from '@/app/lib/logger';

// Create a logger for this API route
const logger = createLogger('API:MoviesSearch');

export async function GET(request: NextRequest) {
  try {
    // Ensure we have a valid URL
    if (!request.url) {
      return NextResponse.json(
        { message: 'Invalid request URL' },
        { status: 400 }
      );
    }

    // Safely parse the URL and extract search params
    let searchParams;
    try {
      const url = new URL(request.url);
      searchParams = url.searchParams;
    } catch (e) {
      logger.error('Failed to parse URL:', e);
      return NextResponse.json(
        { message: 'Invalid URL format' },
        { status: 400 }
      );
    }
    
    const query = searchParams.get('q') || '';
    
    logger.debug(`GET /api/movies?q=${query}`);    
    
    if (!query) {
      return NextResponse.json(
        { message: 'Search query parameter "q" is required' },
        { status: 400 }
      );
    }
    
    // Fetch data from SWAPI
    const response: SwapiResponse<SwapiMovie> = await swapiClient.searchMovies(query);
    
    logger.debug(`SWAPI movies response structure: ${JSON.stringify(response, null, 2).slice(0, 500)}...`);
            
    const results = response.result as SwapiMovie[];    
    
    logger.debug(`Processing ${results.length} results: ${
      results.length > 0 ? JSON.stringify(results[0]).slice(0, 300) : 'No results'}`);
    
    const movies = results.map((movie: SwapiMovie, index: number) => { 
      logger.debug(`Processing movie item ${index}: ${JSON.stringify(movie).slice(0, 300)}`);      
      
      return {
        uid: movie.uid,
        title: movie?.properties?.title || 'Unknown',
        releaseDate: movie?.properties?.release_date || 'Unknown',
        director: movie?.properties?.director || 'Unknown',
        opening_crawl: movie?.properties?.opening_crawl || 'Unknown',
        characters: Array.isArray(movie?.properties?.characters) ? movie?.properties?.characters : []
      };
    });
    
    logger.debug(`Returning ${movies.length} movies with first item: ${
      movies.length > 0 ? JSON.stringify(movies[0]) : 'No items'}`);
        
    return NextResponse.json(movies);
  } catch (error) {
    logger.error('Error in movies API route:', error);
    
    // Handle specific error cases
    if (error instanceof Error && error.message.includes('404')) {
      return NextResponse.json(
        { message: 'Resource not found' },
        { status: 404 }
      );
    }
    
    // Default to 500 for unexpected errors
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
} 