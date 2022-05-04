import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import * as pokemonService from "./pokemonApi";

// createSlice => main API function to define your redux logic
// PayloadAction =. This is the contents of one given action object

interface PokemonType {
  name: string;
  url: string;
}

interface Pokemon {
  image: string;
  order: number;
  name: string;
  types: PokemonType[];
}

interface PokemonState {
  pokemon: Pokemon[];
  status: "idle" | "loading" | "failed";
}

const initialState: PokemonState = {
  pokemon: [],
  status: "idle",
};

export const fetchPokemonAsync = createAsyncThunk(
  "pokemon/fetchPokemon",
  async (idOrName: number | string) => {
    const response = await pokemonService.fetchPokemon(idOrName);
    console.log({ response });
    return response;
  }
);

// slide has the reducer inside it to update data, but also generates an action creator for every function inside the reducer
const pokemonSlice = createSlice({
  name: "pokemon",
  initialState,
  reducers: {
    // // different types of logic and updates in this pokemon slice
    // fetchPokemon(state, action: PayloadAction<Pokemon>) {
    //   // don't even need a return, we can mutate state because of immer
    //   // immer wraps our state updates, tracks mutations and replays tthem in an immutable way
    //   state.pokemon.push(action.payload);
    // },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPokemonAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchPokemonAsync.fulfilled, (state, action) => {
        state.status = "idle";
        console.log({ action });

        state.pokemon.push({
          order: action.payload.order,
          name: action.payload.name,
          image: action.payload.sprites.front_default,
          types: action.payload.types.map(
            ({
              type: { name, url },
            }: {
              type: { name: string; url: string };
            }) => ({
              name,
              url,
            })
          ),
        });
      })
      .addCase(fetchPokemonAsync.rejected, (state) => {
        state.status = "failed";
      });
  },
});

// export const { fetchPokemon } = pokemonSlice.actions;

export const selectPokemon = (state: RootState) => state.pokemon.pokemon;
export const selectPokemonStatus = (state: RootState) => state.pokemon.status;

export default pokemonSlice.reducer;
