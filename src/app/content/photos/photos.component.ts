import { Component, inject, OnInit } from '@angular/core';
import { FavoritesService } from '../favorites/favorites.service';
import { PhotoService } from './photos.service';
import { ListComponent } from '../../shared/list/list.component';
import { InfiniteScrollDirective } from '../../shared/infinite-scroll/infinite-scroll.derective';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Photo } from './photos.type';

@Component({
    imports: [ListComponent, InfiniteScrollDirective],
    selector: 'app-photos',
    styleUrl: './photos.component.scss',
    templateUrl: './photos.component.html',
})
export class PhotosComponent implements OnInit {
    public readonly photosService = inject(PhotoService);
    public readonly favoritesService = inject(FavoritesService);

    private readonly snackBar = inject(MatSnackBar);

    public ngOnInit(): void {
        this.favoritesService.favoriteIds.set(
            new Set(this.favoritesService.getFavorites().map((photo) => photo.id))
        );
        this.loadPhotos();
    }

    public loadPhotos(): void {
        if (this.photosService.loading()) {
            return;
        }
        this.photosService.getPhotos().subscribe();
    }

    public addToFavorite(photo: Photo): void {
        const isFavorite = this.favoritesService.isFavorite(photo.id);
        if (!isFavorite) {
            this.snackBar.open('Added to favorites', 'Cansel', {
                duration: 1500,
            });
        }

        this.favoritesService.addToFavorites(photo);
    }
}
