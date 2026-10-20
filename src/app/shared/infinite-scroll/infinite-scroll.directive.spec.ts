import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { InfiniteScrollDirective } from './infinite-scroll.derective';

@Component({
    selector: 'app-scroll-host',
    template: '',
})
class ScrollHostComponent {}

@Component({
    imports: [InfiniteScrollDirective, ScrollHostComponent],
    selector: 'app-infinite-scroll-spec-host',
    template: `<app-scroll-host
        appInfiniteScroll
        [disabled]="disabled"
        (scrolled)="onScrolled()" />`,
})
class HostComponent {
    public disabled = false;
    public onScrolled = vi.fn();
}

const stubNearBottom = (): void => {
    vi.stubGlobal('innerHeight', 800);
    vi.stubGlobal('scrollY', 1000);
    Object.defineProperty(document.documentElement, 'scrollHeight', {
        configurable: true,
        value: 1500,
    });
};

describe('InfiniteScrollDirective', () => {
    const createHost = async (
        disabled = false
    ): Promise<{
        fixture: ComponentFixture<HostComponent>;
        host: HostComponent;
        directive: InfiniteScrollDirective;
    }> => {
        TestBed.resetTestingModule();
        await TestBed.configureTestingModule({
            imports: [HostComponent],
        }).compileComponents();

        const fixture = TestBed.createComponent(HostComponent);
        const host = fixture.componentInstance;
        host.disabled = disabled;
        fixture.detectChanges();
        const directive = fixture.debugElement
            .query(By.directive(InfiniteScrollDirective))
            .injector.get(InfiniteScrollDirective);

        return { fixture, host, directive };
    };

    it('should emit when the user scrolls near the bottom', async () => {
        const { host, directive } = await createHost();
        stubNearBottom();

        directive.onScroll();

        expect(host.onScrolled).toHaveBeenCalledTimes(1);
    });

    it('should not emit when scrolling is disabled', async () => {
        const { host, directive } = await createHost(true);
        stubNearBottom();

        directive.onScroll();

        expect(host.onScrolled).not.toHaveBeenCalled();
    });

    it('should not emit when the user is far from the bottom', async () => {
        const { host, directive } = await createHost();
        vi.stubGlobal('innerHeight', 500);
        vi.stubGlobal('scrollY', 0);
        Object.defineProperty(document.documentElement, 'scrollHeight', {
            configurable: true,
            value: 2000,
        });

        directive.onScroll();

        expect(host.onScrolled).not.toHaveBeenCalled();
    });
});
