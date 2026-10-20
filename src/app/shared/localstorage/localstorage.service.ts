import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class LocalStorageService {
    public getItem<T>(key: string): T | null {
        const value = localStorage.getItem(key);

        return value ? (JSON.parse(value) as T) : null;
    }

    public setItem<T>(key: string, value: T): void {
        localStorage.setItem(key, JSON.stringify(value));
    }
}
