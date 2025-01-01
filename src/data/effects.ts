export interface Effect {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
}

export const effects: Effect[] = [
  {
    id: 'peel',
    name: 'Peel',
    description: 'Create a peeling effect animation',
    imageUrl: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 'rip',
    name: 'Rip',
    description: 'Tear and rip effect animation',
    imageUrl: 'https://images.unsplash.com/photo-1582139329536-e7284fece509?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 'poke',
    name: 'Poke',
    description: 'Interactive poking animation',
    imageUrl: 'https://images.unsplash.com/photo-1507120410856-1f35574c3b45?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 'behead',
    name: 'Behead',
    description: 'Head replacement effect',
    imageUrl: 'https://images.unsplash.com/photo-1576016770956-debb63d92058?auto=format&fit=crop&q=80&w=400'
  }
];