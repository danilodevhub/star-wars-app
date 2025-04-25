/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from 'next/server';
import swapiClient, { SwapiResponse, SwapiMovie, SwapiPerson } from '@/app/lib/swapi-client';
import { createLogger } from '@/app/lib/logger';

// Create a logger for this API route
const logger = createLogger('API:MovieDetails');

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{
    id: string;
  }> }
) {
  try {
    const id = (await params).id;
    
    logger.debug(`GET /api/movies/${id}`);
    
    if (!id) {
      return NextResponse.json(
        { message: 'Movie ID is required' },
        { status: 400 }
      );
    }
    
    // Fetch movie details from SWAPI
    const movieResponse: SwapiResponse<SwapiMovie> = await swapiClient.getMovie(id);
    
    if (!movieResponse.result) {
      return NextResponse.json(
        { message: 'Movie not found' },
        { status: 404 }
      );
    }
    
    const movieData = movieResponse.result as SwapiMovie;      
    
    // Also fetch the character names for the movie
    const characterPromises = movieData.properties?.characters
      ? movieData.properties?.characters.map(async (characterUrl: string) => {
          try {
            const characterResponse = await swapiClient.fetchFromUrl<{result: SwapiPerson}>(characterUrl, 'character');
            const character = characterResponse.result;
            
            return {
              uid: character.uid,
              name: character.properties?.name || 'Unknown',
              url: `/people/${character.uid}`
            };
          } catch (error) {
            logger.error(`Error fetching person details for ${characterUrl}`, error);
            return null;
          }
        })
      : [];

    // Wait for all character requests to complete
    const characters = (await Promise.all(characterPromises)).filter(character => character !== null);
    
    // Format the response
    const formattedMovie = {
      uid: movieData.uid || id,
      title: movieData?.properties?.title || 'Unknown',
      releaseDate: movieData?.properties?.release_date || 'Unknown',
      director: movieData?.properties?.director || 'Unknown',
      opening_crawl: movieData?.properties?.opening_crawl || '',
      characters
    };
    
    return NextResponse.json(formattedMovie);
  } catch (error) {
    logger.error(`Error fetching movie:`, error);
    
    // Handle specific error cases
    if (error instanceof Error) {
      if (error.message.includes('404')) {
        return NextResponse.json(
          { message: 'Person not found' },
          { status: 404 }
        );
      }
      
      if (error.message.includes('400')) {
        return NextResponse.json(
          { message: 'Invalid request' },
          { status: 400 }
        );
      }
    }
    
    // Default to 500 for unexpected errors
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
} 