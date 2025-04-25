import { NextRequest, NextResponse } from 'next/server';
import swapiClient, { SwapiResponse, SwapiPerson, SwapiMovie } from '@/app/lib/swapi-client';
import { createLogger } from '@/app/lib/logger';

// Create a logger for this API route
const logger = createLogger('API:PersonDetails');

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{
    id: string;
  }> }
) {
  try {
    const id = (await params).id;
    
    logger.debug(`GET /api/people/${id}`);
    
    if (!id) {
      return NextResponse.json(
        { message: 'Person ID is required' },
        { status: 400 }
      );
    }
    
    // Fetch person details from SWAPI
    const personResponse: SwapiResponse<SwapiPerson> = await swapiClient.getPerson(id);
    
    if (!personResponse.result) {
      return NextResponse.json(
        { message: 'Person not found' },
        { status: 404 }
      );
    }
        
    const personData = personResponse.result as SwapiPerson;      
    
    // Fetch film details if the person has films
    const filmPromises = personData.properties?.films
      ? personData.properties.films.map(async (filmUrl) => {
          try {
            const filmResponse = await swapiClient.fetchFromUrl<{result: SwapiMovie}>(filmUrl, 'film');
            const film = filmResponse.result;
            
            return {
              uid: film.uid,
              title: film.properties?.title || 'Unknown Title',
              url: `/movies/${film.uid}`
            };
          } catch (error) {
            logger.error(`Error fetching film details for ${filmUrl}`, error);
            return null;
          }
        })
      : [];

    // Wait for all film requests to complete
    const films = (await Promise.all(filmPromises)).filter(film => film !== null);
    
    // Format the response
    const formattedPerson = {
      uid: personData.uid || id,
      name: personData?.properties?.name || 'Unknown',
      birth_year: personData?.properties?.birth_year || 'Unknown',
      gender: personData?.properties?.gender || 'Unknown',
      eye_color: personData?.properties?.eye_color || 'Unknown',
      hair_color: personData?.properties?.hair_color || 'Unknown',
      height: personData?.properties?.height || 'Unknown',
      mass: personData?.properties?.mass || 'Unknown',
      films
    };
    
    return NextResponse.json(formattedPerson);
  } catch (error) {
    logger.error(`Error fetching person:`, error);
    
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