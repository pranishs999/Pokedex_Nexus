// fetch_and_store.js - Fetch all Pokémon data once from the local API and store as JSON and CSV

import fs from 'fs/promises';
import path from 'path';
import { pipeline } from 'stream';
import { promisify } from 'util';
import { createWriteStream } from 'fs';

const pipelineAsync = promisify(pipeline);

// Adjust the base URL to match your running API server
const BASE_URL = 'http://localhost:8080';

// Helper to fetch all Pokémon (using limit query)
async function fetchAllPokemon() {
  const limit = 1025; // total number of Pokémon in the DB
  const res = await fetch(`${BASE_URL}/api/pokemon?limit=${limit}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch Pokémon: ${res.status} ${await res.text()}`);
  }
  const data = await res.json();
  // The API returns { results: Pokemon[] }
  return data.results || data;
}

function jsonToCsv(jsonArray) {
  if (!Array.isArray(jsonArray) || jsonArray.length === 0) return '';
  const headers = Object.keys(jsonArray[0]);
  const rows = jsonArray.map((obj) =>
    headers.map((h) => (obj[h] !== undefined ? String(obj[h]).replace(/"/g, '""') : '').join(','),
  );
  return `${headers.join(',')}\n${rows.join('\n')}`;
}

async function main() {
  console.log('Fetching Pokémon data from API...');
  const pokemon = await fetchAllPokemon();

  const outDir = path.resolve('data');
  await fs.mkdir(outDir, { recursive: true });

  const jsonPath = path.join(outDir, 'pokemon.json');
  await fs.writeFile(jsonPath, JSON.stringify(pokemon, null, 2), 'utf-8');
  console.log(`Wrote JSON to ${jsonPath}`);

  const csvPath = path.join(outDir, 'pokemon.csv');
  const csvContent = jsonToCsv(pokemon);
  await fs.writeFile(csvPath, csvContent, 'utf-8');
  console.log(`Wrote CSV to ${csvPath}`);
}

main().catch((e) => {
  console.error('Error during fetch/store:', e);
  process.exit(1);
});
