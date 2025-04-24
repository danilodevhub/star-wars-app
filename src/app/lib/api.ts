import { Movie } from '../types/movie';
import { Person } from '../types/person';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '';

export async function fetchMovies(searchText: string): Promise<Movie[]> {
  const response = await fetch(`${API_BASE_URL}/api/movies?q=${encodeURIComponent(searchText)}`, {
    next: { revalidate: 3600 } // Revalidate every hour
  });

  if (!response.ok) {
    throw new Error('Failed to fetch movies');
  }

  return response.json();
}

export async function fetchMovieDetails(id: string): Promise<Movie> {
  const response = await fetch(`${API_BASE_URL}/api/movies/${id}`, {
    next: { revalidate: 3600 } // Revalidate every hour
  });

  if (!response.ok) {
    throw new Error('Failed to fetch movie details');
  }

  return response.json();
}

export async function fetchPeople(searchText: string): Promise<Person[]> {
  const response = await fetch(`${API_BASE_URL}/api/people?q=${encodeURIComponent(searchText)}`, {
    next: { revalidate: 3600 } // Revalidate every hour
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch people');
  }

  return response.json();
}

export async function fetchPersonDetails(id: string): Promise<Person> {
  const response = await fetch(`${API_BASE_URL}/api/people/${id}`, {
    next: { revalidate: 3600 } // Revalidate every hour
  });

  if (!response.ok) {
    throw new Error('Failed to fetch person details');
  }

  return response.json();
} 