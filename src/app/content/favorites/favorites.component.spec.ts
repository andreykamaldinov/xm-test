import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { PhotoService } from '../photos/photos.service';
import { Photo } from '../photos/photos.type';
import { FavoritesComponent } from './favorites.component';
import { FavoritesService } from './favorites.service';

const createPhoto = (id = '1'): Photo => ({
    id,
    author: 'Author',
    download_url: 'https://example.com/' + id,
    height: 300,
    url: 'https://example.com',
    width: 300,
});

describe('FavoritesComponent', () => {
    let component: FavoritesComponent;
    let fixture: ComponentFixture<FavoritesComponent>;
    let favoritesService: {
        isFavorite: ReturnType<typeof vi.fn>;
        getFavorites: ReturnType<typeof vi.fn>;
    };
    let router: Router;

    beforeEach(async () => {
        favoritesService = {
            isFavorite: vi.fn(() => true),
            getFavorites: vi.fn(() => [createPhoto('3')]),
        };

        await TestBed.configureTestingModule({
            imports: [FavoritesComponent],
            providers: [
                provideRouter([]),
                { provide: PhotoService, useValue: { loading: signal(false) } },
                { provide: FavoritesService, useValue: favoritesService },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(FavoritesComponent);
        component = fixture.componentInstance;
        router = TestBed.inject(Router);
        vi.spyOn(router, 'navigate').mockResolvedValue(true);
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should load favorites on init', () => {
        fixture.detectChanges();

        expect(favoritesService.getFavorites).toHaveBeenCalledTimes(1);
        expect(component.photos()).toEqual([createPhoto('3')]);
    });

    it('should navigate to the photo details page', () => {
        const photo = createPhoto('9');

        component.openPhoto(photo);

        expect(router.navigate).toHaveBeenCalledWith(['/photos', '9']);
    });
});
