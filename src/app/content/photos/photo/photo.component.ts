import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FavoritesService } from '../../favorites/favorites.service';
import { Photo } from '../photos.type';
import { MatButton } from '@angular/material/button';
import { ListComponent } from '../../../shared/list/list.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
    imports: [MatButton, ListComponent],
    selector: 'app-photo',
    styleUrl: './photo.component.scss',
    templateUrl: './photo.component.html',
})
export class PhotoComponent implements OnInit {
    public readonly photo = signal<Photo | null>(null);

    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);
    private readonly favoritesService = inject(FavoritesService);
    private readonly snackBar = inject(MatSnackBar);

    public ngOnInit(): void {
        const id = this.route.snapshot.paramMap.get('id');

        if (!id) {
            return;
        }

        this.photo.set(this.favoritesService.getFavoriteById(id));
    }

    public removeFromFavorites(): void {
        const current = this.photo();

        if (!current) {
            return;
        }
        this.snackBar.open('Remove from favorite', 'Cansel', {
            duration: 1500,
        });
        this.favoritesService.removeFavorite(current.id);
        this.router.navigate(['/favorites']);
    }
}
