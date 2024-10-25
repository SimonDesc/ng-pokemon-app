import {Component, effect, inject, signal} from '@angular/core';
import {FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {Pokemon, POKEMON_RULES} from "../../pokemon.model";
import {Router, RouterLink} from "@angular/router";
import {toSignal} from "@angular/core/rxjs-interop";
import {PokemonService} from "../../pokemon.service";

@Component({
    selector: 'app-pokemon-add',
    standalone: true,
    imports: [
        ReactiveFormsModule,
        RouterLink
    ],
    templateUrl: './pokemon-add.component.html',
    styles: ``
})
export class PokemonAddComponent {
    readonly router = inject(Router);
    readonly pokemonService = inject(PokemonService);
    readonly pokemon = signal('');
    readonly POKEMON_RULES = signal(POKEMON_RULES).asReadonly()

    get pokemonTypeList(): FormArray {
        return this.form.get('types') as FormArray;
    }

    isPokemonTypeSelected(type: string): boolean {
        return !!this.pokemonTypeList.controls.find(
            (control) => control.value === type
        )
    }

    onPokemonTypeChange(type: string, isChecked: boolean): void {
        if (isChecked) {
            const control = new FormControl(type);
            this.pokemonTypeList.push(control);
        } else {
            const index = this.pokemonTypeList.controls
                .map((control) => control.value)
                .indexOf(type);
            this.pokemonTypeList.removeAt(index);
        }
    }

    readonly form = new FormGroup({
        name: new FormControl('', [
            Validators.required,
            Validators.minLength(POKEMON_RULES.MIN_NAME),
            Validators.maxLength(POKEMON_RULES.MAX_NAME),
            Validators.pattern(POKEMON_RULES.NAME_PATTERN),
        ]),
        picture: new FormControl('', [
            Validators.required,
        ]),
        life: new FormControl(10),
        damage: new FormControl(1),
        types: new FormArray(
            [ new FormControl('Normal')],
            [
                Validators.required,
                Validators.maxLength(POKEMON_RULES.MAX_TYPES)
            ]
        )
    })


    getTypeColor(type: string): string {
        return type === 'Electrik' ? 'black' : 'white';
    }

    get pokemonName() {
        return this.form.get('name') as FormControl;
    }

    get pokemonLife() {
        return this.form.get('life') as FormControl;
    }

    get pokemonDamage() {
        return this.form.get('damage') as FormControl;
    }

    get pokemonPicture() {
        return this.form.get('picture') as FormControl;
    }


    incrementDamage() {
        const newValue = this.pokemonDamage.value + 1;
        this.pokemonDamage.setValue(newValue);
    }

    decrementDamage() {
        const newValue = this.pokemonDamage.value - 1;
        this.pokemonDamage.setValue(newValue)
    }

    incrementLife() {
        const newValue = this.pokemonLife.value + 1;
        this.pokemonLife.setValue(newValue);
    }

    decrementLife() {
        const newValue = this.pokemonLife.value - 1;
        this.pokemonLife.setValue(newValue)
    }


    onSubmit() {
        const isFormValid = this.form.valid;
        const pokemon = this.pokemon();
        console.log(isFormValid, pokemon)
        if (isFormValid) {
            const newPokemon: Pokemon = {
                name: this.pokemonName.value as string,
                picture: this.pokemonPicture.value,
                life: this.pokemonLife.value,
                damage: this.pokemonDamage.value,
                types: this.pokemonTypeList.value,
            };
            this.pokemonService.addPokemon(newPokemon).subscribe(() => {
                this.router.navigate(['']);
            })
        }
    }
}
