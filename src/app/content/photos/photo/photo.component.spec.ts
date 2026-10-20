import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, provideRouter, Router } from '@angular/router';
import { signal } from '@angular/core';
import { FavoritesService } from '../../favorites/favorites.service';
import { PhotoService } from '../photos.service';
import { Photo } from '../photos.type';
import { PhotoComponent } from './photo.component';

const createPhoto = (id = '1'): Photo => ({
    id,
    author: 'Author',
    download_url: 'https://example.com/' + id,
    height: 800,
    url: 'https://example.com',
    width: 800,
});

describe('PhotoComponent', () => {
    let component: PhotoComponent;
    let fixture: ComponentFixture<PhotoComponent>;
    let getParam: ReturnType<typeof vi.fn>;
    let favoritesService: {
        isFavorite: ReturnType<typeof vi.fn>;
        getFavoriteById: ReturnType<typeof vi.fn>;
        removeFavorite: ReturnType<typeof vi.fn>;
    };
    let snackBar: { open: ReturnType<typeof vi.fn> };
    let router: Router;

    beforeEach(async () => {
        getParam = vi.fn(() => '1');
        favoritesService = {
            isFavorite: vi.fn(() => false),
            getFavoriteById: vi.fn(() => createPhoto()),
            removeFavorite: vi.fn(),
        };
        snackBar = { open: vi.fn() };

        await TestBed.configureTestingModule({
            imports: [PhotoComponent],
            providers: [
                provideRouter([]),
                { provide: PhotoService, useValue: { loading: signal(false) } },
                { provide: FavoritesService, useValue: favoritesService },
                { provide: MatSnackBar, useValue: snackBar },
                {
                    provide: ActivatedRoute,
                    useValue: {
                        snapshot: {
                            paramMap: {
                                get: getParam,
                            },
                        },
                    },
                },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(PhotoComponent);
        component = fixture.componentInstance;
        router = TestBed.inject(Router);
        vi.spyOn(router, 'navigate').mockResolvedValue(true);
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should load photo by route id on init', () => {
        const photo = createPhoto('1');
        favoritesService.getFavoriteById.mockReturnValue(photo);

        fixture.detectChanges();

        expect(favoritesService.getFavoriteById).toHaveBeenCalledWith('1');
        expect(component.photo()).toEqual(photo);
    });

    it('should not load photo when route id is missing', () => {
        getParam.mockReturnValue(null);

        component.ngOnInit();

        expect(favoritesService.getFavoriteById).not.toHaveBeenCalled();
        expect(component.photo()).toBeNull();
    });

    it('should not remove a photo when none is loaded', () => {
        component.removeFromFavorites();

        expect(snackBar.open).not.toHaveBeenCalled();
        expect(favoritesService.removeFavorite).not.toHaveBeenCalled();
        expect(router.navigate).not.toHaveBeenCalled();
    });

    it('should remove the photo from favorites and navigate back', () => {
        const photo = createPhoto('7');
        component.photo.set(photo);

        component.removeFromFavorites();

        expect(snackBar.open).toHaveBeenCalledWith('Remove from favorite', 'Cansel', {
            duration: 1500,
        });
        expect(favoritesService.removeFavorite).toHaveBeenCalledWith('7');
        expect(router.navigate).toHaveBeenCalledWith(['/favorites']);
    });
});
