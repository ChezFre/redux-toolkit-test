export async function fetchPokemon(idOrName: number | string) {
  const request = await fetch(`https://pokeapi.co/api/v2/pokemon/${idOrName}`);
  const response = request.json();

  return response;
}
