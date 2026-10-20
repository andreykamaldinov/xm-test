import { Directive, input, output } from '@angular/core';

@Directive({
    selector: '[appInfiniteScroll]',
    host: {
        '(window:scroll)': 'onScroll()',
    },
})
export class InfiniteScrollDirective {
    public readonly disabled = input(false);
    public readonly scrolled = output();

    public onScroll(): void {
        const nearBottom =
            window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 200;

        if (nearBottom && !this.disabled()) {
            this.scrolled.emit();
        }
    }
}
