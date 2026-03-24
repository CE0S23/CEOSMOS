import { Injectable } from '@angular/core';
import { Observable, of, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { FeedDataService } from './feed-data.service';
import { SearchResult } from '../models/feed-item.model';
import { CosmosImage, MusicTrack } from '../models/feed-item.model';

@Injectable({ providedIn: 'root' })
export class SearchService {
  constructor(private feedData: FeedDataService) {}

  search(query: string, filter: 'all' | 'image' | 'music' = 'all'): Observable<SearchResult[]> {
    const q = this.normalize(query);
    const images$ = of(this.feedData.getImages()).pipe(map(imgs => this.mapImages(imgs, q)));
    const tracks$ = of(this.feedData.getTracks()).pipe(map(trks => this.mapTracks(trks, q)));

    if (filter === 'image') return images$;
    if (filter === 'music') return tracks$;

    return combineLatest([images$, tracks$]).pipe(
      map(([imgs, trks]) => [...imgs, ...trks].sort((a, b) => (b.relevance ?? 0) - (a.relevance ?? 0)))
    );
  }

  private mapImages(images: CosmosImage[], q: string): SearchResult[] {
    return images
      .map(i => ({ ...i, relevance: this.relevance(q, i.title, i.category) }))
      .filter(i => i.relevance > 0)
      .map(i => ({ id: i.id, type: 'image' as const, title: i.title, category: i.category, url: i.url, relevance: i.relevance }));
  }

  private mapTracks(tracks: MusicTrack[], q: string): SearchResult[] {
    return tracks
      .map(t => ({ ...t, relevance: this.relevance(q, t.name, t.type, t.description) }))
      .filter(t => t.relevance > 0)
      .map(t => ({ id: t.id, type: 'music' as const, title: t.name, description: t.description, category: t.type, url: t.embedUrl, relevance: t.relevance }));
  }

  private relevance(q: string, ...fields: string[]): number {
    let score = 0;
    fields.forEach((f, idx) => {
      const n = this.normalize(f);
      if (n === q) score += 100 - idx * 10;
      else if (n.startsWith(q)) score += 50 - idx * 5;
      else if (n.includes(q)) score += 25 - idx * 3;
    });
    return score;
  }

  private normalize(s: string): string {
    return s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }
}
