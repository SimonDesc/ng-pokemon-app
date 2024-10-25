import {Injectable, signal} from "@angular/core";
import {delay, Observable, of} from "rxjs";

@Injectable({
    providedIn: "root",
})

export class AuthService {
    // Deux versions :
    // _isLoggedIn est la source de vérité uniquement modifiable depuis la classe
    // isLoggedIn est juste un "getter" pour avoir l'infos
    private readonly _isLoggedIn = signal(false);
    readonly isLoggedIn = this._isLoggedIn.asReadonly();

    login(name: string, password: string): Observable<boolean> {
        const isLoggedIn = name === 'Pikachu#' && password === 'Pikachu#';
        this._isLoggedIn.set(isLoggedIn);

        return of(isLoggedIn).pipe(delay(1000));
    }


}