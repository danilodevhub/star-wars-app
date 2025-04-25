import { NextRequest, NextResponse } from 'next/server';
import swapiClient, { SwapiResponse, SwapiPerson } from '@/app/lib/swapi-client';
import { createLogger } from '@/app/lib/logger';

// Create a logger for this API route
const logger = createLogger('API:PeopleSearch');

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
    
    logger.debug(`GET /api/people?q=${query}`);
    
    if (!query) {
      return NextResponse.json(
        { message: 'Search query parameter "q" is required' },
        { status: 400 }
      );
    }
    
    // Fetch data from SWAPI
    const response: SwapiResponse<SwapiPerson> = await swapiClient.searchPeople(query);
        
    logger.debug(`SWAPI people response structure: ${JSON.stringify(response, null, 2).slice(0, 500)}...`);
        
    const results = response.result as SwapiPerson[];    
    
    logger.debug(`Processing ${results.length} results: ${results.length > 0 ? 
      JSON.stringify(results[0]).slice(0, 300) : 'No results'}`);
    
    const people = results.map((person: SwapiPerson, index: number) => {
      logger.debug(`Processing person item ${index}: ${JSON.stringify(person).slice(0, 300)}`);
      
      return {
        uid: person.uid,
        name: person?.properties?.name || 'Unknown',
        birth_year: person?.properties?.birth_year || 'Unknown',
        gender: person?.properties?.gender || 'Unknown',
        eye_color: person?.properties?.eye_color || 'Unknown',
        hair_color: person?.properties?.hair_color || 'Unknown',
        height: person?.properties?.height || 'Unknown',
        mass: person?.properties?.mass || 'Unknown',
        films: Array.isArray(person?.properties?.films) ? person?.properties?.films : []
      };
    });
    
    logger.debug(`Returning ${people.length} people with first item: ${
      people.length > 0 ? JSON.stringify(people[0]) : 'No items'}`);    
    
    return NextResponse.json(people);
  } catch (error) {
    logger.error('Error in people API route:', error);
    
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