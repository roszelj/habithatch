import { type Habitat, type HabitatId } from './types';

export const HABITATS: Habitat[] = [
  { id: 'water-park',        name: 'Water Park',       image: '/creature-habitats/01_water_park.png',       price: 20 },
  { id: 'beach',             name: 'Beach',             image: '/creature-habitats/02_beach.png',             price: 20 },
  { id: 'cosy-bedroom',      name: 'Cosy Bedroom',      image: '/creature-habitats/03_cosy_bedroom.png',      price: 20 },
  { id: 'waterfall-forest',  name: 'Waterfall Forest',  image: '/creature-habitats/04_waterfall_forest.png',  price: 25 },
  { id: 'candy-village',     name: 'Candy Village',     image: '/creature-habitats/05_candy_village.png',     price: 25 },
  { id: 'magic-forest-pond', name: 'Magic Forest',      image: '/creature-habitats/06_magic_forest_pond.png', price: 25 },
  { id: 'sunny-farm',        name: 'Sunny Farm',        image: '/creature-habitats/07_sunny_farm.png',        price: 30 },
  { id: 'snowy-cabin',       name: 'Snowy Cabin',       image: '/creature-habitats/08_snowy_cabin.png',       price: 30 },
  { id: 'fairytale-castle',  name: 'Fairytale Castle',  image: '/creature-habitats/09_fairytale_castle.png',  price: 35 },
  { id: 'garden-tea-party', name: 'Garden Tea Party',  image: '/creature-habitats/10_garden_tea_party.png',  price: 35 },
  { id: 'toy-workshop',     name: 'Toy Workshop',      image: '/creature-habitats/11_toy_workshop.png',      price: 40 },
  { id: 'jungle-waterfall', name: 'Jungle Waterfall',  image: '/creature-habitats/12_jungle_waterfall.png',  price: 40 },
  { id: 'carnival',         name: 'Carnival',          image: '/creature-habitats/13_carnival.png',          price: 40 },
  { id: 'magic-library',    name: 'Magic Library',     image: '/creature-habitats/14_magic_library.png',     price: 45 },
  { id: 'pumpkin-patch',    name: 'Pumpkin Patch',     image: '/creature-habitats/15_pumpkin_patch.png',     price: 45 },
  { id: 'fairy-pond',       name: 'Fairy Pond',        image: '/creature-habitats/16_fairy_pond.png',        price: 45 },
  { id: 'picnic-meadow',    name: 'Picnic Meadow',     image: '/creature-habitats/17_picnic_meadow.png',     price: 50 },
  { id: 'candy-shop',       name: 'Candy Shop',        image: '/creature-habitats/18_candy_shop.png',        price: 50 },
];

export function getHabitatById(id: HabitatId | null): Habitat | null {
  if (!id) return null;
  return HABITATS.find(h => h.id === id) ?? null;
}
