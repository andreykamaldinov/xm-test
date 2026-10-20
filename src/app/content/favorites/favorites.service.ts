import { inject, Injectable, signal } from '@angular/core';
import { Photo } from '../photos/photos.type';
import { LocalStorageService } from '../../shared/localstorage/localstorage.service';
import { LOCALSTORAGE } from '../../shared/localstorage/localstorage.enum';

@Injectable({ providedIn: 'root' })
export class FavoritesService {
    public readonly favoriteIds = signal<Set<string>>(new Set());
    public readonly addedId = signal<string | null>(null);

    private readonly localStorageService = inject(LocalStorageService);
    private readonly localStorageKey = LOCALSTORAGE.Favorites;

    public getFavorites(): Photo[] {
        return this.localStorageService.getItem<Photo[]>(this.localStorageKey) ?? [];
    }

    public getFavoriteById(id: string): Photo | null {
        return this.getFavorites().find((photo) => photo.id === id) ?? null;
    }

    public addFavorite(photo: Photo): void {
        const favorites = this.getFavorites();

        if (favorites.some((item) => item.id === photo.id)) {
            return;
        }

        this.localStorageService.setItem(this.localStorageKey, [...favorites, photo]);
    }

    public removeFavorite(id: string): void {
        this.localStorageService.setItem(
            this.localStorageKey,
            this.getFavorites().filter((photo) => photo.id !== id)
        );
    }

    public addToFavorites(photo: Photo): void {
        if (this.favoriteIds().has(photo.id)) {
            return;
        }

        this.addFavorite(photo);
        this.favoriteIds.update((ids) => new Set(ids).add(photo.id));
        this.addedId.set(photo.id);

        if (this.addedId() === photo.id) {
            this.addedId.set(null);
        }
    }

    public isFavorite(id: string): boolean {
        return this.favoriteIds().has(id);
    }
}
