import { NextResponse } from 'next/server';

const mockMovie = {
  title: "Return of the Jedi",
  opening_crawl: `Luke Skywalker has returned to
his home planet of Tatooine in
an attempt to rescue his
friend Han Solo from the
clutches of the vile gangster
Jabba the Hutt.

Little does Luke know that the
GALACTIC EMPIRE has secretly
begun construction on a new
armored space station even
more powerful than the first
dreaded Death Star.

When completed, this ultimate
weapon will spell certain doom
for the small band of rebels
struggling to restore freedom
to the galaxy...`,
  characters: [
    "Luke Skywalker",
    "Jabba Deslilijic Tiure",
    "Wedge Antilles",
    "Jek Tono Porkins",
    "Raymus Antilles",
    "C-3PO",
    "R2-D2",
    "Darth Vader",
    "Bib Fortuna",
    "Leia Organa",
    "Owen Lars",
    "Beru Whitesun Lars",
    "R5-D4",
    "Biggs Darklight",
    "Obi-Wan Kenobi",
    "Wilhuff Tarkin",
    "Chewbacca",
    "Han Solo"
  ]
};

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 3000));

  return NextResponse.json(mockMovie);
} 