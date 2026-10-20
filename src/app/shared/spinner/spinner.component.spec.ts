import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SpinnerComponent } from './spinner.component';

describe('SpinnerComponent', () => {
    let component: SpinnerComponent;
    let fixture: ComponentFixture<SpinnerComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [SpinnerComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(SpinnerComponent);
        component = fixture.componentInstance;
        await fixture.whenStable();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should hide overlay when loading is false', () => {
        fixture.componentRef.setInput('loading', false);
        fixture.detectChanges();

        expect(fixture.nativeElement.querySelector('.loading-overlay')).toBeNull();
    });

    it('should show overlay when loading is true', () => {
        fixture.componentRef.setInput('loading', true);
        fixture.detectChanges();

        const overlay = fixture.nativeElement.querySelector('.loading-overlay') as HTMLElement;

        expect(overlay).toBeTruthy();
        expect(overlay.getAttribute('aria-label')).toBe('Loading');
        expect(overlay.querySelector('mat-spinner')).toBeTruthy();
    });
});
