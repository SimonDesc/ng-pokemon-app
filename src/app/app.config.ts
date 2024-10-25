import {ApplicationConfig, provideZoneChangeDetection} from '@angular/core';
import {provideRouter, Routes} from '@angular/router';
import {PokemonListComponent} from "./pokemon/pokemon-list/pokemon-list.component";
import {PokemonProfileComponent} from "./pokemon/pokemon-profile/pokemon-profile.component";
import {PageNotFoundComponent} from "./page-not-found/page-not-found.component";
import {PokemonEditComponent} from "./pokemon/pokemon-edit/pokemon-edit.component";
import {provideHttpClient} from "@angular/common/http";
import {AuthGuard} from "./core/auth/auth.guard";
import {LoginComponent} from "./login/login.component";
import {PokemonAddComponent} from "./pokemon/pokemon-add/pokemon-add.component";
import { PokemonService } from './pokemon.service';
import { PokemonJSONServerService } from './pokemon-json-server.service';
import { PokemonLocalStorageService } from './pokemon-local-storage.service';
import { environment } from '../environments/environment';

function pokemonServiceFactory(): PokemonService {
    return environment.production
        ? new PokemonLocalStorageService()
        : new PokemonJSONServerService();
}

const routes: Routes = [
    {
        path: 'login',
        component: LoginComponent,
        title: 'Page de connexion',
    },
    {
        path: 'pokemons',
        canActivateChild: [AuthGuard],
        children: [
            {
                path: 'add',
                component: PokemonAddComponent,
                title: 'PokemonsAdd',
            },
            {
                path: 'edit/:id',
                component: PokemonEditComponent,
                title: 'Pokémon',
            },
            {
                path: ':id',
                component: PokemonProfileComponent,
                title: 'Pokédex',
            },
            {
                path: '',
                component: PokemonListComponent,
                title: 'Pokemons',
            },
        ],
    },
    {
        path: '',
        redirectTo: '/pokemons',
        pathMatch: 'full'
    },
    {
        path: '**',
        component: PageNotFoundComponent
    }
];
export const appConfig: ApplicationConfig = {
    providers: [
        provideZoneChangeDetection({eventCoalescing: true}),
        provideRouter(routes),
        provideHttpClient(),
        {
            provide: PokemonService,
            useFactory: pokemonServiceFactory,
        },
    ]
};

