import { Component, input } from '@angular/core';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

@Component({
    imports: [MatProgressSpinner],
    selector: 'app-spinner',
    styleUrl: './spinner.component.scss',
    templateUrl: './spinner.component.html',
})
export class SpinnerComponent {
    public readonly loading = input<boolean>(false);
}
