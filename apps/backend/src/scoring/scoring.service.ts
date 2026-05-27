import { Injectable } from '@nestjs/common';

export interface ScoringInput {
  stars: number;
  forks: number;
  lastUpdated: string;
}

@Injectable()
export class ScoringService {
  computeScore(input: ScoringInput): number {
    const normalizedStars = Math.min(input.stars / 50000, 1.0);
    const normalizedForks = Math.min(input.forks / 10000, 1.0);
    const normalizedRecency = this.calculateRecency(input.lastUpdated);

    const raw =
      0.5 * normalizedStars + 0.3 * normalizedForks + 0.2 * normalizedRecency;
    return Math.round(raw * 100);
  }

  private calculateRecency(lastUpdated: string): number {
    const lastUpdatedDate = new Date(lastUpdated);
    const now = new Date();
    const daysSinceUpdate =
      (now.getTime() - lastUpdatedDate.getTime()) / (1000 * 60 * 60 * 24);

    if (daysSinceUpdate <= 30) {
      return 1.0;
    } else if (daysSinceUpdate <= 90) {
      return 0.5;
    } else {
      return 0.2;
    }
  }
}
