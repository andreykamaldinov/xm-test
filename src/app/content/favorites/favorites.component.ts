import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Photo } from '../photos/photos.type';
import { FavoritesService } from './favorites.service';
import { ListComponent } from '../../shared/list/list.component';

@Component({
    imports: [ListComponent],
    selector: 'app-favorites',
    styleUrl: './favorites.component.scss',
    templateUrl: './favorites.component.html',
})
export class FavoritesComponent implements OnInit {
    public readonly photos = signal<Photo[]>([]);

    private readonly favoritesService = inject(FavoritesService);
    private readonly router = inject(Router);

    public ngOnInit(): void {
        this.photos.set(this.favoritesService.getFavorites());
    }

    public openPhoto(photo: Photo): void {
        this.router.navigate(['/photos', photo.id]);
    }
}
