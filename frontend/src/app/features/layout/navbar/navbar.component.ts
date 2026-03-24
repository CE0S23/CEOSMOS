import { Component, inject, OnInit, OnDestroy, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, takeUntil } from 'rxjs/operators';
import { SidebarModule } from 'primeng/sidebar';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { BadgeModule } from 'primeng/badge';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { FeedDataService } from '../../../core/services/feed-data.service';
import { AuthService } from '../../../core/services/auth.service';
import { SearchService } from '../../../core/services/search.service';
import { SearchResult } from '../../../core/models/feed-item.model';

interface NavLink {
  label: string;
  path: string;
  icon: string;
}

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, ReactiveFormsModule, SidebarModule, ButtonModule, AvatarModule, BadgeModule, OverlayPanelModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent implements OnInit, OnDestroy {
  private readonly feedData = inject(FeedDataService);
  readonly auth = inject(AuthService);
  private readonly searchService = inject(SearchService);
  private readonly destroy$ = new Subject<void>();

  sidebarOpen = signal(false);
  searchResults = signal<SearchResult[]>([]);
  showDropdown = signal(false);

  searchControl = new FormControl('');

  navLinks: NavLink[] = [
    { label: 'Feed', path: '/feed', icon: '⚡' },
    { label: 'Inicio', path: '/home', icon: '🏠' },
    { label: 'Privacidad', path: '/privacidad', icon: '🔒' },
  ];

  externalLinks = [
    { label: 'Lofi Girl', url: 'https://www.youtube.com/c/LofiGirl', icon: 'pi pi-youtube', color: '#ff6b6b' },
    { label: 'Brain.fm', url: 'https://www.brain.fm/', icon: 'pi pi-headphones', color: '#4ecdc4' },
    { label: 'Unsplash', url: 'https://unsplash.com/', icon: 'pi pi-camera', color: '#a8e6cf' },
    { label: 'Pomofocus', url: 'https://pomofocus.io/', icon: 'pi pi-clock', color: '#ff7675' },
    { label: 'Deep Work', url: 'https://www.calnewport.com/books/deep-work/', icon: 'pi pi-book', color: '#a29bfe' }
  ];

  ngOnInit(): void {
    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(q => {
        const term = q?.trim() ?? '';
        this.feedData.updateSearch(term);
        if (term.length < 2) { this.showDropdown.set(false); return []; }
        return this.searchService.search(term);
      }),
      takeUntil(this.destroy$)
    ).subscribe(results => {
      this.searchResults.set(results.slice(0, 6));
      this.showDropdown.set(results.length > 0);
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  clearSearch(): void {
    this.searchControl.setValue('');
    this.searchResults.set([]);
    this.showDropdown.set(false);
    this.feedData.updateSearch('');
  }

  selectResult(result: SearchResult): void {
    this.clearSearch();
    if (result.type === 'music') window.open(result.url.replace('embed/', 'watch?v='), '_blank', 'noopener,noreferrer');
  }
}
