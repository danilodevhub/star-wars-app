import { NextResponse } from 'next/server';
import { Movie } from '../../types/movie';

const mockMovies: Movie[] = [
  {
    id: 1,
    title: "A New Hope",
    releaseDate: "1977-05-25",
    director: "George Lucas"
  },
  {
    id: 2,
    title: "The Empire Strikes Back",
    releaseDate: "1980-05-21",
    director: "Irvin Kershner"
  }
];

export async function GET() {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  return NextResponse.json(mockMovies);
} 