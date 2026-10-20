import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ROUTE } from '../route/route.enum';
import { SpinnerComponent } from '../spinner/spinner.component';
import { PhotoService } from '../../content/photos/photos.service';
import { Page } from './list.type';
import { Photo } from '../../content/photos/photos.type';
import { NgOptimizedImage } from '@angular/common';
import { FavoritesService } from '../../content/favorites/favorites.service';

@Component({
    imports: [MatButton, RouterLinkActive, RouterLink, SpinnerComponent, NgOptimizedImage],
    selector: 'app-list',
    styleUrl: './list.component.scss',
    templateUrl: './list.component.html',
})
export class ListComponent {
    public readonly title = input<string>('');
    public readonly emptyMsg = input<string>('');
    public readonly photoWidth = input<number>(300);
    public readonly photoHeight = input<number>(300);
    public readonly showIsFavoriteBadge = input<boolean>(false);
    public readonly photos = input<Photo[]>([]);
    public readonly photoCLick = output<Photo>();
    public readonly pages: Page[] = [
        { title: 'Photos', route: ROUTE.Photos },
        { title: 'Favorites', route: ROUTE.Favorites },
    ];
    public readonly photosService = inject(PhotoService);
    public readonly favoritesService = inject(FavoritesService);

    public onClick(photo: Photo): void {
        this.photoCLick.emit(photo);
    }
}
