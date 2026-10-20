import { HttpClient } from '@angular/common/http';
import { DestroyRef, inject, Injectable, signal } from '@angular/core';
import { delay, finalize, Observable, tap } from 'rxjs';
import { Photo } from './photos.type';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Injectable({ providedIn: 'root' })
export class PhotoService {
    public readonly loading = signal<boolean>(false);
    public readonly photos = signal<Photo[]>([]);

    private readonly page = signal<number>(1);
    private readonly http = inject(HttpClient);
    private readonly apiUrl = 'https://picsum.photos/v2/list';
    private readonly destroyRef = inject(DestroyRef);

    public getPhotos(): Observable<Photo[]> {
        this.loading.set(true);
        const randomDelay = Math.floor(Math.random() * 101) + 200;

        return this.http
            .get<Photo[]>(this.apiUrl, {
                params: {
                    page: this.page(),
                    limit: 20,
                },
            })
            .pipe(
                tap((photos: Photo[]) => {
                    this.photos.update((current) => [...current, ...photos]);
                    this.page.update((page) => page + 1);
                }),
                delay(randomDelay),
                finalize(() => this.loading.set(false)),
                takeUntilDestroyed(this.destroyRef)
            );
    }
}
