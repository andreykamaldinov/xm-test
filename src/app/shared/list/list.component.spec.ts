import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { FavoritesService } from '../../content/favorites/favorites.service';
import { PhotoService } from '../../content/photos/photos.service';
import { Photo } from '../../content/photos/photos.type';
import { ROUTE } from '../route/route.enum';
import { ListComponent } from './list.component';

const createPhoto = (id = '1', author = 'Author'): Photo => ({
    id,
    author,
    download_url: 'https://example.com/' + id,
    height: 300,
    url: 'https://example.com',
    width: 300,
});

describe('ListComponent', () => {
    let component: ListComponent;
    let fixture: ComponentFixture<ListComponent>;
    let favoritesService: { isFavorite: ReturnType<typeof vi.fn> };

    beforeEach(async () => {
        favoritesService = {
            isFavorite: vi.fn(() => false),
        };

        await TestBed.configureTestingModule({
            imports: [ListComponent],
            providers: [
                provideRouter([]),
                { provide: PhotoService, useValue: { loading: signal(false) } },
                { provide: FavoritesService, useValue: favoritesService },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(ListComponent);
        component = fixture.componentInstance;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should expose navigation pages', () => {
        expect(component.pages).toEqual([
            { title: 'Photos', route: ROUTE.Photos },
            { title: 'Favorites', route: ROUTE.Favorites },
        ]);
    });

    it('should render the title and empty message when there are no photos', () => {
        fixture.componentRef.setInput('title', 'Favorites list');
        fixture.componentRef.setInput('emptyMsg', 'No favorite photos yet');
        fixture.componentRef.setInput('photos', []);
        fixture.detectChanges();

        expect(fixture.nativeElement.querySelector('h1')?.textContent).toContain('Favorites list');
        expect(fixture.nativeElement.querySelector('.empty')?.textContent).toContain(
            'No favorite photos yet'
        );
        expect(fixture.nativeElement.querySelector('.photo-card')).toBeNull();
    });

    it('should render photos and emit on card click', () => {
        const photo = createPhoto('4', 'Ada');
        const emitted: Photo[] = [];
        component.photoCLick.subscribe((value) => emitted.push(value));

        fixture.componentRef.setInput('photos', [photo]);
        fixture.detectChanges();

        const card = fixture.nativeElement.querySelector('.photo-card') as HTMLButtonElement;
        expect(card.getAttribute('aria-label')).toBe('Open photo by Ada');
        expect(fixture.nativeElement.querySelector('.empty')).toBeNull();

        card.click();

        expect(emitted).toEqual([photo]);
    });

    it('should show a favorite badge when the photo is in favorites', () => {
        favoritesService.isFavorite.mockReturnValue(true);
        fixture.componentRef.setInput('photos', [createPhoto()]);
        fixture.componentRef.setInput('showIsFavoriteBadge', true);
        fixture.detectChanges();

        expect(fixture.nativeElement.querySelector('.photo-badge')?.textContent).toContain(
            'In favorites'
        );
        expect(fixture.nativeElement.querySelector('img')?.classList.contains('is-favorite')).toBe(
            true
        );
    });
});
