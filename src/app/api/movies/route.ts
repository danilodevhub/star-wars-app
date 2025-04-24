import { NextResponse } from 'next/server';
import { Movie } from '../../types/movie';

const mockMovies: Movie[] = [
  {
    id: 1,
    title: "A New Hope",
    releaseDate: "1977-05-25",
    director: "George Lucas",
    opening_crawl: "It is a period of civil war. Rebel spaceships, striking from a hidden base, have won their first victory against the evil Galactic Empire.",
    characters: ["Luke Skywalker", "Leia Organa", "Han Solo", "Darth Vader"]
  },
  {
    id: 2,
    title: "The Empire Strikes Back",
    releaseDate: "1980-05-21",
    director: "Irvin Kershner",
    opening_crawl: "It is a dark time for the Rebellion. Although the Death Star has been destroyed, Imperial troops have driven the Rebel forces from their hidden base and pursued them across the galaxy.",
    characters: ["Luke Skywalker", "Leia Organa", "Han Solo", "Darth Vader", "Yoda"]
  }
];

export async function GET() {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return NextResponse.json(mockMovies);
} 