import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { FavoritesService } from '../favorites/favorites.service';
import { PhotosComponent } from './photos.component';
import { PhotoService } from './photos.service';
import { Photo } from './photos.type';

const createPhoto = (id = '1'): Photo => ({
    id,
    author: 'Author',
    download_url: 'https://example.com/' + id,
    height: 300,
    url: 'https://example.com',
    width: 300,
});

describe('PhotosComponent', () => {
    let component: PhotosComponent;
    let fixture: ComponentFixture<PhotosComponent>;
    let photosService: {
        loading: ReturnType<typeof signal<boolean>>;
        photos: ReturnType<typeof signal<Photo[]>>;
        getPhotos: ReturnType<typeof vi.fn>;
    };
    let favoritesService: {
        favoriteIds: ReturnType<typeof signal<Set<string>>>;
        getFavorites: ReturnType<typeof vi.fn>;
        isFavorite: ReturnType<typeof vi.fn>;
        addToFavorites: ReturnType<typeof vi.fn>;
    };
    let snackBar: { open: ReturnType<typeof vi.fn> };

    beforeEach(async () => {
        photosService = {
            loading: signal(false),
            photos: signal<Photo[]>([]),
            getPhotos: vi.fn(() => of([])),
        };
        favoritesService = {
            favoriteIds: signal(new Set<string>()),
            getFavorites: vi.fn(() => [createPhoto('10')]),
            isFavorite: vi.fn(() => false),
            addToFavorites: vi.fn(),
        };
        snackBar = { open: vi.fn() };

        await TestBed.configureTestingModule({
            imports: [PhotosComponent],
            providers: [
                provideRouter([]),
                { provide: PhotoService, useValue: photosService },
                { provide: FavoritesService, useValue: favoritesService },
                { provide: MatSnackBar, useValue: snackBar },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(PhotosComponent);
        component = fixture.componentInstance;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should load favorite ids and photos on init', () => {
        fixture.detectChanges();

        expect(favoritesService.favoriteIds()).toEqual(new Set(['10']));
        expect(photosService.getPhotos).toHaveBeenCalledTimes(1);
    });

    it('should not load photos when a request is already in progress', () => {
        photosService.loading.set(true);

        component.loadPhotos();

        expect(photosService.getPhotos).not.toHaveBeenCalled();
    });

    it('should add a photo to favorites and show a snackbar when it is not a favorite', () => {
        const photo = createPhoto('2');
        favoritesService.isFavorite.mockReturnValue(false);

        component.addToFavorite(photo);

        expect(snackBar.open).toHaveBeenCalledWith('Added to favorites', 'Cansel', {
            duration: 1500,
        });
        expect(favoritesService.addToFavorites).toHaveBeenCalledWith(photo);
    });

    it('should add a photo to favorites without a snackbar when it is already a favorite', () => {
        const photo = createPhoto('2');
        favoritesService.isFavorite.mockReturnValue(true);

        component.addToFavorite(photo);

        expect(snackBar.open).not.toHaveBeenCalled();
        expect(favoritesService.addToFavorites).toHaveBeenCalledWith(photo);
    });
});
