import { Component, inject } from '@angular/core';
import { FeedDataService } from '../../../core/services/feed-data.service';
import { FeedCardComponent } from '../feed-card/feed-card.component';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
  selector: 'app-flow-feed',
  standalone: true,
  imports: [FeedCardComponent, SkeletonModule],
  template: `
    <section class="flow-feed" aria-label="Flow Feed">
      <div class="masonry-grid">
        @for (item of feedService.feed(); track item.id) {
          @defer (on viewport) {
            <app-feed-card [item]="item" />
          } @placeholder {
            <div class="card-placeholder">
              <p-skeleton width="100%" height="260px" borderRadius="16px" />
            </div>
          }
        }
      </div>
    </section>
  `,
  styleUrl: './flow-feed.component.scss',
})
export class FlowFeedComponent {
  readonly feedService = inject(FeedDataService);
}
