export const TOTAL_POKEMON = 1025;

export const TYPE_COLORS: Record<string, string> = {
  normal: "#A8A878", fire: "#F08030", water: "#6890F0", grass: "#78C850",
  electric: "#F8D030", ice: "#98D8D8", fighting: "#C03028", poison: "#A040A0",
  ground: "#E0C068", flying: "#A890F0", psychic: "#F85888", bug: "#A8B820",
  rock: "#B8A038", ghost: "#705898", dragon: "#7038F8", dark: "#705848",
  steel: "#B8B8D0", fairy: "#EE99AC",
};

export const ULTRA_BEASTS = new Set([793,794,795,796,797,798,799,803,804,805,806]);
export const PARADOX = new Set([
  984,985,986,987,988,989,990,991,992,993,994,995,
  1005,1006,1007,1008,1009,1010,1020,1021,1022,1023,1024,1025,
]);

export const NAME_OVERRIDES: Record<string, string> = {
  "nidoran-f": "Nidoran♀", "nidoran-m": "Nidoran♂",
  "mr-mime": "Mr. Mime", "mime-jr": "Mime Jr.", "mr-rime": "Mr. Rime",
  "farfetchd": "Farfetch'd", "sirfetchd": "Sirfetch'd",
  "flabebe": "Flabébé", "type-null": "Type: Null",
  "jangmo-o": "Jangmo-o", "hakamo-o": "Hakamo-o", "kommo-o": "Kommo-o",
  "tapu-koko": "Tapu Koko", "tapu-lele": "Tapu Lele",
  "tapu-bulu": "Tapu Bulu", "tapu-fini": "Tapu Fini",
  "porygon-z": "Porygon-Z", "ho-oh": "Ho-Oh",
  "chi-yu": "Chi-Yu", "chien-pao": "Chien-Pao",
  "ting-lu": "Ting-Lu", "wo-chien": "Wo-Chien",
  "great-tusk": "Great Tusk", "scream-tail": "Scream Tail",
  "brute-bonnet": "Brute Bonnet", "flutter-mane": "Flutter Mane",
  "slither-wing": "Slither Wing", "sandy-shocks": "Sandy Shocks",
  "iron-treads": "Iron Treads", "iron-bundle": "Iron Bundle",
  "iron-hands": "Iron Hands", "iron-jugulis": "Iron Jugulis",
  "iron-moth": "Iron Moth", "iron-thorns": "Iron Thorns",
  "roaring-moon": "Roaring Moon", "iron-valiant": "Iron Valiant",
  "walking-wake": "Walking Wake", "iron-leaves": "Iron Leaves",
  "gouging-fire": "Gouging Fire", "raging-bolt": "Raging Bolt",
  "iron-boulder": "Iron Boulder", "iron-crown": "Iron Crown",
};

export const GEN_LABELS: Record<number, string> = {
  1: "Generation I (Kanto)", 2: "Generation II (Johto)", 3: "Generation III (Hoenn)",
  4: "Generation IV (Sinnoh)", 5: "Generation V (Unova)", 6: "Generation VI (Kalos)",
  7: "Generation VII (Alola)", 8: "Generation VIII (Galar)", 9: "Generation IX (Paldea)",
};

export const GEN_MAP: Record<string, number> = {
  "generation-i": 1, "generation-ii": 2, "generation-iii": 3,
  "generation-iv": 4, "generation-v": 5, "generation-vi": 6,
  "generation-vii": 7, "generation-viii": 8, "generation-ix": 9,
};

export const FORM_REGIONS: Record<string, string> = {
  alola: "Alola", alolan: "Alola", galar: "Galar", galarian: "Galar",
  hisui: "Hisui", hisuian: "Hisui", paldea: "Paldea", paldean: "Paldea",
};
