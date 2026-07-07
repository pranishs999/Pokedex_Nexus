/**
 * PKMP seed script — Gen I (151 Pokémon) + 18 types + abilities + moves
 * Run: pnpm tsx scripts/src/seed.ts
 */
import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import {
  typesTable,
  abilitiesTable,
  movesTable,
  pokemonTable,
  pokemonTypesTable,
  pokemonAbilitiesTable,
  pokemonMovesTable,
  evolutionsTable,
  formsTable,
} from "./schema/index.js";

const { Pool } = pg;

if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL not set");
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle(pool);

// ─── TYPES ────────────────────────────────────────────────────────────────────
const TYPES = [
  { name: "Normal",   color: "#A8A878" },
  { name: "Fire",     color: "#F08030" },
  { name: "Water",    color: "#6890F0" },
  { name: "Grass",    color: "#78C850" },
  { name: "Electric", color: "#F8D030" },
  { name: "Ice",      color: "#98D8D8" },
  { name: "Fighting", color: "#C03028" },
  { name: "Poison",   color: "#A040A0" },
  { name: "Ground",   color: "#E0C068" },
  { name: "Flying",   color: "#A890F0" },
  { name: "Psychic",  color: "#F85888" },
  { name: "Bug",      color: "#A8B820" },
  { name: "Rock",     color: "#B8A038" },
  { name: "Ghost",    color: "#705898" },
  { name: "Dragon",   color: "#7038F8" },
  { name: "Dark",     color: "#705848" },
  { name: "Steel",    color: "#B8B8D0" },
  { name: "Fairy",    color: "#EE99AC" },
];

// ─── ABILITIES ─────────────────────────────────────────────────────────────────
const ABILITIES = [
  { name: "Overgrow",        description: "Powers up Grass-type moves when the Pokémon's HP is low." },
  { name: "Blaze",           description: "Powers up Fire-type moves when the Pokémon's HP is low." },
  { name: "Torrent",         description: "Powers up Water-type moves when the Pokémon's HP is low." },
  { name: "Chlorophyll",     description: "Boosts the Pokémon's Speed stat in sunshine." },
  { name: "Solar Power",     description: "Boosts Sp. Atk in harsh sunlight, but HP decreases every turn." },
  { name: "Rain Dish",       description: "The Pokémon gradually regains HP in rain." },
  { name: "Shell Armor",     description: "A hard shell protects the Pokémon from critical hits." },
  { name: "Thick Fat",       description: "Reduces damage from Fire- and Ice-type moves." },
  { name: "Intimidate",      description: "Lowers the opposing Pokémon's Attack stat." },
  { name: "Shed Skin",       description: "The Pokémon may cure its own status conditions by shedding its skin." },
  { name: "Compound Eyes",   description: "The Pokémon's compound eyes boost its accuracy." },
  { name: "Tinted Lens",     description: "Powers up 'not very effective' moves." },
  { name: "Swarm",           description: "Powers up Bug-type moves when the Pokémon's HP is low." },
  { name: "Run Away",        description: "Enables the Pokémon to always run from wild Pokémon." },
  { name: "Keen Eye",        description: "Prevents other Pokémon from lowering accuracy." },
  { name: "Tangled Feet",    description: "Raises evasiveness if the Pokémon is confused." },
  { name: "Big Pecks",       description: "Protects the Pokémon from Defense-lowering effects." },
  { name: "Guts",            description: "Boosts Attack if the Pokémon has a status condition." },
  { name: "Hustle",          description: "Boosts Attack but lowers accuracy." },
  { name: "Sand Veil",       description: "Boosts evasiveness in a sandstorm." },
  { name: "Static",          description: "Contact with the Pokémon may cause paralysis." },
  { name: "Lightning Rod",   description: "Draws in all Electric-type moves to boost Sp. Atk." },
  { name: "Swift Swim",      description: "Boosts the Pokémon's Speed stat in rain." },
  { name: "Water Absorb",    description: "Restores HP if hit by a Water-type move." },
  { name: "Damp",            description: "Prevents the use of self-destructing moves." },
  { name: "Oblivious",       description: "Prevents the Pokémon from being infatuated or taunted." },
  { name: "Own Tempo",       description: "Prevents the Pokémon from becoming confused." },
  { name: "Regenerator",     description: "Restores a little HP when withdrawn from battle." },
  { name: "Limber",          description: "The Pokémon is protected from paralysis." },
  { name: "Cute Charm",      description: "Contact with the Pokémon may cause infatuation." },
  { name: "Technician",      description: "Powers up the Pokémon's weaker moves." },
  { name: "Flame Body",      description: "Contact with the Pokémon may burn the attacker." },
  { name: "Flash Fire",      description: "Powers up Fire-type moves if hit by one." },
  { name: "Drought",         description: "Turns the sunlight harsh when the Pokémon enters a battle." },
  { name: "Levitate",        description: "Gives full immunity to all Ground-type moves." },
  { name: "Soundproof",      description: "Gives full immunity to all sound-based moves." },
  { name: "Synchronize",     description: "Passes a burn, poison, or paralysis to the Pokémon that inflicted it." },
  { name: "Inner Focus",     description: "The Pokémon's intensely focused, and that protects the Pokémon from flinching." },
  { name: "Pressure",        description: "By putting pressure on the opposing Pokémon, it raises their PP usage." },
  { name: "Unnerve",         description: "Unnerves opposing Pokémon and makes them unable to eat Berries." },
  { name: "Clear Body",      description: "Prevents other Pokémon from lowering its stats." },
  { name: "Liquid Ooze",     description: "Damages attackers using any HP-draining moves." },
  { name: "Natural Cure",    description: "All status conditions heal when the Pokémon switches out." },
  { name: "Serene Grace",    description: "Boosts the likelihood of additional effects occurring." },
  { name: "Hustle",          description: "Boosts Attack but lowers accuracy." },
  { name: "Rock Head",       description: "Protects the Pokémon from recoil damage." },
  { name: "Sturdy",          description: "It cannot be knocked out with one hit." },
  { name: "Vital Spirit",    description: "Prevents the Pokémon from falling asleep." },
  { name: "Early Bird",      description: "The Pokémon awakens quickly from sleep." },
  { name: "Hyper Cutter",    description: "Prevents other Pokémon from lowering Attack." },
  { name: "Arena Trap",      description: "Prevents the opposing Pokémon from fleeing." },
  { name: "Sand Force",      description: "Boosts certain moves' power in a sandstorm." },
  { name: "Anger Point",     description: "Maxes Attack after taking a critical hit." },
  { name: "Rattled",         description: "Bug-, Ghost-, or Dark-type moves scare the Pokémon and boost its Speed." },
  { name: "Pickup",          description: "The Pokémon may pick up items." },
  { name: "Gluttony",        description: "Makes the Pokémon eat a held Berry earlier than usual." },
  { name: "Immunity",        description: "Prevents the Pokémon from getting poisoned." },
  { name: "Stench",          description: "By releasing stench when attacking, the Pokémon may cause the target to flinch." },
  { name: "Sticky Hold",     description: "Protects the Pokémon from item theft." },
  { name: "Cloud Nine",      description: "Eliminates the effects of weather." },
  { name: "Swift Swim",      description: "Boosts the Pokémon's Speed stat in rain." },
];

// deduplicate by name
const ABILITIES_DEDUPED = Array.from(new Map(ABILITIES.map(a => [a.name, a])).values());

// ─── MOVES ─────────────────────────────────────────────────────────────────────
const MOVES: Array<{
  name: string; type: string; category: "Physical"|"Special"|"Status";
  power?: number; accuracy?: number; pp: number; priority?: number; description: string;
}> = [
  { name: "Pound",          type: "Normal",   category: "Physical", power: 40,  accuracy: 100, pp: 35, description: "Pounds with forelegs or tail." },
  { name: "Tackle",         type: "Normal",   category: "Physical", power: 40,  accuracy: 100, pp: 35, description: "A physical attack in which the user charges and slams into the target." },
  { name: "Scratch",        type: "Normal",   category: "Physical", power: 40,  accuracy: 100, pp: 35, description: "Hard, pointed, sharp claws rake the target." },
  { name: "Growl",          type: "Normal",   category: "Status",               accuracy: 100, pp: 40, description: "Weakens the foe's Attack." },
  { name: "Tail Whip",      type: "Normal",   category: "Status",               accuracy: 100, pp: 30, description: "Weakens the foe's Defense." },
  { name: "Vine Whip",      type: "Grass",    category: "Physical", power: 45,  accuracy: 100, pp: 25, description: "Strikes with slender, whiplike vines." },
  { name: "Ember",          type: "Fire",     category: "Special",  power: 40,  accuracy: 100, pp: 25, description: "The target is attacked with small flames. May inflict a burn." },
  { name: "Water Gun",      type: "Water",    category: "Special",  power: 40,  accuracy: 100, pp: 25, description: "Blasts the foe with a powerful shot of water." },
  { name: "Flamethrower",   type: "Fire",     category: "Special",  power: 90,  accuracy: 100, pp: 15, description: "Targets are hit with a strong flame. May inflict a burn." },
  { name: "Fire Blast",     type: "Fire",     category: "Special",  power: 110, accuracy: 85,  pp: 5,  description: "Hits the foe with an intense blast of all-consuming fire. May inflict a burn." },
  { name: "Surf",           type: "Water",    category: "Special",  power: 90,  accuracy: 100, pp: 15, description: "Strikes everything around the user with a giant wave." },
  { name: "Hydro Pump",     type: "Water",    category: "Special",  power: 110, accuracy: 80,  pp: 5,  description: "Blasts the foe with a forceful shot of water." },
  { name: "Solar Beam",     type: "Grass",    category: "Special",  power: 120, accuracy: 100, pp: 10, description: "Absorbs light in one turn, then blasts a beam the next turn." },
  { name: "Razor Leaf",     type: "Grass",    category: "Physical", power: 55,  accuracy: 95,  pp: 25, description: "Launches sharp-edged leaves at the foe. High critical-hit ratio." },
  { name: "Thunderbolt",    type: "Electric", category: "Special",  power: 90,  accuracy: 100, pp: 15, description: "A strong electric blast is loosed at the target. May cause paralysis." },
  { name: "Thunder",        type: "Electric", category: "Special",  power: 110, accuracy: 70,  pp: 10, description: "A wicked thunderbolt is dropped on the target. May cause paralysis." },
  { name: "Thunder Wave",   type: "Electric", category: "Status",               accuracy: 90,  pp: 20, description: "Paralyzes the foe." },
  { name: "Psychic",        type: "Psychic",  category: "Special",  power: 90,  accuracy: 100, pp: 10, description: "A telekinetic attack. May lower the target's Sp. Def." },
  { name: "Ice Beam",       type: "Ice",      category: "Special",  power: 90,  accuracy: 100, pp: 10, description: "Blasts the foe with an icy beam. May freeze the foe." },
  { name: "Blizzard",       type: "Ice",      category: "Special",  power: 110, accuracy: 70,  pp: 5,  description: "Hits the foe with a violent cold wave. May freeze the foe." },
  { name: "Earthquake",     type: "Ground",   category: "Physical", power: 100, accuracy: 100, pp: 10, description: "A powerful quake, but fails against flying and levitating foes." },
  { name: "Rock Slide",     type: "Rock",     category: "Physical", power: 75,  accuracy: 90,  pp: 10, description: "Large boulders are hurled at opposing Pokémon. May cause flinching." },
  { name: "Slash",          type: "Normal",   category: "Physical", power: 70,  accuracy: 100, pp: 20, description: "Slashes with sharp claws. High critical-hit ratio." },
  { name: "Swords Dance",   type: "Normal",   category: "Status",                              pp: 20, description: "Sharply boosts the user's Attack." },
  { name: "Hyper Beam",     type: "Normal",   category: "Special",  power: 150, accuracy: 90,  pp: 5,  description: "Powerful, but leaves the user immobile the next turn." },
  { name: "Body Slam",      type: "Normal",   category: "Physical", power: 85,  accuracy: 100, pp: 15, description: "Slams the foe with the full bulk of the body. May cause paralysis." },
  { name: "Toxic",          type: "Poison",   category: "Status",               accuracy: 90,  pp: 10, description: "Badly poisons the foe." },
  { name: "Double-Edge",    type: "Normal",   category: "Physical", power: 120, accuracy: 100, pp: 15, description: "A reckless, life-risking tackle that also hurts the user." },
  { name: "Submission",     type: "Fighting", category: "Physical", power: 80,  accuracy: 80,  pp: 20, description: "The user grabs the target and recklessly dives for the ground. Also hurts the user." },
  { name: "Cut",            type: "Normal",   category: "Physical", power: 50,  accuracy: 95,  pp: 30, description: "Cuts the foe with sharp scythes, claws, etc. It can also be used to cut down thin trees." },
  { name: "Gust",           type: "Flying",   category: "Special",  power: 40,  accuracy: 100, pp: 35, description: "A gust of wind is whipped up by wings and launched at the target to inflict damage." },
  { name: "Wing Attack",    type: "Flying",   category: "Physical", power: 60,  accuracy: 100, pp: 35, description: "The target is struck with large, imposing wings spread wide to inflict damage." },
  { name: "Fly",            type: "Flying",   category: "Physical", power: 90,  accuracy: 95,  pp: 15, description: "Flies up on the first turn, then strikes the next turn." },
  { name: "Aerial Ace",     type: "Flying",   category: "Physical", power: 60,  accuracy: 100, pp: 20, description: "The user confounds the target with speed, then slashes. This attack never misses." },
  { name: "Poison Powder",  type: "Poison",   category: "Status",               accuracy: 75,  pp: 35, description: "Scatters a cloud of poisonous dust on the target." },
  { name: "Sleep Powder",   type: "Grass",    category: "Status",               accuracy: 75,  pp: 15, description: "Scatters a big cloud of sleep-inducing dust around the target." },
  { name: "Leech Seed",     type: "Grass",    category: "Status",               accuracy: 90,  pp: 10, description: "Plants a seed on the foe, which steals HP from the foe every turn." },
  { name: "String Shot",    type: "Bug",      category: "Status",               accuracy: 95,  pp: 40, description: "Binds the foe with silk blown from the mouth to lower Speed." },
  { name: "Bug Bite",       type: "Bug",      category: "Physical", power: 60,  accuracy: 100, pp: 20, description: "The user bites the target. If the target is holding a Berry, the user eats it and gains its effect." },
  { name: "Harden",         type: "Normal",   category: "Status",                              pp: 30, description: "Stiffens all the muscles in its body to raise Defense." },
  { name: "Bubble",         type: "Water",    category: "Special",  power: 40,  accuracy: 100, pp: 30, description: "A spray of countless bubbles is jetted at the opposing Pokémon. May lower Speed." },
  { name: "Withdraw",       type: "Water",    category: "Status",                              pp: 40, description: "The user withdraws its body into its hard shell, raising its Defense." },
  { name: "Water Pulse",    type: "Water",    category: "Special",  power: 60,  accuracy: 100, pp: 20, description: "Attacks with a pulsing blast of water. May confuse the target." },
  { name: "Bite",           type: "Dark",     category: "Physical", power: 60,  accuracy: 100, pp: 25, description: "The target is bitten with viciously sharp fangs. May cause flinching." },
  { name: "Dragon Rage",    type: "Dragon",   category: "Special",  power: 40,  accuracy: 100, pp: 10, description: "This attack hits the target with a shock wave of pure rage. Always inflicts 40 HP." },
  { name: "Leer",           type: "Normal",   category: "Status",               accuracy: 100, pp: 30, description: "Frightens the foe with a leer to lower its Defense." },
  { name: "Headbutt",       type: "Normal",   category: "Physical", power: 70,  accuracy: 100, pp: 15, description: "The user sticks out its head and attacks by charging straight into the target. May cause flinching." },
  { name: "Mega Punch",     type: "Normal",   category: "Physical", power: 80,  accuracy: 85,  pp: 20, description: "The target is slugged by a punch thrown with muscle-packed power." },
  { name: "Karate Chop",    type: "Fighting", category: "Physical", power: 50,  accuracy: 100, pp: 25, description: "The target is attacked with a sharp chop. High critical-hit ratio." },
  { name: "Low Kick",       type: "Fighting", category: "Physical", power: 65,  accuracy: 100, pp: 20, description: "A powerful low kick that makes the target fall over. The heavier the target, the greater the damage." },
  { name: "Confusion",      type: "Psychic",  category: "Special",  power: 50,  accuracy: 100, pp: 25, description: "The target is hit by a weak telekinetic force. May cause confusion." },
  { name: "Disable",        type: "Normal",   category: "Status",               accuracy: 100, pp: 20, description: "Disables the foe's last move." },
  { name: "Absorb",         type: "Grass",    category: "Special",  power: 20,  accuracy: 100, pp: 25, description: "A nutrient-draining attack. The user's HP is restored by half the damage taken by the target." },
  { name: "Mega Drain",     type: "Grass",    category: "Special",  power: 40,  accuracy: 100, pp: 15, description: "A nutrient-draining attack." },
  { name: "Skull Bash",     type: "Normal",   category: "Physical", power: 130, accuracy: 100, pp: 10, description: "Tucks the head to raise Defense in the first turn, then attacks on the second turn." },
  { name: "Fire Spin",      type: "Fire",     category: "Special",  power: 35,  accuracy: 85,  pp: 15, description: "Traps the foe in a fierce vortex of fire for 2–5 turns." },
  { name: "Smokescreen",    type: "Normal",   category: "Status",               accuracy: 100, pp: 20, description: "Envelops the target in a smokescreen that sharply reduces accuracy." },
  { name: "Scary Face",     type: "Normal",   category: "Status",               accuracy: 100, pp: 10, description: "Makes the foe frightened to sharply reduce its Speed." },
  { name: "Flamethrow",     type: "Normal",   category: "Special",  power: 90,  accuracy: 100, pp: 15, description: "Fallback placeholder." },
  { name: "Agility",        type: "Psychic",  category: "Status",                              pp: 30, description: "Relaxes the body to sharply boost Speed." },
  { name: "Swift",          type: "Normal",   category: "Special",  power: 60,  accuracy: 100, pp: 20, description: "Star-shaped rays are shot at the opposing Pokémon. This attack never misses." },
  { name: "Skull Bash",     type: "Normal",   category: "Physical", power: 130, accuracy: 100, pp: 10, description: "Tucks the head in the first turn, then attacks the next turn." },
  { name: "Amnesia",        type: "Psychic",  category: "Status",                              pp: 20, description: "The user temporarily empties its mind to forget its concerns. Raises Sp. Def." },
  { name: "Bubble Beam",    type: "Water",    category: "Special",  power: 65,  accuracy: 100, pp: 20, description: "A spray of bubbles is forcefully ejected at the target. May lower Speed." },
];

// deduplicate
const MOVES_DEDUPED = Array.from(new Map(MOVES.map(m => [m.name, m])).values());

// ─── POKÉMON DATA ──────────────────────────────────────────────────────────────
const BASE = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon";
const ART  = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork";

type P = {
  dex: number; name: string; category: string; description: string;
  height: number; weight: number; color: string; habitat?: string;
  types: string[]; abilities: string[]; hiddenAbility?: string;
  hp: number; atk: number; def: number; spa: number; spd: number; spe: number;
  captureRate: number; baseFriendship: number; growthRate: "slow"|"medium-slow"|"medium"|"medium-fast"|"fast"|"erratic"|"fluctuating";
  eggGroup1?: string; eggGroup2?: string;
  isLegendary?: boolean; isMythical?: boolean;
};

const POKEMON: P[] = [
  { dex:1,  name:"Bulbasaur",   category:"Seed",         description:"A strange seed was planted on its back at birth. The plant sprouts and grows with this Pokémon.",                               height:0.7,  weight:6.9,  color:"green",  habitat:"grassland",  types:["Grass","Poison"],   abilities:["Overgrow"],          hiddenAbility:"Chlorophyll",  hp:45, atk:49, def:49, spa:65, spd:65, spe:45, captureRate:45,  baseFriendship:50, growthRate:"medium-slow", eggGroup1:"Monster", eggGroup2:"Grass" },
  { dex:2,  name:"Ivysaur",     category:"Seed",         description:"When the bulb on its back grows large, it appears to lose the ability to stand on its hind legs.",                             height:1.0,  weight:13.0, color:"green",  habitat:"grassland",  types:["Grass","Poison"],   abilities:["Overgrow"],          hiddenAbility:"Chlorophyll",  hp:60, atk:62, def:63, spa:80, spd:80, spe:60, captureRate:45,  baseFriendship:50, growthRate:"medium-slow", eggGroup1:"Monster", eggGroup2:"Grass" },
  { dex:3,  name:"Venusaur",    category:"Seed",         description:"The plant blooms when it is absorbing solar energy. It stays on the move to seek sunlight.",                                   height:2.0,  weight:100.0,color:"green",  habitat:"grassland",  types:["Grass","Poison"],   abilities:["Overgrow"],          hiddenAbility:"Chlorophyll",  hp:80, atk:82, def:83, spa:100,spd:100,spe:80, captureRate:45,  baseFriendship:50, growthRate:"medium-slow", eggGroup1:"Monster", eggGroup2:"Grass" },
  { dex:4,  name:"Charmander",  category:"Lizard",       description:"Obviously prefers hot places. When it rains, steam is said to spout from the tip of its tail.",                               height:0.6,  weight:8.5,  color:"red",    habitat:"mountain",   types:["Fire"],             abilities:["Blaze"],             hiddenAbility:"Solar Power",  hp:39, atk:52, def:43, spa:60, spd:50, spe:65, captureRate:45,  baseFriendship:50, growthRate:"medium-slow", eggGroup1:"Monster", eggGroup2:"Dragon" },
  { dex:5,  name:"Charmeleon",  category:"Flame",        description:"When it swings its burning tail, it elevates the temperature to unbearably high levels.",                                     height:1.1,  weight:19.0, color:"red",    habitat:"mountain",   types:["Fire"],             abilities:["Blaze"],             hiddenAbility:"Solar Power",  hp:58, atk:64, def:58, spa:80, spd:65, spe:80, captureRate:45,  baseFriendship:50, growthRate:"medium-slow", eggGroup1:"Monster", eggGroup2:"Dragon" },
  { dex:6,  name:"Charizard",   category:"Flame",        description:"Spits fire that is hot enough to melt boulders. Known to cause forest fires unintentionally.",                                height:1.7,  weight:90.5, color:"red",    habitat:"mountain",   types:["Fire","Flying"],    abilities:["Blaze"],             hiddenAbility:"Solar Power",  hp:78, atk:84, def:78, spa:109,spd:85, spe:100,captureRate:45,  baseFriendship:50, growthRate:"medium-slow", eggGroup1:"Monster", eggGroup2:"Dragon" },
  { dex:7,  name:"Squirtle",    category:"Tiny Turtle",  description:"After birth, its back swells and hardens into a shell. Powerfully sprays foam from its mouth.",                              height:0.5,  weight:9.0,  color:"blue",   habitat:"sea",        types:["Water"],            abilities:["Torrent"],           hiddenAbility:"Rain Dish",    hp:44, atk:48, def:65, spa:50, spd:64, spe:43, captureRate:45,  baseFriendship:50, growthRate:"medium-slow", eggGroup1:"Monster", eggGroup2:"Water 1" },
  { dex:8,  name:"Wartortle",   category:"Turtle",       description:"Often hides in water to stalk unwary prey. For swimming fast, it moves its ears to maintain balance.",                       height:1.0,  weight:22.5, color:"blue",   habitat:"sea",        types:["Water"],            abilities:["Torrent"],           hiddenAbility:"Rain Dish",    hp:59, atk:63, def:80, spa:65, spd:80, spe:58, captureRate:45,  baseFriendship:50, growthRate:"medium-slow", eggGroup1:"Monster", eggGroup2:"Water 1" },
  { dex:9,  name:"Blastoise",   category:"Shellfish",    description:"A brutal Pokémon with pressurized water jets on its shell. They are used for high-speed tackles.",                           height:1.6,  weight:85.5, color:"blue",   habitat:"sea",        types:["Water"],            abilities:["Torrent"],           hiddenAbility:"Rain Dish",    hp:79, atk:83, def:100,spa:85, spd:105,spe:78, captureRate:45,  baseFriendship:50, growthRate:"medium-slow", eggGroup1:"Monster", eggGroup2:"Water 1" },
  { dex:10, name:"Caterpie",    category:"Worm",         description:"Its short feet are tipped with suction pads that enable it to tirelessly climb slopes and walls.",                          height:0.3,  weight:2.9,  color:"green",  habitat:"forest",     types:["Bug"],              abilities:["Shield Dust"],                             hp:45, atk:30, def:35, spa:20, spd:20, spe:45, captureRate:255, baseFriendship:50, growthRate:"medium-fast", eggGroup1:"Bug" },
  { dex:11, name:"Metapod",     category:"Cocoon",       description:"This Pokémon is vulnerable to attack while its shell is soft, exposing its weak and tender body.",                          height:0.7,  weight:9.9,  color:"green",  habitat:"forest",     types:["Bug"],              abilities:["Shed Skin"],                               hp:50, atk:20, def:55, spa:25, spd:25, spe:30, captureRate:120, baseFriendship:50, growthRate:"medium-fast", eggGroup1:"Bug" },
  { dex:12, name:"Butterfree",  category:"Butterfly",   description:"In battle, it flaps its wings at great speed to release highly toxic dust into the air.",                                   height:1.1,  weight:32.0, color:"white",  habitat:"forest",     types:["Bug","Flying"],     abilities:["Compound Eyes"],     hiddenAbility:"Tinted Lens",  hp:60, atk:45, def:50, spa:90, spd:80, spe:70, captureRate:45,  baseFriendship:50, growthRate:"medium-fast", eggGroup1:"Bug" },
  { dex:13, name:"Weedle",      category:"Hairy Bug",   description:"Often found in forests, eating leaves. It has a sharp venomous stinger on its head.",                                      height:0.3,  weight:3.2,  color:"brown",  habitat:"forest",     types:["Bug","Poison"],     abilities:["Shield Dust"],                             hp:40, atk:35, def:30, spa:20, spd:20, spe:50, captureRate:255, baseFriendship:70, growthRate:"medium-fast", eggGroup1:"Bug" },
  { dex:14, name:"Kakuna",      category:"Cocoon",       description:"Almost incapable of moving, this Pokémon can only harden its shell to protect itself from foes.",                          height:0.6,  weight:10.0, color:"yellow", habitat:"forest",     types:["Bug","Poison"],     abilities:["Shed Skin"],                               hp:45, atk:25, def:50, spa:25, spd:25, spe:35, captureRate:120, baseFriendship:70, growthRate:"medium-fast", eggGroup1:"Bug" },
  { dex:15, name:"Beedrill",    category:"Poison Bee",  description:"Flies at high speed and attacks using the large venomous stingers on its forelegs and tail.",                              height:1.0,  weight:29.5, color:"yellow", habitat:"forest",     types:["Bug","Poison"],     abilities:["Swarm"],             hiddenAbility:"Sniper",       hp:65, atk:90, def:40, spa:45, spd:80, spe:75, captureRate:45,  baseFriendship:70, growthRate:"medium-fast", eggGroup1:"Bug" },
  { dex:16, name:"Pidgey",      category:"Tiny Bird",   description:"A common sight in forests and woods. It flaps its wings at ground level to kick up blinding sand.",                       height:0.3,  weight:1.8,  color:"brown",  habitat:"forest",     types:["Normal","Flying"],  abilities:["Keen Eye","Tangled Feet"],hiddenAbility:"Big Pecks",  hp:40, atk:45, def:40, spa:35, spd:35, spe:56, captureRate:255, baseFriendship:70, growthRate:"medium-slow", eggGroup1:"Flying" },
  { dex:17, name:"Pidgeotto",   category:"Bird",         description:"Very protective of its sprawling territorial area, this Pokémon will fiercely peck any intruder.",                        height:1.1,  weight:30.0, color:"brown",  habitat:"forest",     types:["Normal","Flying"],  abilities:["Keen Eye","Tangled Feet"],hiddenAbility:"Big Pecks",  hp:63, atk:60, def:55, spa:50, spd:50, spe:71, captureRate:120, baseFriendship:70, growthRate:"medium-slow", eggGroup1:"Flying" },
  { dex:18, name:"Pidgeot",     category:"Bird",         description:"This Pokémon flies at Mach 2 speed, seeking prey. Its large talons are feared as wicked weapons.",                       height:1.5,  weight:39.5, color:"brown",  habitat:"forest",     types:["Normal","Flying"],  abilities:["Keen Eye","Tangled Feet"],hiddenAbility:"Big Pecks",  hp:83, atk:80, def:75, spa:70, spd:70, spe:101,captureRate:45,  baseFriendship:70, growthRate:"medium-slow", eggGroup1:"Flying" },
  { dex:19, name:"Rattata",     category:"Mouse",        description:"Bites anything when it attacks. Small and very quick, it is a common sight in many places.",                              height:0.3,  weight:3.5,  color:"purple", habitat:"urban",      types:["Normal"],           abilities:["Run Away","Guts"],   hiddenAbility:"Hustle",       hp:30, atk:56, def:35, spa:25, spd:35, spe:72, captureRate:255, baseFriendship:70, growthRate:"medium-fast", eggGroup1:"Field" },
  { dex:20, name:"Raticate",    category:"Mouse",        description:"The whiskers serve as sensors. It apparently uses them to maintain balance while running.",                               height:0.7,  weight:18.5, color:"brown",  habitat:"urban",      types:["Normal"],           abilities:["Run Away","Guts"],   hiddenAbility:"Hustle",       hp:55, atk:81, def:60, spa:50, spd:70, spe:97, captureRate:127, baseFriendship:70, growthRate:"medium-fast", eggGroup1:"Field" },
  { dex:21, name:"Spearow",     category:"Tiny Bird",   description:"Eats bugs in grassy areas. It has to flap its short wings at high speed to stay airborne.",                              height:0.3,  weight:2.0,  color:"brown",  habitat:"grassland",  types:["Normal","Flying"],  abilities:["Keen Eye"],          hiddenAbility:"Sniper",       hp:40, atk:60, def:30, spa:31, spd:31, spe:70, captureRate:255, baseFriendship:70, growthRate:"medium-fast", eggGroup1:"Flying" },
  { dex:22, name:"Fearow",      category:"Beak",         description:"With its huge and magnificent wings, it can keep aloft without ever having to land for rest.",                           height:1.2,  weight:38.0, color:"brown",  habitat:"grassland",  types:["Normal","Flying"],  abilities:["Keen Eye"],          hiddenAbility:"Sniper",       hp:65, atk:90, def:65, spa:61, spd:61, spe:100,captureRate:90,  baseFriendship:70, growthRate:"medium-fast", eggGroup1:"Flying" },
  { dex:23, name:"Ekans",       category:"Snake",        description:"Moves silently and swiftly. Eats the eggs of birds, such as Spearow and Pidgey.",                                       height:2.0,  weight:6.9,  color:"purple", habitat:"grassland",  types:["Poison"],           abilities:["Intimidate","Shed Skin"],hiddenAbility:"Unnerve",    hp:35, atk:60, def:44, spa:40, spd:54, spe:55, captureRate:255, baseFriendship:70, growthRate:"medium-fast", eggGroup1:"Field", eggGroup2:"Dragon" },
  { dex:24, name:"Arbok",       category:"Cobra",        description:"It is rumored that the ferocious warning markings on its belly differ from area to area.",                              height:3.5,  weight:65.0, color:"purple", habitat:"grassland",  types:["Poison"],           abilities:["Intimidate","Shed Skin"],hiddenAbility:"Unnerve",    hp:60, atk:85, def:69, spa:65, spd:79, spe:80, captureRate:90,  baseFriendship:70, growthRate:"medium-fast", eggGroup1:"Field", eggGroup2:"Dragon" },
  { dex:25, name:"Pikachu",     category:"Mouse",        description:"When several of these Pokémon gather, their electricity could build and cause lightning storms.",                       height:0.4,  weight:6.0,  color:"yellow", habitat:"forest",     types:["Electric"],         abilities:["Static"],            hiddenAbility:"Lightning Rod", hp:35, atk:55, def:40, spa:50, spd:50, spe:90, captureRate:190, baseFriendship:70, growthRate:"medium-fast", eggGroup1:"Field", eggGroup2:"Fairy" },
  { dex:26, name:"Raichu",      category:"Mouse",        description:"Its long tail serves as a ground to protect itself from its own high-voltage power.",                                  height:0.8,  weight:30.0, color:"yellow", habitat:"forest",     types:["Electric"],         abilities:["Static"],            hiddenAbility:"Lightning Rod", hp:60, atk:90, def:55, spa:90, spd:80, spe:110,captureRate:75,  baseFriendship:70, growthRate:"medium-fast", eggGroup1:"Field", eggGroup2:"Fairy" },
  { dex:27, name:"Sandshrew",   category:"Mouse",        description:"Burrows deep underground in arid locations far from water. It only emerges to hunt for food.",                        height:0.6,  weight:12.0, color:"yellow", habitat:"desert",     types:["Ground"],           abilities:["Sand Veil"],         hiddenAbility:"Sand Rush",    hp:50, atk:75, def:85, spa:20, spd:30, spe:40, captureRate:255, baseFriendship:70, growthRate:"medium-fast", eggGroup1:"Field" },
  { dex:28, name:"Sandslash",   category:"Mouse",        description:"Curls up into a ball when threatened. It lashes out with the spikes on its back if attacked.",                        height:1.0,  weight:29.5, color:"yellow", habitat:"desert",     types:["Ground"],           abilities:["Sand Veil"],         hiddenAbility:"Sand Rush",    hp:75, atk:100,def:110,spa:45, spd:55, spe:65, captureRate:90,  baseFriendship:70, growthRate:"medium-fast", eggGroup1:"Field" },
  { dex:29, name:"Nidoran♀",   category:"Poison Pin",  description:"Although small, its venomous barbs render this Pokémon dangerous. The female has smaller horns.",                    height:0.4,  weight:7.0,  color:"blue",   habitat:"grassland",  types:["Poison"],           abilities:["Poison Point","Rivalry"],hiddenAbility:"Hustle",    hp:55, atk:47, def:52, spa:40, spd:40, spe:41, captureRate:235, baseFriendship:70, growthRate:"medium-slow", eggGroup1:"Monster", eggGroup2:"Field" },
  { dex:30, name:"Nidorina",    category:"Poison Pin",  description:"The female's horn develops slowly. Prefers physical attacks such as clawing and biting.",                            height:0.8,  weight:20.0, color:"blue",   habitat:"grassland",  types:["Poison"],           abilities:["Poison Point","Rivalry"],hiddenAbility:"Hustle",    hp:70, atk:62, def:67, spa:55, spd:55, spe:56, captureRate:120, baseFriendship:70, growthRate:"medium-slow", eggGroup1:"Undiscovered" },
  { dex:31, name:"Nidoqueen",   category:"Drill",        description:"Its hard scales provide strong protection. It uses its hefty bulk to execute powerful moves.",                        height:1.3,  weight:60.0, color:"blue",   habitat:"grassland",  types:["Poison","Ground"],  abilities:["Poison Point","Rivalry"],hiddenAbility:"Sheer Force",hp:90, atk:92, def:87, spa:75, spd:85, spe:76, captureRate:45,  baseFriendship:70, growthRate:"medium-slow", eggGroup1:"Undiscovered" },
  { dex:32, name:"Nidoran♂",   category:"Poison Pin",  description:"Stiffens its ears to sense danger. The larger its horns, the more powerful its secreted venom.",                    height:0.5,  weight:9.0,  color:"purple", habitat:"grassland",  types:["Poison"],           abilities:["Poison Point","Rivalry"],hiddenAbility:"Hustle",    hp:46, atk:57, def:40, spa:40, spd:40, spe:50, captureRate:235, baseFriendship:70, growthRate:"medium-slow", eggGroup1:"Monster", eggGroup2:"Field" },
  { dex:33, name:"Nidorino",    category:"Poison Pin",  description:"An aggressive Pokémon that is quick to attack. The horn on its head secretes a powerful venom.",                    height:0.9,  weight:19.5, color:"purple", habitat:"grassland",  types:["Poison"],           abilities:["Poison Point","Rivalry"],hiddenAbility:"Hustle",    hp:61, atk:72, def:57, spa:55, spd:55, spe:65, captureRate:120, baseFriendship:70, growthRate:"medium-slow", eggGroup1:"Monster", eggGroup2:"Field" },
  { dex:34, name:"Nidoking",    category:"Drill",        description:"It uses its powerful tail in battle to smash, constrict, then break the prey's bones.",                             height:1.4,  weight:62.0, color:"purple", habitat:"grassland",  types:["Poison","Ground"],  abilities:["Poison Point","Rivalry"],hiddenAbility:"Sheer Force",hp:81, atk:102,def:77, spa:85, spd:75, spe:85, captureRate:45,  baseFriendship:70, growthRate:"medium-slow", eggGroup1:"Monster", eggGroup2:"Field" },
  { dex:35, name:"Clefairy",    category:"Fairy",        description:"Its magical and cute appeal has many admirers. It is rare and found only in certain areas.",                         height:0.6,  weight:7.5,  color:"pink",   habitat:"mountain",   types:["Fairy"],            abilities:["Cute Charm","Magic Guard"],hiddenAbility:"Friend Guard",hp:70, atk:45, def:48, spa:60, spd:65, spe:35, captureRate:150, baseFriendship:140,growthRate:"fast", eggGroup1:"Fairy" },
  { dex:36, name:"Clefable",    category:"Fairy",        description:"A timid fairy Pokémon that is rarely seen. It will run and hide the moment it senses people.",                     height:1.3,  weight:40.0, color:"pink",   habitat:"mountain",   types:["Fairy"],            abilities:["Cute Charm","Magic Guard"],hiddenAbility:"Unaware",   hp:95, atk:70, def:73, spa:95, spd:90, spe:60, captureRate:25,  baseFriendship:140,growthRate:"fast", eggGroup1:"Fairy" },
  { dex:37, name:"Vulpix",      category:"Fox",          description:"At birth, it has just one tail. The tail splits from its tip as it grows older.",                                   height:0.6,  weight:9.9,  color:"brown",  habitat:"grassland",  types:["Fire"],             abilities:["Flash Fire"],        hiddenAbility:"Drought",      hp:38, atk:41, def:40, spa:50, spd:65, spe:65, captureRate:190, baseFriendship:70, growthRate:"medium-fast", eggGroup1:"Field" },
  { dex:38, name:"Ninetales",   category:"Fox",          description:"Very smart and very vengeful. Grabbing one of its many tails could result in a 1000-year curse.",                   height:1.1,  weight:19.9, color:"yellow", habitat:"grassland",  types:["Fire"],             abilities:["Flash Fire"],        hiddenAbility:"Drought",      hp:73, atk:76, def:75, spa:81, spd:100,spe:100,captureRate:75,  baseFriendship:70, growthRate:"medium-fast", eggGroup1:"Field" },
  { dex:39, name:"Jigglypuff",  category:"Balloon",      description:"When its huge eyes waver, it sings a mysteriously soothing melody that lulls its enemies to sleep.",               height:0.5,  weight:5.5,  color:"pink",   habitat:"grassland",  types:["Normal","Fairy"],   abilities:["Cute Charm","Competitive"],hiddenAbility:"Friend Guard",hp:115,atk:45, def:20, spa:45, spd:25, spe:20, captureRate:170, baseFriendship:70, growthRate:"fast", eggGroup1:"Fairy" },
  { dex:40, name:"Wigglytuff",  category:"Balloon",      description:"The body is soft and rubbery. When angered, it will suck in air and inflate itself to an enormous size.",          height:1.0,  weight:12.0, color:"pink",   habitat:"grassland",  types:["Normal","Fairy"],   abilities:["Cute Charm","Competitive"],hiddenAbility:"Frisk",       hp:140,atk:70, def:45, spa:85, spd:50, spe:45, captureRate:50,  baseFriendship:70, growthRate:"fast", eggGroup1:"Fairy" },
  { dex:41, name:"Zubat",       category:"Bat",          description:"Forms colonies in perpetually dark places. Uses ultrasonic waves to identify and approach targets.",                height:0.8,  weight:7.5,  color:"purple", habitat:"cave",       types:["Poison","Flying"],  abilities:["Inner Focus"],       hiddenAbility:"Infiltrator",  hp:40, atk:45, def:35, spa:30, spd:40, spe:55, captureRate:255, baseFriendship:70, growthRate:"medium-fast", eggGroup1:"Flying" },
  { dex:42, name:"Golbat",      category:"Bat",          description:"Once it strikes, it will not stop draining energy from the victim even if it gets too heavy to fly.",             height:1.6,  weight:55.0, color:"purple", habitat:"cave",       types:["Poison","Flying"],  abilities:["Inner Focus"],       hiddenAbility:"Infiltrator",  hp:75, atk:80, def:70, spa:65, spd:75, spe:90, captureRate:90,  baseFriendship:70, growthRate:"medium-fast", eggGroup1:"Flying" },
  { dex:43, name:"Oddish",      category:"Weed",         description:"During the day, it keeps its face buried in the ground. At night, it wanders around sowing its seeds.",           height:0.5,  weight:5.4,  color:"blue",   habitat:"grassland",  types:["Grass","Poison"],   abilities:["Chlorophyll"],       hiddenAbility:"Run Away",     hp:45, atk:50, def:55, spa:75, spd:65, spe:30, captureRate:255, baseFriendship:70, growthRate:"medium-slow", eggGroup1:"Grass" },
  { dex:44, name:"Gloom",       category:"Weed",         description:"The fluid that oozes from its mouth isn't drool. It is a nectar that is used to attract prey.",                  height:0.8,  weight:8.6,  color:"blue",   habitat:"grassland",  types:["Grass","Poison"],   abilities:["Chlorophyll"],       hiddenAbility:"Stench",       hp:60, atk:65, def:70, spa:85, spd:75, spe:40, captureRate:120, baseFriendship:70, growthRate:"medium-slow", eggGroup1:"Grass" },
  { dex:45, name:"Vileplume",   category:"Flower",       description:"The larger its petals, the more toxic pollen it contains. Its big head is heavy and hard to hold up.",            height:1.2,  weight:18.6, color:"red",    habitat:"grassland",  types:["Grass","Poison"],   abilities:["Chlorophyll"],       hiddenAbility:"Effect Spore", hp:75, atk:80, def:85, spa:110,spd:90, spe:50, captureRate:45,  baseFriendship:70, growthRate:"medium-slow", eggGroup1:"Grass" },
  { dex:46, name:"Paras",       category:"Mushroom",     description:"Burrows to suck tree roots. The mushrooms on its back grow by drawing nutrients from the bug host.",              height:0.3,  weight:5.4,  color:"red",    habitat:"forest",     types:["Bug","Grass"],      abilities:["Effect Spore","Dry Skin"],hiddenAbility:"Damp",       hp:35, atk:70, def:55, spa:45, spd:55, spe:25, captureRate:190, baseFriendship:70, growthRate:"medium-slow", eggGroup1:"Bug", eggGroup2:"Grass" },
  { dex:47, name:"Parasect",    category:"Mushroom",     description:"A host-parasite pair in which the parasite mushroom has taken over the host bug. Grows in damp soil.",           height:1.0,  weight:29.5, color:"red",    habitat:"forest",     types:["Bug","Grass"],      abilities:["Effect Spore","Dry Skin"],hiddenAbility:"Damp",       hp:60, atk:95, def:80, spa:60, spd:80, spe:30, captureRate:75,  baseFriendship:70, growthRate:"medium-slow", eggGroup1:"Bug", eggGroup2:"Grass" },
  { dex:48, name:"Venonat",     category:"Insect",       description:"Lives in the shadows of tall trees where it eats insects. It is attracted by light at night.",                   height:1.0,  weight:30.0, color:"purple", habitat:"forest",     types:["Bug","Poison"],     abilities:["Compound Eyes","Tinted Lens"],hiddenAbility:"Run Away",hp:60, atk:55, def:50, spa:40, spd:55, spe:45, captureRate:190, baseFriendship:70, growthRate:"medium-slow", eggGroup1:"Bug" },
  { dex:49, name:"Venomoth",    category:"Poison Moth",  description:"The dust-like scales covering its wings are color-coded to indicate the kinds of poison it has.",                height:1.5,  weight:12.5, color:"purple", habitat:"forest",     types:["Bug","Poison"],     abilities:["Shield Dust","Tinted Lens"],hiddenAbility:"Wonder Skin",hp:70, atk:65, def:60, spa:90, spd:75, spe:90, captureRate:75,  baseFriendship:70, growthRate:"medium-slow", eggGroup1:"Bug" },
  { dex:50, name:"Diglett",     category:"Mole",         description:"Lives about one yard underground where it feeds on plant roots. It sometimes appears above ground.",             height:0.2,  weight:0.8,  color:"brown",  habitat:"cave",       types:["Ground"],           abilities:["Sand Veil","Arena Trap"],hiddenAbility:"Sand Force",  hp:10, atk:55, def:25, spa:35, spd:45, spe:95, captureRate:255, baseFriendship:70, growthRate:"medium-fast", eggGroup1:"Field" },
  { dex:51, name:"Dugtrio",     category:"Mole",         description:"A team of triplets that move in unison. As a result, it digs up to 60 mph, or 100 km/h.",                       height:0.7,  weight:33.3, color:"brown",  habitat:"cave",       types:["Ground"],           abilities:["Sand Veil","Arena Trap"],hiddenAbility:"Sand Force",  hp:35, atk:100,def:50, spa:50, spd:70, spe:120,captureRate:50,  baseFriendship:70, growthRate:"medium-fast", eggGroup1:"Field" },
  { dex:52, name:"Meowth",      category:"Scratch Cat",  description:"Adores circular objects. Wanders the streets on a nightly basis to look for dropped loose change.",             height:0.4,  weight:4.2,  color:"yellow", habitat:"urban",      types:["Normal"],           abilities:["Pickup","Technician"],hiddenAbility:"Unnerve",     hp:40, atk:45, def:35, spa:40, spd:40, spe:90, captureRate:255, baseFriendship:70, growthRate:"medium-fast", eggGroup1:"Field" },
  { dex:53, name:"Persian",     category:"Classy Cat",  description:"The gem in its forehead glows on its own! It walks with all the grace and elegance of a proud Pokémon.",         height:1.0,  weight:32.0, color:"yellow", habitat:"urban",      types:["Normal"],           abilities:["Limber","Technician"],hiddenAbility:"Unnerve",     hp:65, atk:70, def:60, spa:65, spd:65, spe:115,captureRate:90,  baseFriendship:70, growthRate:"medium-fast", eggGroup1:"Field" },
  { dex:54, name:"Psyduck",     category:"Duck",         description:"While lulling its enemies with its vacant look, this wily Pokémon will use psychokinetic powers.",              height:0.8,  weight:19.6, color:"yellow", habitat:"sea",        types:["Water"],            abilities:["Damp","Cloud Nine"],hiddenAbility:"Swift Swim",   hp:50, atk:52, def:48, spa:65, spd:50, spe:55, captureRate:190, baseFriendship:70, growthRate:"medium-slow", eggGroup1:"Water 1", eggGroup2:"Field" },
  { dex:55, name:"Golduck",     category:"Duck",         description:"Often seen swimming elegantly by lake shores. It is at top speed when its forehead sparkles.",                  height:1.7,  weight:76.6, color:"blue",   habitat:"sea",        types:["Water"],            abilities:["Damp","Cloud Nine"],hiddenAbility:"Swift Swim",   hp:80, atk:82, def:78, spa:95, spd:80, spe:85, captureRate:75,  baseFriendship:70, growthRate:"medium-slow", eggGroup1:"Water 1", eggGroup2:"Field" },
  { dex:56, name:"Mankey",      category:"Pig Monkey",  description:"Extremely quick to anger. It could be docile one moment then thrashing away the next instant.",                 height:0.5,  weight:28.0, color:"brown",  habitat:"mountain",   types:["Fighting"],         abilities:["Vital Spirit","Anger Point"],hiddenAbility:"Defiant",hp:40, atk:80, def:35, spa:35, spd:45, spe:70, captureRate:190, baseFriendship:70, growthRate:"medium-fast", eggGroup1:"Field" },
  { dex:57, name:"Primeape",    category:"Pig Monkey",  description:"Always furious and tenacious to boot. It will not abandon chasing its quarry until it is caught.",              height:1.0,  weight:32.0, color:"brown",  habitat:"mountain",   types:["Fighting"],         abilities:["Vital Spirit","Anger Point"],hiddenAbility:"Defiant",hp:65, atk:105,def:60, spa:60, spd:70, spe:95, captureRate:75,  baseFriendship:70, growthRate:"medium-fast", eggGroup1:"Field" },
  { dex:58, name:"Growlithe",   category:"Puppy",        description:"Very protective of its territory. It will bark and bite to repel intruders from its space.",                   height:0.7,  weight:19.0, color:"brown",  habitat:"grassland",  types:["Fire"],             abilities:["Intimidate","Flash Fire"],hiddenAbility:"Justified",  hp:55, atk:70, def:45, spa:70, spd:50, spe:60, captureRate:190, baseFriendship:70, growthRate:"slow", eggGroup1:"Field" },
  { dex:59, name:"Arcanine",    category:"Legendary",   description:"A Pokémon that has long been admired for its beauty. It runs agilely as if on wings.",                          height:1.9,  weight:155.0,color:"brown",  habitat:"grassland",  types:["Fire"],             abilities:["Intimidate","Flash Fire"],hiddenAbility:"Justified",  hp:90, atk:110,def:80, spa:100,spd:80, spe:95, captureRate:75,  baseFriendship:70, growthRate:"slow", eggGroup1:"Field" },
  { dex:60, name:"Poliwag",     category:"Tadpole",     description:"Its newly grown legs prevent it from running. It appears to prefer swimming over everything else.",             height:0.6,  weight:12.4, color:"blue",   habitat:"sea",        types:["Water"],            abilities:["Water Absorb","Damp"],hiddenAbility:"Swift Swim",   hp:40, atk:50, def:40, spa:40, spd:40, spe:90, captureRate:255, baseFriendship:70, growthRate:"medium-slow", eggGroup1:"Water 1" },
  { dex:61, name:"Poliwhirl",   category:"Tadpole",     description:"Capable of living in or out of water. When out of water, it sweats to keep its body slimy.",                   height:1.0,  weight:20.0, color:"blue",   habitat:"sea",        types:["Water"],            abilities:["Water Absorb","Damp"],hiddenAbility:"Swift Swim",   hp:65, atk:65, def:65, spa:50, spd:50, spe:90, captureRate:120, baseFriendship:70, growthRate:"medium-slow", eggGroup1:"Water 1" },
  { dex:62, name:"Poliwrath",   category:"Tadpole",     description:"An adept swimmer at both the front crawl and breaststroke. Easily overtakes the best human swimmers.",         height:1.3,  weight:54.0, color:"blue",   habitat:"sea",        types:["Water","Fighting"], abilities:["Water Absorb","Damp"],hiddenAbility:"Swift Swim",   hp:90, atk:95, def:95, spa:70, spd:90, spe:70, captureRate:45,  baseFriendship:70, growthRate:"medium-slow", eggGroup1:"Water 1" },
  { dex:63, name:"Abra",        category:"Psi",          description:"Using its ability to read minds, it will identify impending danger and teleport to safety.",                   height:0.9,  weight:19.5, color:"brown",  habitat:"urban",      types:["Psychic"],          abilities:["Synchronize","Inner Focus"],hiddenAbility:"Magic Guard",hp:25, atk:20, def:15, spa:105,spd:55, spe:90, captureRate:200, baseFriendship:70, growthRate:"medium-slow", eggGroup1:"Human-Like" },
  { dex:64, name:"Kadabra",     category:"Psi",          description:"It emits special alpha waves from its body that induce headaches just by being close by.",                    height:1.3,  weight:56.5, color:"brown",  habitat:"urban",      types:["Psychic"],          abilities:["Synchronize","Inner Focus"],hiddenAbility:"Magic Guard",hp:40, atk:35, def:30, spa:120,spd:70, spe:105,captureRate:100, baseFriendship:70, growthRate:"medium-slow", eggGroup1:"Human-Like" },
  { dex:65, name:"Alakazam",    category:"Psi",          description:"Its brain can outperform a supercomputer. Its intelligence quotient is said to be 5000.",                     height:1.5,  weight:48.0, color:"brown",  habitat:"urban",      types:["Psychic"],          abilities:["Synchronize","Inner Focus"],hiddenAbility:"Magic Guard",hp:55, atk:50, def:45, spa:135,spd:95, spe:120,captureRate:50,  baseFriendship:70, growthRate:"medium-slow", eggGroup1:"Human-Like" },
  { dex:66, name:"Machop",      category:"Superpower",  description:"Loves to build its muscles. It trains in all styles of martial arts to become even stronger.",                height:0.8,  weight:19.5, color:"gray",   habitat:"mountain",   types:["Fighting"],         abilities:["Guts","No Guard"],   hiddenAbility:"Steadfast",    hp:70, atk:80, def:50, spa:35, spd:35, spe:35, captureRate:180, baseFriendship:70, growthRate:"medium-slow", eggGroup1:"Human-Like" },
  { dex:67, name:"Machoke",     category:"Superpower",  description:"Its muscular body is so powerful, it must wear a power save belt to hold back its energy.",                  height:1.5,  weight:70.5, color:"gray",   habitat:"mountain",   types:["Fighting"],         abilities:["Guts","No Guard"],   hiddenAbility:"Steadfast",    hp:80, atk:100,def:70, spa:50, spd:60, spe:45, captureRate:90,  baseFriendship:70, growthRate:"medium-slow", eggGroup1:"Human-Like" },
  { dex:68, name:"Machamp",     category:"Superpower",  description:"Using its four powerful arms, it can attack and defend simultaneously. It quickly raises many opponents.",    height:1.6,  weight:130.0,color:"gray",   habitat:"mountain",   types:["Fighting"],         abilities:["Guts","No Guard"],   hiddenAbility:"Steadfast",    hp:90, atk:130,def:80, spa:65, spd:85, spe:55, captureRate:45,  baseFriendship:70, growthRate:"medium-slow", eggGroup1:"Human-Like" },
  { dex:69, name:"Bellsprout",  category:"Flower",       description:"A carnivorous Pokémon that traps and eats bugs. It uses its root feet to soak up needed moisture.",         height:0.7,  weight:4.0,  color:"yellow", habitat:"forest",     types:["Grass","Poison"],   abilities:["Chlorophyll"],       hiddenAbility:"Gluttony",     hp:50, atk:75, def:35, spa:70, spd:30, spe:40, captureRate:255, baseFriendship:70, growthRate:"medium-slow", eggGroup1:"Grass" },
  { dex:70, name:"Weepinbell",  category:"Flycatcher",  description:"It spits out Poison Powder to immobilize the enemy and then finishes it with a spray of Acid.",              height:1.0,  weight:6.4,  color:"yellow", habitat:"forest",     types:["Grass","Poison"],   abilities:["Chlorophyll"],       hiddenAbility:"Gluttony",     hp:65, atk:90, def:50, spa:85, spd:45, spe:55, captureRate:120, baseFriendship:70, growthRate:"medium-slow", eggGroup1:"Grass" },
  { dex:71, name:"Victreebel",  category:"Flycatcher",  description:"Said to live in huge colonies deep in jungles, although no one has ever returned from there.",               height:1.7,  weight:15.5, color:"yellow", habitat:"forest",     types:["Grass","Poison"],   abilities:["Chlorophyll"],       hiddenAbility:"Gluttony",     hp:80, atk:105,def:65, spa:100,spd:60, spe:70, captureRate:45,  baseFriendship:70, growthRate:"medium-slow", eggGroup1:"Grass" },
  { dex:72, name:"Tentacool",   category:"Jellyfish",   description:"Tentacool's body is mostly water. When it's removed from the sea, it shrivels up like parchment.",           height:0.9,  weight:45.5, color:"blue",   habitat:"sea",        types:["Water","Poison"],   abilities:["Clear Body","Liquid Ooze"],hiddenAbility:"Rain Dish",  hp:40, atk:40, def:35, spa:50, spd:100,spe:70, captureRate:190, baseFriendship:70, growthRate:"slow", eggGroup1:"Water 3" },
  { dex:73, name:"Tentacruel",  category:"Jellyfish",   description:"The tentacles are normally kept short. On hunts, they are extended to ensnare and immobilize prey.",        height:1.6,  weight:55.0, color:"blue",   habitat:"sea",        types:["Water","Poison"],   abilities:["Clear Body","Liquid Ooze"],hiddenAbility:"Rain Dish",  hp:80, atk:70, def:65, spa:80, spd:120,spe:100,captureRate:60,  baseFriendship:70, growthRate:"slow", eggGroup1:"Water 3" },
  { dex:74, name:"Geodude",     category:"Rock",         description:"Found in fields and mountains. Mistaking them for boulders, people often step or trip on them.",             height:0.4,  weight:20.0, color:"brown",  habitat:"mountain",   types:["Rock","Ground"],    abilities:["Rock Head","Sturdy"],hiddenAbility:"Sand Veil",    hp:40, atk:80, def:100,spa:30, spd:30, spe:20, captureRate:255, baseFriendship:70, growthRate:"medium-slow", eggGroup1:"Mineral" },
  { dex:75, name:"Graveler",    category:"Rock",         description:"Rolls down slopes to move. It rolls over any obstacle without slowing or changing its direction.",           height:1.0,  weight:105.0,color:"brown",  habitat:"mountain",   types:["Rock","Ground"],    abilities:["Rock Head","Sturdy"],hiddenAbility:"Sand Veil",    hp:55, atk:95, def:115,spa:45, spd:45, spe:35, captureRate:120, baseFriendship:70, growthRate:"medium-slow", eggGroup1:"Mineral" },
  { dex:76, name:"Golem",       category:"Megaton",      description:"Its boulder-like body is extremely hard. It can easily withstand dynamite blasts without being hurt.",       height:1.4,  weight:300.0,color:"brown",  habitat:"mountain",   types:["Rock","Ground"],    abilities:["Rock Head","Sturdy"],hiddenAbility:"Sand Veil",    hp:80, atk:120,def:130,spa:55, spd:65, spe:45, captureRate:45,  baseFriendship:70, growthRate:"medium-slow", eggGroup1:"Mineral" },
  { dex:77, name:"Ponyta",      category:"Fire Horse",  description:"Its hooves are 10 times harder than diamonds. It can trample anything completely flat in little time.",     height:1.0,  weight:30.0, color:"yellow", habitat:"grassland",  types:["Fire"],             abilities:["Run Away","Flash Fire"],hiddenAbility:"Flame Body",   hp:50, atk:85, def:55, spa:65, spd:65, spe:90, captureRate:190, baseFriendship:70, growthRate:"medium-fast", eggGroup1:"Field" },
  { dex:78, name:"Rapidash",    category:"Fire Horse",  description:"Very competitive, this Pokémon will chase anything that moves fast in the hopes of racing it.",             height:1.7,  weight:95.0, color:"yellow", habitat:"grassland",  types:["Fire"],             abilities:["Run Away","Flash Fire"],hiddenAbility:"Flame Body",   hp:65, atk:100,def:70, spa:80, spd:80, spe:105,captureRate:60,  baseFriendship:70, growthRate:"medium-fast", eggGroup1:"Field" },
  { dex:79, name:"Slowpoke",    category:"Dopey",        description:"Incredibly slow and dopey. It takes 5 seconds for it to feel pain when under attack.",                     height:1.2,  weight:36.0, color:"pink",   habitat:"sea",        types:["Water","Psychic"],  abilities:["Oblivious","Own Tempo"],hiddenAbility:"Regenerator",  hp:90, atk:65, def:65, spa:40, spd:40, spe:15, captureRate:190, baseFriendship:70, growthRate:"medium-fast", eggGroup1:"Monster", eggGroup2:"Water 1" },
  { dex:80, name:"Slowbro",     category:"Hermit Crab", description:"The Shellder that is latched onto Slowpoke's tail is said to feed on the host's left-over scraps.",         height:1.6,  weight:78.5, color:"pink",   habitat:"sea",        types:["Water","Psychic"],  abilities:["Oblivious","Own Tempo"],hiddenAbility:"Regenerator",  hp:95, atk:75, def:110,spa:100,spd:80, spe:30, captureRate:75,  baseFriendship:70, growthRate:"medium-fast", eggGroup1:"Monster", eggGroup2:"Water 1" },
  { dex:81, name:"Magnemite",   category:"Magnet",       description:"Uses anti-gravity to stay suspended. Appears without warning and uses Thunder Wave and similar moves.",     height:0.3,  weight:6.0,  color:"gray",   habitat:"urban",      types:["Electric","Steel"], abilities:["Magnet Pull","Sturdy"],hiddenAbility:"Analytic",    hp:25, atk:35, def:70, spa:95, spd:55, spe:45, captureRate:190, baseFriendship:70, growthRate:"medium-fast", eggGroup1:"Mineral" },
  { dex:82, name:"Magneton",    category:"Magnet",       description:"Formed by several Magnemite linked together. It frequently appears when sunspots flare up.",               height:1.0,  weight:60.0, color:"gray",   habitat:"urban",      types:["Electric","Steel"], abilities:["Magnet Pull","Sturdy"],hiddenAbility:"Analytic",    hp:50, atk:60, def:95, spa:120,spd:70, spe:70, captureRate:60,  baseFriendship:70, growthRate:"medium-fast", eggGroup1:"Mineral" },
  { dex:83, name:"Farfetch'd",  category:"Wild Duck",   description:"A wild duck Pokémon that always walks about with a stick of leek in its bill. The stick is apparently edible.", height:0.8,weight:15.0, color:"brown",  habitat:"grassland",  types:["Normal","Flying"],  abilities:["Keen Eye","Inner Focus"],hiddenAbility:"Defiant",    hp:52, atk:65, def:55, spa:58, spd:62, spe:60, captureRate:45,  baseFriendship:70, growthRate:"medium-fast", eggGroup1:"Flying", eggGroup2:"Field" },
  { dex:84, name:"Doduo",       category:"Twin Bird",   description:"A bird that makes up for its poor flying with its fast foot speed. Leaves giant footprints.",                height:1.4,  weight:39.2, color:"brown",  habitat:"grassland",  types:["Normal","Flying"],  abilities:["Run Away","Early Bird"],hiddenAbility:"Tangled Feet",hp:35, atk:85, def:45, spa:35, spd:35, spe:75, captureRate:190, baseFriendship:70, growthRate:"medium-fast", eggGroup1:"Flying" },
  { dex:85, name:"Dodrio",      category:"Triple Bird",  description:"One of Doduo's two heads grew to make a total of three. It runs at a pace of 60 miles per hour.",           height:1.8,  weight:85.2, color:"brown",  habitat:"grassland",  types:["Normal","Flying"],  abilities:["Run Away","Early Bird"],hiddenAbility:"Tangled Feet",hp:60, atk:110,def:70, spa:60, spd:60, spe:110,captureRate:45,  baseFriendship:70, growthRate:"medium-fast", eggGroup1:"Flying" },
  { dex:86, name:"Seel",        category:"Sea Lion",    description:"The cold salty air of the sea is where this Pokémon feels most comfortable. It dislikes warm places.",       height:1.1,  weight:90.0, color:"white",  habitat:"sea",        types:["Water"],            abilities:["Thick Fat","Hydration"],hiddenAbility:"Ice Body",    hp:65, atk:45, def:55, spa:45, spd:70, spe:45, captureRate:190, baseFriendship:70, growthRate:"medium-fast", eggGroup1:"Water 1", eggGroup2:"Field" },
  { dex:87, name:"Dewgong",     category:"Sea Lion",    description:"Loves cold weather. Makes its nest in the frozen seafloor. Swims at 8 knots even in intensely cold waters.", height:1.7, weight:120.0,color:"white",  habitat:"sea",        types:["Water","Ice"],      abilities:["Thick Fat","Hydration"],hiddenAbility:"Ice Body",    hp:90, atk:70, def:80, spa:70, spd:95, spe:70, captureRate:75,  baseFriendship:70, growthRate:"medium-fast", eggGroup1:"Water 1", eggGroup2:"Field" },
  { dex:88, name:"Grimer",      category:"Sludge",       description:"Appears in filthy areas. Thrives by sucking up polluted sludge that is pumped out of factories.",          height:0.9,  weight:30.0, color:"purple", habitat:"urban",      types:["Poison"],           abilities:["Stench","Sticky Hold"],hiddenAbility:"Poison Touch", hp:80, atk:80, def:50, spa:40, spd:50, spe:25, captureRate:190, baseFriendship:70, growthRate:"medium-fast", eggGroup1:"Amorphous" },
  { dex:89, name:"Muk",         category:"Sludge",       description:"Thickly covered with a filthy, vile sludge. It is so toxic, even its footprints contain poison.",          height:1.2,  weight:30.0, color:"purple", habitat:"urban",      types:["Poison"],           abilities:["Stench","Sticky Hold"],hiddenAbility:"Poison Touch", hp:105,atk:105,def:75, spa:65, spd:100,spe:50, captureRate:75,  baseFriendship:70, growthRate:"medium-fast", eggGroup1:"Amorphous" },
  { dex:90, name:"Shellder",    category:"Bivalve",      description:"Its hard shell repels any kind of attack. It is vulnerable only when its shell is open.",                  height:0.3,  weight:4.0,  color:"purple", habitat:"sea",        types:["Water"],            abilities:["Shell Armor","Skill Link"],hiddenAbility:"Overcoat",  hp:30, atk:65, def:100,spa:45, spd:25, spe:40, captureRate:190, baseFriendship:70, growthRate:"slow", eggGroup1:"Water 3" },
  { dex:91, name:"Cloyster",    category:"Bivalve",      description:"When attacked, it launches its horn in quick volleys. Its innards have never been seen.",                  height:1.5,  weight:132.5,color:"purple", habitat:"sea",        types:["Water","Ice"],      abilities:["Shell Armor","Skill Link"],hiddenAbility:"Overcoat",  hp:50, atk:95, def:180,spa:85, spd:45, spe:70, captureRate:60,  baseFriendship:70, growthRate:"slow", eggGroup1:"Water 3" },
  { dex:92, name:"Gastly",      category:"Gas",          description:"Almost invisible, this gaseous Pokémon cloaks the target and puts it to sleep without notice.",            height:1.3,  weight:0.1,  color:"purple", habitat:"urban",      types:["Ghost","Poison"],   abilities:["Levitate"],                                hp:30, atk:35, def:30, spa:100,spd:35, spe:80, captureRate:190, baseFriendship:70, growthRate:"medium-slow", eggGroup1:"Amorphous" },
  { dex:93, name:"Haunter",     category:"Gas",          description:"By licking, it saps the victim's life. It causes shaking that won't stop until the victim's demise.",      height:1.6,  weight:0.1,  color:"purple", habitat:"urban",      types:["Ghost","Poison"],   abilities:["Levitate"],                                hp:45, atk:50, def:45, spa:115,spd:55, spe:95, captureRate:90,  baseFriendship:70, growthRate:"medium-slow", eggGroup1:"Amorphous" },
  { dex:94, name:"Gengar",      category:"Shadow",       description:"Under a full moon, this Pokémon likes to mimic the shadows of people and laugh at their fright.",         height:1.5,  weight:40.5, color:"purple", habitat:"urban",      types:["Ghost","Poison"],   abilities:["Cursed Body"],                             hp:60, atk:65, def:60, spa:130,spd:75, spe:110,captureRate:45,  baseFriendship:70, growthRate:"medium-slow", eggGroup1:"Amorphous" },
  { dex:95, name:"Onix",        category:"Rock Snake",  description:"As it grows, the stone portions of its body harden to become similar to black diamonds.",                  height:8.8,  weight:210.0,color:"gray",   habitat:"cave",       types:["Rock","Ground"],    abilities:["Rock Head","Sturdy"],hiddenAbility:"Weak Armor",   hp:35, atk:45, def:160,spa:30, spd:45, spe:70, captureRate:45,  baseFriendship:70, growthRate:"medium-fast", eggGroup1:"Mineral" },
  { dex:96, name:"Drowzee",     category:"Hypnosis",    description:"Puts enemies to sleep then eats their dreams. Occasionally gets sick from eating bad dreams.",              height:1.0,  weight:32.4, color:"yellow", habitat:"urban",      types:["Psychic"],          abilities:["Insomnia","Forewarn"],hiddenAbility:"Inner Focus",  hp:60, atk:48, def:45, spa:43, spd:90, spe:42, captureRate:190, baseFriendship:70, growthRate:"medium-fast", eggGroup1:"Human-Like" },
  { dex:97, name:"Hypno",       category:"Hypnosis",    description:"When it locks eyes with an enemy, it will use a mix of PSI moves such as Hypnosis and Confusion.",        height:1.6,  weight:75.6, color:"yellow", habitat:"urban",      types:["Psychic"],          abilities:["Insomnia","Forewarn"],hiddenAbility:"Inner Focus",  hp:85, atk:73, def:70, spa:73, spd:115,spe:67, captureRate:75,  baseFriendship:70, growthRate:"medium-fast", eggGroup1:"Human-Like" },
  { dex:98, name:"Krabby",      category:"River Crab",  description:"Its pincers are not only powerful weapons, they are used for balance when walking sideways.",              height:0.4,  weight:6.5,  color:"red",    habitat:"sea",        types:["Water"],            abilities:["Hyper Cutter","Shell Armor"],hiddenAbility:"Sheer Force",hp:30, atk:105,def:90, spa:25, spd:25, spe:50, captureRate:225, baseFriendship:70, growthRate:"medium-fast", eggGroup1:"Water 3" },
  { dex:99, name:"Kingler",     category:"Pincer",       description:"The large pincer has 10000 hp of crushing power. However, its large size makes it unwieldy to use.",      height:1.3,  weight:60.0, color:"red",    habitat:"sea",        types:["Water"],            abilities:["Hyper Cutter","Shell Armor"],hiddenAbility:"Sheer Force",hp:55, atk:130,def:115,spa:50, spd:50, spe:75, captureRate:60,  baseFriendship:70, growthRate:"medium-fast", eggGroup1:"Water 3" },
  { dex:100,name:"Voltorb",     category:"Ball",         description:"It looks just like a Poké Ball. It is dangerous because it shocks anything that approaches it.",          height:0.5,  weight:10.4, color:"red",    habitat:"urban",      types:["Electric"],         abilities:["Soundproof","Static"],hiddenAbility:"Aftermath",   hp:40, atk:30, def:50, spa:55, spd:55, spe:100,captureRate:190, baseFriendship:70, growthRate:"medium-fast", eggGroup1:"Mineral" },
  { dex:101,name:"Electrode",   category:"Ball",         description:"Stores electric energy under very high pressure. It often explodes with little or no provocation.",       height:1.2,  weight:66.6, color:"red",    habitat:"urban",      types:["Electric"],         abilities:["Soundproof","Static"],hiddenAbility:"Aftermath",   hp:60, atk:50, def:70, spa:80, spd:80, spe:150,captureRate:60,  baseFriendship:70, growthRate:"medium-fast", eggGroup1:"Mineral" },
  { dex:102,name:"Exeggcute",   category:"Egg",          description:"This Pokémon consists of six eggs that form a cluster. The six eggs attract each other and spin around.", height:0.4,  weight:2.5,  color:"pink",   habitat:"forest",     types:["Grass","Psychic"],  abilities:["Chlorophyll"],       hiddenAbility:"Harvest",      hp:60, atk:40, def:80, spa:60, spd:45, spe:40, captureRate:90,  baseFriendship:70, growthRate:"slow", eggGroup1:"Grass" },
  { dex:103,name:"Exeggutor",   category:"Coconut",      description:"Legend has it that on rare occasions, one of its heads will drop off and continue on as an Exeggcute.", height:2.0,  weight:120.0,color:"yellow", habitat:"forest",     types:["Grass","Psychic"],  abilities:["Chlorophyll"],       hiddenAbility:"Harvest",      hp:95, atk:95, def:85, spa:125,spd:65, spe:55, captureRate:45,  baseFriendship:70, growthRate:"slow", eggGroup1:"Grass" },
  { dex:104,name:"Cubone",      category:"Lonely",       description:"Because it never removes its skull helmet, no one has ever seen this Pokémon's real face.",               height:0.4,  weight:6.5,  color:"brown",  habitat:"mountain",   types:["Ground"],           abilities:["Rock Head","Lightning Rod"],hiddenAbility:"Battle Armor",hp:50, atk:50, def:95, spa:40, spd:50, spe:35, captureRate:190, baseFriendship:70, growthRate:"medium-fast", eggGroup1:"Monster" },
  { dex:105,name:"Marowak",     category:"Bone Keeper",  description:"The bone it holds is its key weapon. It throws the bone skillfully like a boomerang to KO targets.",    height:1.0,  weight:45.0, color:"brown",  habitat:"mountain",   types:["Ground"],           abilities:["Rock Head","Lightning Rod"],hiddenAbility:"Battle Armor",hp:60, atk:80, def:110,spa:50, spd:80, spe:45, captureRate:75,  baseFriendship:70, growthRate:"medium-fast", eggGroup1:"Monster" },
  { dex:106,name:"Hitmonlee",   category:"Kicking",      description:"When in a hurry, its legs lengthen progressively. It runs smoothly with extra long, loping strides.",    height:1.5,  weight:49.8, color:"brown",  habitat:"urban",      types:["Fighting"],         abilities:["Limber","Reckless"],hiddenAbility:"Unburden",     hp:50, atk:120,def:53, spa:35, spd:110,spe:87, captureRate:45,  baseFriendship:70, growthRate:"medium-fast", eggGroup1:"Human-Like" },
  { dex:107,name:"Hitmonchan",  category:"Punching",     description:"While apparently doing nothing, it fires punches in lightning-fast volleys that are too quick to see.", height:1.4,  weight:50.2, color:"brown",  habitat:"urban",      types:["Fighting"],         abilities:["Keen Eye","Iron Fist"],hiddenAbility:"Inner Focus",  hp:50, atk:105,def:79, spa:35, spd:110,spe:76, captureRate:45,  baseFriendship:70, growthRate:"medium-fast", eggGroup1:"Human-Like" },
  { dex:108,name:"Lickitung",   category:"Licking",      description:"Its tongue can be extended like a chameleon's. It leaves a tingling sensation when it licks enemies.", height:1.2,  weight:65.5, color:"pink",   habitat:"grassland",  types:["Normal"],           abilities:["Own Tempo","Oblivious"],hiddenAbility:"Cloud Nine",  hp:90, atk:55, def:75, spa:60, spd:75, spe:30, captureRate:45,  baseFriendship:70, growthRate:"medium-fast", eggGroup1:"Monster" },
  { dex:109,name:"Koffing",     category:"Poison Gas",  description:"Because it stores several kinds of toxic gases in its body, it is prone to exploding without warning.", height:0.6,  weight:1.0,  color:"purple", habitat:"urban",      types:["Poison"],           abilities:["Levitate"],                                hp:40, atk:65, def:95, spa:60, spd:45, spe:35, captureRate:190, baseFriendship:70, growthRate:"medium-fast", eggGroup1:"Amorphous" },
  { dex:110,name:"Weezing",     category:"Poison Gas",  description:"Where two kinds of poison gases meet, 2 Koffing are said to emerge and combine into a Weezing.",        height:1.2,  weight:9.5,  color:"purple", habitat:"urban",      types:["Poison"],           abilities:["Levitate"],                                hp:65, atk:90, def:120,spa:85, spd:70, spe:60, captureRate:60,  baseFriendship:70, growthRate:"medium-fast", eggGroup1:"Amorphous" },
  { dex:111,name:"Rhyhorn",     category:"Spikes",       description:"Its brain is tiny. It is not very bright, but its charging power is tremendous. Even its trainer has to be careful.", height:1.0, weight:115.0,color:"gray",  habitat:"mountain",   types:["Ground","Rock"],    abilities:["Lightning Rod","Rock Head"],hiddenAbility:"Reckless",  hp:80, atk:85, def:95, spa:30, spd:30, spe:25, captureRate:120, baseFriendship:70, growthRate:"slow", eggGroup1:"Monster", eggGroup2:"Field" },
  { dex:112,name:"Rhydon",      category:"Drill",        description:"Protected by an armor-like hide, it is capable of living in molten lava of 3,600 degrees.",              height:1.9,  weight:120.0,color:"gray",   habitat:"mountain",   types:["Ground","Rock"],    abilities:["Lightning Rod","Rock Head"],hiddenAbility:"Reckless",  hp:105,atk:130,def:120,spa:45, spd:45, spe:40, captureRate:60,  baseFriendship:70, growthRate:"slow", eggGroup1:"Monster", eggGroup2:"Field" },
  { dex:113,name:"Chansey",     category:"Egg",          description:"A rare and elusive Pokémon that is said to bring happiness to those who manage to get it.",               height:1.1,  weight:34.6, color:"pink",   habitat:"grassland",  types:["Normal"],           abilities:["Natural Cure","Serene Grace"],hiddenAbility:"Healer",  hp:250,atk:5,  def:5,  spa:35, spd:105,spe:50, captureRate:30,  baseFriendship:140,growthRate:"fast", eggGroup1:"Fairy" },
  { dex:114,name:"Tangela",     category:"Vine",         description:"The whole body is swathed with wide vines. The vines shake as it walks, making a dry rattling sound.", height:1.0,  weight:35.0, color:"blue",   habitat:"grassland",  types:["Grass"],            abilities:["Chlorophyll","Leaf Guard"],hiddenAbility:"Regenerator",hp:65, atk:55, def:115,spa:100,spd:40, spe:60, captureRate:45,  baseFriendship:70, growthRate:"medium-fast", eggGroup1:"Grass" },
  { dex:115,name:"Kangaskhan",  category:"Parent",       description:"The infant rarely ventures out of its mother's protective pouch until it is three years old.",           height:2.2,  weight:80.0, color:"brown",  habitat:"grassland",  types:["Normal"],           abilities:["Early Bird","Scrappy"],hiddenAbility:"Inner Focus",  hp:105,atk:95, def:80, spa:40, spd:80, spe:90, captureRate:45,  baseFriendship:70, growthRate:"medium-fast", eggGroup1:"Monster" },
  { dex:116,name:"Horsea",      category:"Dragon",       description:"Known to shoot down flying insects with precision blasts of ink from the surface of the water.",        height:0.4,  weight:8.0,  color:"blue",   habitat:"sea",        types:["Water"],            abilities:["Swift Swim","Sniper"],hiddenAbility:"Damp",         hp:30, atk:40, def:70, spa:70, spd:25, spe:60, captureRate:225, baseFriendship:70, growthRate:"medium-fast", eggGroup1:"Water 1", eggGroup2:"Dragon" },
  { dex:117,name:"Seadra",      category:"Dragon",       description:"Capable of swimming backwards by rapidly flapping its wing-like pectoral fins and stout tail.", height:1.2, weight:25.0, color:"blue",   habitat:"sea",        types:["Water"],            abilities:["Poison Point","Sniper"],hiddenAbility:"Damp",         hp:55, atk:65, def:95, spa:95, spd:45, spe:85, captureRate:75,  baseFriendship:70, growthRate:"medium-fast", eggGroup1:"Water 1", eggGroup2:"Dragon" },
  { dex:118,name:"Goldeen",     category:"Goldfish",     description:"Its dorsal, pectoral, and tail fins wave elegantly in water. That is why it is known as the Water Queen.", height:0.6, weight:15.0, color:"red",   habitat:"sea",        types:["Water"],            abilities:["Swift Swim","Water Veil"],hiddenAbility:"Lightning Rod",hp:45, atk:67, def:60, spa:35, spd:50, spe:63, captureRate:225, baseFriendship:70, growthRate:"medium-fast", eggGroup1:"Water 2" },
  { dex:119,name:"Seaking",     category:"Goldfish",     description:"In autumn, its body becomes more fatty in preparing to propose to a mate. It takes on beautiful colors.", height:1.3, weight:39.0, color:"red",   habitat:"sea",        types:["Water"],            abilities:["Swift Swim","Water Veil"],hiddenAbility:"Lightning Rod",hp:80, atk:92, def:65, spa:65, spd:80, spe:68, captureRate:60,  baseFriendship:70, growthRate:"medium-fast", eggGroup1:"Water 2" },
  { dex:120,name:"Staryu",      category:"Star Shape",  description:"An enigmatic Pokémon that can regenerate any appendage it loses in battle.",                             height:0.8,  weight:34.5, color:"brown",  habitat:"sea",        types:["Water"],            abilities:["Illuminate","Natural Cure"],hiddenAbility:"Analytic",  hp:30, atk:45, def:55, spa:70, spd:55, spe:85, captureRate:225, baseFriendship:70, growthRate:"slow", eggGroup1:"Water 3" },
  { dex:121,name:"Starmie",     category:"Mysterious",  description:"Its central core glows with the seven colors of the rainbow. Some people value the core as a gem.",      height:1.1,  weight:80.0, color:"purple", habitat:"sea",        types:["Water","Psychic"],  abilities:["Illuminate","Natural Cure"],hiddenAbility:"Analytic",  hp:60, atk:75, def:85, spa:100,spd:85, spe:115,captureRate:60,  baseFriendship:70, growthRate:"slow", eggGroup1:"Water 3" },
  { dex:122,name:"Mr. Mime",    category:"Barrier",     description:"If interrupted while miming, it will slap around the offender with its broad hands.",                    height:1.3,  weight:54.5, color:"pink",   habitat:"urban",      types:["Psychic","Fairy"],  abilities:["Soundproof","Filter"],hiddenAbility:"Technician",   hp:40, atk:45, def:65, spa:100,spd:120,spe:90, captureRate:45,  baseFriendship:70, growthRate:"medium-fast", eggGroup1:"Human-Like" },
  { dex:123,name:"Scyther",     category:"Mantis",       description:"With ninja-like agility and speed, it can create the illusion that there is more than one.",             height:1.5,  weight:56.0, color:"green",  habitat:"grassland",  types:["Bug","Flying"],     abilities:["Swarm","Technician"],hiddenAbility:"Steadfast",    hp:70, atk:110,def:80, spa:55, spd:80, spe:105,captureRate:45,  baseFriendship:70, growthRate:"medium-fast", eggGroup1:"Bug" },
  { dex:124,name:"Jynx",        category:"Human Shape", description:"It seductively wiggles its hips as it walks. It can cause people to dance in unison with it.",           height:1.4,  weight:40.6, color:"red",    habitat:"urban",      types:["Ice","Psychic"],    abilities:["Oblivious","Forewarn"],hiddenAbility:"Dry Skin",     hp:65, atk:50, def:35, spa:115,spd:95, spe:95, captureRate:45,  baseFriendship:70, growthRate:"medium-fast", eggGroup1:"Human-Like" },
  { dex:125,name:"Electabuzz",  category:"Electric",    description:"Normally found near power plants, it can wander away and cause major blackouts in cities.",               height:1.1,  weight:30.0, color:"yellow", habitat:"urban",      types:["Electric"],         abilities:["Static"],            hiddenAbility:"Vital Spirit",  hp:65, atk:83, def:57, spa:95, spd:85, spe:105,captureRate:45,  baseFriendship:70, growthRate:"medium-fast", eggGroup1:"Human-Like" },
  { dex:126,name:"Magmar",      category:"Spitfire",    description:"Its body always burns with an orange glow that enables it to hide perfectly among flames.",                height:1.3,  weight:44.5, color:"red",    habitat:"mountain",   types:["Fire"],             abilities:["Flame Body"],        hiddenAbility:"Vital Spirit",  hp:65, atk:95, def:57, spa:100,spd:85, spe:93, captureRate:45,  baseFriendship:70, growthRate:"medium-fast", eggGroup1:"Human-Like" },
  { dex:127,name:"Pinsir",      category:"Stag Beetle", description:"If it fails to crush the foe in its pincers, it will swing it around and toss it hard.",                 height:1.5,  weight:55.0, color:"brown",  habitat:"forest",     types:["Bug"],              abilities:["Hyper Cutter","Mold Breaker"],hiddenAbility:"Moxie",hp:65, atk:125,def:100,spa:55, spd:70, spe:85, captureRate:45,  baseFriendship:70, growthRate:"slow", eggGroup1:"Bug" },
  { dex:128,name:"Tauros",      category:"Wild Bull",   description:"A rowdy, aggressive Pokémon that is quick to anger. It will attack anything that moves when agitated.", height:1.4,  weight:88.4, color:"brown",  habitat:"grassland",  types:["Normal"],           abilities:["Intimidate","Anger Point"],hiddenAbility:"Sheer Force",hp:75, atk:100,def:95, spa:40, spd:70, spe:110,captureRate:45,  baseFriendship:70, growthRate:"slow", eggGroup1:"Field" },
  { dex:129,name:"Magikarp",    category:"Fish",         description:"In the distant past, it was somewhat stronger than the horribly weak descendants that exist today.", height:0.9,  weight:10.0, color:"red",    habitat:"sea",        types:["Water"],            abilities:["Swift Swim"],        hiddenAbility:"Rattled",       hp:20, atk:10, def:55, spa:15, spd:20, spe:80, captureRate:255, baseFriendship:70, growthRate:"slow", eggGroup1:"Water 2", eggGroup2:"Dragon" },
  { dex:130,name:"Gyarados",    category:"Atrocious",   description:"Once it begins to rampage, a Gyarados will burn everything down, even in a harsh storm.",                height:6.5,  weight:235.0,color:"blue",   habitat:"sea",        types:["Water","Flying"],   abilities:["Intimidate"],        hiddenAbility:"Moxie",         hp:95, atk:125,def:79, spa:60, spd:100,spe:81, captureRate:45,  baseFriendship:70, growthRate:"slow", eggGroup1:"Water 2", eggGroup2:"Dragon" },
  { dex:131,name:"Lapras",      category:"Transport",   description:"A gentle soul that can read the minds of people. It can ferry people across the sea on its back.",      height:2.5,  weight:220.0,color:"blue",   habitat:"sea",        types:["Water","Ice"],      abilities:["Water Absorb","Shell Armor"],hiddenAbility:"Hydration",  hp:130,atk:85, def:80, spa:85, spd:95, spe:60, captureRate:45,  baseFriendship:70, growthRate:"slow", eggGroup1:"Monster", eggGroup2:"Water 1" },
  { dex:132,name:"Ditto",       category:"Transform",   description:"Capable of copying an enemy's genetic code to instantly transform itself into a duplicate of the enemy.", height:0.3, weight:4.0,  color:"purple", habitat:"urban",      types:["Normal"],           abilities:["Limber"],            hiddenAbility:"Imposter",      hp:48, atk:48, def:48, spa:48, spd:48, spe:48, captureRate:35,  baseFriendship:70, growthRate:"medium-fast", eggGroup1:"Ditto" },
  { dex:133,name:"Eevee",       category:"Evolution",   description:"Its genetic code is irregular. It may mutate if it is exposed to radiation from element Stones.",       height:0.3,  weight:6.5,  color:"brown",  habitat:"urban",      types:["Normal"],           abilities:["Run Away","Adaptability"],hiddenAbility:"Anticipation",hp:55, atk:55, def:50, spa:45, spd:65, spe:55, captureRate:45,  baseFriendship:70, growthRate:"medium-fast", eggGroup1:"Field" },
  { dex:134,name:"Vaporeon",    category:"Bubble Jet",  description:"When its fins begin to vibrate, the temperature of the surrounding water drops sharply.",               height:1.0,  weight:29.0, color:"blue",   habitat:"sea",        types:["Water"],            abilities:["Water Absorb"],      hiddenAbility:"Hydration",     hp:130,atk:65, def:60, spa:110,spd:95, spe:65, captureRate:45,  baseFriendship:70, growthRate:"medium-fast", eggGroup1:"Field" },
  { dex:135,name:"Jolteon",     category:"Lightning",   description:"It accumulates negative ions in the atmosphere to blast out 10000-volt lightning bolts.",               height:0.8,  weight:24.5, color:"yellow", habitat:"grassland",  types:["Electric"],         abilities:["Volt Absorb"],       hiddenAbility:"Quick Feet",    hp:65, atk:65, def:60, spa:110,spd:95, spe:130,captureRate:45,  baseFriendship:70, growthRate:"medium-fast", eggGroup1:"Field" },
  { dex:136,name:"Flareon",     category:"Flame",        description:"When storing thermal energy in its body, its temperature could soar to over 1600 degrees.",            height:0.9,  weight:25.0, color:"red",    habitat:"urban",      types:["Fire"],             abilities:["Flash Fire"],        hiddenAbility:"Guts",          hp:65, atk:130,def:60, spa:95, spd:110,spe:65, captureRate:45,  baseFriendship:70, growthRate:"medium-fast", eggGroup1:"Field" },
  { dex:137,name:"Porygon",     category:"Virtual",      description:"A Pokémon that consists entirely of programming code. Capable of moving freely in cyberspace.",        height:0.8,  weight:36.5, color:"pink",   habitat:"urban",      types:["Normal"],           abilities:["Trace","Download"],hiddenAbility:"Analytic",       hp:65, atk:60, def:70, spa:85, spd:75, spe:40, captureRate:45,  baseFriendship:70, growthRate:"medium-fast", eggGroup1:"Mineral" },
  { dex:138,name:"Omanyte",     category:"Spiral",       description:"Although an ancient and long-since-extinct Pokémon, it was regenerated from a fossil.",                height:0.4,  weight:7.5,  color:"blue",   habitat:"sea",        types:["Rock","Water"],     abilities:["Swift Swim","Shell Armor"],hiddenAbility:"Weak Armor",  hp:35, atk:40, def:100,spa:90, spd:55, spe:35, captureRate:45,  baseFriendship:70, growthRate:"medium-fast", eggGroup1:"Water 1", eggGroup2:"Water 3" },
  { dex:139,name:"Omastar",     category:"Spiral",       description:"A prehistoric Pokémon that died out when its heavy shell made it impossible to catch prey.",            height:1.0,  weight:35.0, color:"blue",   habitat:"sea",        types:["Rock","Water"],     abilities:["Swift Swim","Shell Armor"],hiddenAbility:"Weak Armor",  hp:70, atk:60, def:125,spa:115,spd:70, spe:55, captureRate:45,  baseFriendship:70, growthRate:"medium-fast", eggGroup1:"Water 1", eggGroup2:"Water 3" },
  { dex:140,name:"Kabuto",      category:"Shellfish",   description:"A Pokémon that was resurrected from a fossil found in what was once the ocean floor eons ago.",         height:0.5,  weight:11.5, color:"brown",  habitat:"sea",        types:["Rock","Water"],     abilities:["Swift Swim","Battle Armor"],hiddenAbility:"Weak Armor", hp:30, atk:80, def:90, spa:55, spd:45, spe:55, captureRate:45,  baseFriendship:70, growthRate:"medium-fast", eggGroup1:"Water 1", eggGroup2:"Water 3" },
  { dex:141,name:"Kabutops",    category:"Shellfish",   description:"Its sleek shape is perfect for swimming. It slices its prey with its sharp sickles and drinks the fluids.", height:1.3, weight:40.5, color:"brown",  habitat:"sea",        types:["Rock","Water"],     abilities:["Swift Swim","Battle Armor"],hiddenAbility:"Weak Armor", hp:60, atk:115,def:105,spa:65, spd:70, spe:80, captureRate:45,  baseFriendship:70, growthRate:"medium-fast", eggGroup1:"Water 1", eggGroup2:"Water 3" },
  { dex:142,name:"Aerodactyl",  category:"Fossil",       description:"A ferocious, prehistoric Pokémon that goes for the enemy's throat with its serrated saw-like fangs.",   height:1.8,  weight:59.0, color:"purple", habitat:"mountain",   types:["Rock","Flying"],    abilities:["Rock Head","Pressure"],hiddenAbility:"Unnerve",     hp:80, atk:105,def:65, spa:60, spd:75, spe:130,captureRate:45,  baseFriendship:70, growthRate:"slow", eggGroup1:"Flying" },
  { dex:143,name:"Snorlax",     category:"Sleeping",    description:"Very lazy. Just eats and sleeps. As its rotund bulk builds, it becomes steadily more slothful.",         height:2.1,  weight:460.0,color:"blue",   habitat:"urban",      types:["Normal"],           abilities:["Immunity","Thick Fat"],hiddenAbility:"Gluttony",    hp:160,atk:110,def:65, spa:65, spd:110,spe:30, captureRate:25,  baseFriendship:70, growthRate:"slow", eggGroup1:"Monster" },
  { dex:144,name:"Articuno",    category:"Freeze",       description:"A legendary bird Pokémon that can control ice. The flapping of its wings chills the air.",              height:1.7,  weight:55.4, color:"blue",   habitat:"rare",       types:["Ice","Flying"],     abilities:["Pressure"],          hiddenAbility:"Snow Cloak",   hp:90, atk:85, def:100,spa:95, spd:125,spe:85, captureRate:3,   baseFriendship:35, growthRate:"slow", eggGroup1:"Undiscovered", isLegendary:true },
  { dex:145,name:"Zapdos",      category:"Electric",    description:"A legendary bird Pokémon that is said to appear from clouds while dropping enormous lightning bolts.",    height:1.6,  weight:52.6, color:"yellow", habitat:"rare",       types:["Electric","Flying"], abilities:["Pressure"],         hiddenAbility:"Static",        hp:90, atk:90, def:85, spa:125,spd:90, spe:100,captureRate:3,   baseFriendship:35, growthRate:"slow", eggGroup1:"Undiscovered", isLegendary:true },
  { dex:146,name:"Moltres",     category:"Flame",        description:"Known as the legendary bird of fire. Every flap of its wings creates a dazzling flash of flames.",       height:2.0,  weight:60.0, color:"yellow", habitat:"rare",       types:["Fire","Flying"],    abilities:["Pressure"],          hiddenAbility:"Flame Body",   hp:90, atk:100,def:90, spa:125,spd:85, spe:90, captureRate:3,   baseFriendship:35, growthRate:"slow", eggGroup1:"Undiscovered", isLegendary:true },
  { dex:147,name:"Dratini",     category:"Dragon",       description:"Long thought to be a mythical Pokémon, it was found in large numbers in a lake bottom.",                height:1.8,  weight:3.3,  color:"blue",   habitat:"sea",        types:["Dragon"],           abilities:["Shed Skin"],         hiddenAbility:"Marvel Scale",  hp:41, atk:64, def:45, spa:50, spd:50, spe:50, captureRate:45,  baseFriendship:35, growthRate:"slow", eggGroup1:"Water 1", eggGroup2:"Dragon" },
  { dex:148,name:"Dragonair",   category:"Dragon",       description:"A mystical Pokémon that exudes a gentle aura. Has the ability to change climate conditions.",            height:4.0,  weight:16.5, color:"blue",   habitat:"sea",        types:["Dragon"],           abilities:["Shed Skin"],         hiddenAbility:"Marvel Scale",  hp:61, atk:84, def:65, spa:70, spd:70, spe:70, captureRate:45,  baseFriendship:35, growthRate:"slow", eggGroup1:"Water 1", eggGroup2:"Dragon" },
  { dex:149,name:"Dragonite",   category:"Dragon",       description:"An extremely rarely seen marine Pokémon. Its intelligence is said to match that of humans.",             height:2.2,  weight:210.0,color:"brown",  habitat:"sea",        types:["Dragon","Flying"],  abilities:["Inner Focus"],       hiddenAbility:"Multiscale",    hp:91, atk:134,def:95, spa:100,spd:100,spe:80, captureRate:45,  baseFriendship:35, growthRate:"slow", eggGroup1:"Water 1", eggGroup2:"Dragon" },
  { dex:150,name:"Mewtwo",      category:"Genetic",      description:"It was created by a scientist after years of horrific gene-splicing and DNA-engineering experiments.",   height:2.0,  weight:122.0,color:"purple", habitat:"rare",       types:["Psychic"],          abilities:["Pressure"],          hiddenAbility:"Unnerve",       hp:106,atk:110,def:90, spa:154,spd:90, spe:130,captureRate:3,   baseFriendship:0,  growthRate:"slow", eggGroup1:"Undiscovered", isLegendary:true },
  { dex:151,name:"Mew",         category:"New Species", description:"So rare that it is still said to be a mirage by many experts. Only a few people have seen it worldwide.", height:0.4,  weight:4.0,  color:"pink",   habitat:"rare",       types:["Psychic"],          abilities:["Synchronize"],                             hp:100,atk:100,def:100,spa:100,spd:100,spe:100,captureRate:45, baseFriendship:100,growthRate:"medium-slow", eggGroup1:"Undiscovered", isMythical:true },
];

// ─── EVOLUTION CHAINS ─────────────────────────────────────────────────────────
const EVOLUTIONS: Array<{ from: number; to: number; trigger: string; level?: number; item?: string }> = [
  // Starters
  { from:1,  to:2,  trigger:"level-up", level:16 },
  { from:2,  to:3,  trigger:"level-up", level:32 },
  { from:4,  to:5,  trigger:"level-up", level:16 },
  { from:5,  to:6,  trigger:"level-up", level:36 },
  { from:7,  to:8,  trigger:"level-up", level:16 },
  { from:8,  to:9,  trigger:"level-up", level:36 },
  // Caterpie
  { from:10, to:11, trigger:"level-up", level:7 },
  { from:11, to:12, trigger:"level-up", level:10 },
  // Weedle
  { from:13, to:14, trigger:"level-up", level:7 },
  { from:14, to:15, trigger:"level-up", level:10 },
  // Pidgey
  { from:16, to:17, trigger:"level-up", level:18 },
  { from:17, to:18, trigger:"level-up", level:36 },
  // Rattata
  { from:19, to:20, trigger:"level-up", level:20 },
  // Spearow
  { from:21, to:22, trigger:"level-up", level:20 },
  // Ekans
  { from:23, to:24, trigger:"level-up", level:22 },
  // Pikachu
  { from:25, to:26, trigger:"item", item:"Thunder Stone" },
  // Sandshrew
  { from:27, to:28, trigger:"level-up", level:22 },
  // Nidoran F
  { from:29, to:30, trigger:"level-up", level:16 },
  { from:30, to:31, trigger:"item", item:"Moon Stone" },
  // Nidoran M
  { from:32, to:33, trigger:"level-up", level:16 },
  { from:33, to:34, trigger:"item", item:"Moon Stone" },
  // Clefairy
  { from:35, to:36, trigger:"item", item:"Moon Stone" },
  // Vulpix
  { from:37, to:38, trigger:"item", item:"Fire Stone" },
  // Jigglypuff
  { from:39, to:40, trigger:"item", item:"Moon Stone" },
  // Zubat
  { from:41, to:42, trigger:"level-up", level:22 },
  // Oddish
  { from:43, to:44, trigger:"level-up", level:21 },
  { from:44, to:45, trigger:"item", item:"Leaf Stone" },
  // Paras
  { from:46, to:47, trigger:"level-up", level:24 },
  // Venonat
  { from:48, to:49, trigger:"level-up", level:31 },
  // Diglett
  { from:50, to:51, trigger:"level-up", level:26 },
  // Meowth
  { from:52, to:53, trigger:"level-up", level:28 },
  // Psyduck
  { from:54, to:55, trigger:"level-up", level:33 },
  // Mankey
  { from:56, to:57, trigger:"level-up", level:28 },
  // Growlithe
  { from:58, to:59, trigger:"item", item:"Fire Stone" },
  // Poliwag
  { from:60, to:61, trigger:"level-up", level:25 },
  { from:61, to:62, trigger:"item", item:"Water Stone" },
  // Abra
  { from:63, to:64, trigger:"level-up", level:16 },
  { from:64, to:65, trigger:"item", item:"Trade" },
  // Machop
  { from:66, to:67, trigger:"level-up", level:28 },
  { from:67, to:68, trigger:"item", item:"Trade" },
  // Bellsprout
  { from:69, to:70, trigger:"level-up", level:21 },
  { from:70, to:71, trigger:"item", item:"Leaf Stone" },
  // Tentacool
  { from:72, to:73, trigger:"level-up", level:30 },
  // Geodude
  { from:74, to:75, trigger:"level-up", level:25 },
  { from:75, to:76, trigger:"item", item:"Trade" },
  // Ponyta
  { from:77, to:78, trigger:"level-up", level:40 },
  // Slowpoke
  { from:79, to:80, trigger:"item", item:"Trade" },
  // Magnemite
  { from:81, to:82, trigger:"level-up", level:30 },
  // Doduo
  { from:84, to:85, trigger:"level-up", level:31 },
  // Seel
  { from:86, to:87, trigger:"level-up", level:34 },
  // Grimer
  { from:88, to:89, trigger:"level-up", level:38 },
  // Shellder
  { from:90, to:91, trigger:"item", item:"Water Stone" },
  // Gastly
  { from:92, to:93, trigger:"level-up", level:25 },
  { from:93, to:94, trigger:"item", item:"Trade" },
  // Drowzee
  { from:96, to:97, trigger:"level-up", level:26 },
  // Krabby
  { from:98, to:99, trigger:"level-up", level:28 },
  // Voltorb
  { from:100,to:101,trigger:"level-up", level:30 },
  // Exeggcute
  { from:102,to:103,trigger:"item", item:"Leaf Stone" },
  // Cubone
  { from:104,to:105,trigger:"level-up", level:28 },
  // Horsea
  { from:116,to:117,trigger:"level-up", level:32 },
  // Goldeen
  { from:118,to:119,trigger:"level-up", level:33 },
  // Staryu
  { from:120,to:121,trigger:"item", item:"Water Stone" },
  // Magikarp
  { from:129,to:130,trigger:"level-up", level:20 },
  // Dratini
  { from:147,to:148,trigger:"level-up", level:30 },
  { from:148,to:149,trigger:"level-up", level:55 },
];

// ─── MEGA FORMS ─────────────────────────────────────────────────────────────
type F = {
  pokemonDex: number; name: string; type1: string; type2?: string;
  hp: number; atk: number; def: number; spa: number; spd: number; spe: number;
};

const MEGA_FORMS: F[] = [
  { pokemonDex:3,  name:"Venusaur-Mega",  type1:"Grass", type2:"Poison", hp:80, atk:100,def:123,spa:122,spd:120,spe:80 },
  { pokemonDex:6,  name:"Charizard-Mega-X",type1:"Fire", type2:"Dragon",hp:78, atk:130,def:111,spa:130,spd:85, spe:100 },
  { pokemonDex:6,  name:"Charizard-Mega-Y",type1:"Fire", type2:"Flying",hp:78, atk:104,def:78, spa:159,spd:115,spe:100 },
  { pokemonDex:9,  name:"Blastoise-Mega",  type1:"Water",              hp:79, atk:103,def:120,spa:135,spd:115,spe:78 },
  { pokemonDex:150,name:"Mewtwo-Mega-X",   type1:"Psychic",type2:"Fighting",hp:106,atk:190,def:100,spa:154,spd:100,spe:130 },
  { pokemonDex:150,name:"Mewtwo-Mega-Y",   type1:"Psychic",            hp:106,atk:150,def:70, spa:194,spd:120,spe:140 },
];

// ─── MAIN ────────────────────────────────────────────────────────────────────
async function main() {
  console.log("🌱 Seeding PKMP database...");

  // 1. Types
  console.log("  Inserting types...");
  await db.delete(pokemonTypesTable);
  await db.delete(typesTable);
  const insertedTypes = await db.insert(typesTable).values(TYPES).returning();
  const typeByName = Object.fromEntries(insertedTypes.map(t => [t.name, t.id]));
  console.log(`  ✓ ${insertedTypes.length} types`);

  // 2. Abilities
  console.log("  Inserting abilities...");
  await db.delete(pokemonAbilitiesTable);
  await db.delete(abilitiesTable);
  const insertedAbilities = await db.insert(abilitiesTable).values(ABILITIES_DEDUPED).returning();
  const abilityByName = Object.fromEntries(insertedAbilities.map(a => [a.name, a.id]));
  console.log(`  ✓ ${insertedAbilities.length} abilities`);

  // 3. Moves
  console.log("  Inserting moves...");
  await db.delete(pokemonMovesTable);
  await db.delete(movesTable);
  const insertedMoves = await db.insert(movesTable).values(MOVES_DEDUPED).returning();
  const moveByName = Object.fromEntries(insertedMoves.map(m => [m.name, m.id]));
  console.log(`  ✓ ${insertedMoves.length} moves`);

  // 4. Pokémon
  console.log("  Inserting Pokémon...");
  await db.delete(evolutionsTable);
  await db.delete(formsTable);
  await db.delete(pokemonAbilitiesTable);
  await db.delete(pokemonTypesTable);
  await db.delete(pokemonMovesTable);
  await db.delete(pokemonTable);

  const pokemonValues = POKEMON.map(p => ({
    nationalDexNumber: p.dex,
    name: p.name,
    category: p.category,
    description: p.description,
    generation: 1,
    height: p.height,
    weight: p.weight,
    color: p.color,
    habitat: p.habitat ?? null,
    genderRatio: p.isLegendary || p.isMythical ? null : 0.5,
    captureRate: p.captureRate,
    baseFriendship: p.baseFriendship,
    growthRate: p.growthRate,
    isLegendary: p.isLegendary ?? false,
    isMythical: p.isMythical ?? false,
    isParadox: false,
    isUltraBeast: false,
    statHp: p.hp,
    statAttack: p.atk,
    statDefense: p.def,
    statSpecialAttack: p.spa,
    statSpecialDefense: p.spd,
    statSpeed: p.spe,
    eggGroup1: p.eggGroup1 ?? null,
    eggGroup2: p.eggGroup2 ?? null,
    spriteUrl: `${BASE}/${p.dex}.png`,
    artworkUrl: `${ART}/${p.dex}.png`,
    shinySpriteUrl: `${BASE}/shiny/${p.dex}.png`,
    shinyArtworkUrl: null,
  }));

  const insertedPokemon = await db.insert(pokemonTable).values(pokemonValues).returning();
  const pokemonById = Object.fromEntries(insertedPokemon.map(p => [p.nationalDexNumber, p.id]));
  console.log(`  ✓ ${insertedPokemon.length} Pokémon`);

  // 5. Pokémon Types
  console.log("  Inserting Pokémon types...");
  const typeLinks = POKEMON.flatMap(p =>
    p.types.map((typeName, i) => ({
      pokemonId: pokemonById[p.dex],
      typeId: typeByName[typeName],
      slot: i + 1,
    }))
  ).filter(t => t.typeId !== undefined);
  await db.insert(pokemonTypesTable).values(typeLinks);
  console.log(`  ✓ ${typeLinks.length} type links`);

  // 6. Pokémon Abilities
  console.log("  Inserting Pokémon abilities...");
  const abilityLinks = POKEMON.flatMap(p => {
    const rows = [];
    p.abilities.forEach((name, i) => {
      const id = abilityByName[name];
      if (id) rows.push({ pokemonId: pokemonById[p.dex], abilityId: id, isHidden: false, slot: i + 1 });
    });
    if (p.hiddenAbility) {
      const id = abilityByName[p.hiddenAbility];
      if (id) rows.push({ pokemonId: pokemonById[p.dex], abilityId: id, isHidden: true, slot: 3 });
    }
    return rows;
  });
  if (abilityLinks.length) await db.insert(pokemonAbilitiesTable).values(abilityLinks);
  console.log(`  ✓ ${abilityLinks.length} ability links`);

  // 7. Pokémon Moves (give each starter/first-stage 5 signature moves)
  console.log("  Inserting Pokémon moves...");
  const MOVE_ASSIGNMENTS: Array<{ dex: number; moves: Array<{ name: string; level?: number }> }> = [
    { dex:1,  moves:[{name:"Tackle",level:1},{name:"Growl",level:3},{name:"Vine Whip",level:7},{name:"Leech Seed",level:13},{name:"Razor Leaf",level:22}] },
    { dex:4,  moves:[{name:"Scratch",level:1},{name:"Growl",level:3},{name:"Ember",level:7},{name:"Smokescreen",level:13},{name:"Slash",level:22}] },
    { dex:7,  moves:[{name:"Tackle",level:1},{name:"Tail Whip",level:3},{name:"Bubble",level:7},{name:"Withdraw",level:13},{name:"Water Gun",level:22}] },
    { dex:25, moves:[{name:"Thunder Wave",level:1},{name:"Thunderbolt",level:26},{name:"Agility",level:18},{name:"Swift",level:15},{name:"Bite",level:20}] },
    { dex:94, moves:[{name:"Confusion",level:1},{name:"Bite",level:12},{name:"Psychic",level:29},{name:"Toxic",level:40},{name:"Agility",level:45}] },
    { dex:130,moves:[{name:"Bite",level:1},{name:"Hyper Beam",level:50},{name:"Dragon Rage",level:25},{name:"Surf",level:30},{name:"Agility",level:35}] },
    { dex:149,moves:[{name:"Wing Attack",level:1},{name:"Agility",level:10},{name:"Body Slam",level:20},{name:"Dragon Rage",level:30},{name:"Hyper Beam",level:55}] },
    { dex:150,moves:[{name:"Psychic",level:1},{name:"Agility",level:30},{name:"Amnesia",level:50},{name:"Swift",level:40},{name:"Hyper Beam",level:90}] },
  ];

  const moveLinks = MOVE_ASSIGNMENTS.flatMap(({ dex, moves }) =>
    moves.flatMap(m => {
      const moveId = moveByName[m.name];
      const pokemonId = pokemonById[dex];
      if (!moveId || !pokemonId) return [];
      return [{ pokemonId, moveId, learnMethod: "level-up" as const, levelLearnedAt: m.level ?? 1 }];
    })
  );
  if (moveLinks.length) await db.insert(pokemonMovesTable).values(moveLinks);
  console.log(`  ✓ ${moveLinks.length} move links`);

  // 8. Evolutions
  console.log("  Inserting evolutions...");
  const evoValues = EVOLUTIONS
    .filter(e => pokemonById[e.from] && pokemonById[e.to])
    .map(e => ({
      fromPokemonId: pokemonById[e.from],
      toPokemonId:   pokemonById[e.to],
      trigger: e.trigger,
      minLevel: e.level ?? null,
      item: e.item ?? null,
      heldItem: null,
      timeOfDay: null,
      friendship: null,
      specialRequirement: null,
    }));
  await db.insert(evolutionsTable).values(evoValues);
  console.log(`  ✓ ${evoValues.length} evolutions`);

  // 9. Mega Forms
  console.log("  Inserting Mega forms...");
  const formValues = MEGA_FORMS
    .filter(f => pokemonById[f.pokemonDex])
    .map(f => ({
      pokemonId: pokemonById[f.pokemonDex],
      name: f.name,
      formType: "mega" as const,
      region: null,
      spriteUrl: "",
      artworkUrl: "",
      type1: f.type1,
      type2: f.type2 ?? null,
      statHp:  f.hp,
      statAttack: f.atk,
      statDefense: f.def,
      statSpecialAttack: f.spa,
      statSpecialDefense: f.spd,
      statSpeed: f.spe,
    }));
  await db.insert(formsTable).values(formValues);
  console.log(`  ✓ ${formValues.length} Mega forms`);

  console.log("\n✅ Seed complete!");
  await pool.end();
}

main().catch(err => {
  console.error("Seed failed:", err);
  process.exit(1);
});
