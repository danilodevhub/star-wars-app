import { NextResponse } from 'next/server';

const mockPerson = {
  name: "Bib Fortuna",
  birth_year: "24BBY",
  gender: "male",
  eye_color: "brown",
  hair_color: "black",
  height: "183",
  mass: "84",
  films: [
    "Return of the Jedi"
  ]
};

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  return NextResponse.json(mockPerson);
} 