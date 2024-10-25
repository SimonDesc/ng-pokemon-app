import {Observable} from "rxjs";
import {Pokemon, PokemonList} from "./pokemon.model";

export abstract class PokemonService {
    abstract getPokemonList(): Observable<PokemonList>;
    abstract getPokemonById(id: number): Observable<Pokemon>;
    abstract updatePokemon(pokemon: Pokemon): Observable<Pokemon>;
    abstract deletePokemon(pokemonId: number | undefined): Observable<void>;
    abstract addPokemon(pokemon: Omit<Pokemon, 'id'>): Observable<Pokemon>;
    abstract getPokemonTypeList(): string[];
}