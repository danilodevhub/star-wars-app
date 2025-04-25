export interface Person {
  uid: string;
  name: string;
  birth_year: string;
  gender: string;
  eye_color: string;
  hair_color: string;
  height: string;
  mass: string;
  films: Array<{ uid: string; title: string }>;
} 