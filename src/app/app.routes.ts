import { Routes } from '@angular/router';
import { ROUTE } from './shared/route/route.enum';

export const routes: Routes = [
    {
        path: '',
        redirectTo: ROUTE.Photos,
        pathMatch: 'full',
    },
    {
        path: ROUTE.Favorites,
        loadComponent: () =>
            import('./content/favorites/favorites.component').then((m) => m.FavoritesComponent),
    },
    {
        path: ROUTE.Photos,
        loadComponent: () =>
            import('./content/photos/photos.component').then((m) => m.PhotosComponent),
    },
    {
        path: ROUTE.Photo,
        loadComponent: () =>
            import('./content/photos/photo/photo.component').then((m) => m.PhotoComponent),
    },
    {
        path: '**',
        redirectTo: ROUTE.Photos,
    },
];
