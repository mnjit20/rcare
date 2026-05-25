import { ScoringService } from './scoring.service';

describe('ScoringService', () => {
  let service: ScoringService;

  beforeEach(() => {
    service = new ScoringService();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('computeScore', () => {
    it('should compute score near 100 for high stars/forks and recent update', () => {
      const now = new Date();
      const recentDate = new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000);

      const score = service.computeScore({
        stars: 50000,
        forks: 10000,
        lastUpdated: recentDate.toISOString(),
      });

      expect(score).toBeGreaterThanOrEqual(90);
      expect(score).toBeLessThanOrEqual(100);
    });

    it('should compute low score for zero stars/forks and stale update', () => {
      const now = new Date();
      const staleDate = new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000);

      const score = service.computeScore({
        stars: 0,
        forks: 0,
        lastUpdated: staleDate.toISOString(),
      });

      expect(score).toBeLessThanOrEqual(20);
    });

    it('should clamp normalized stars at 1.0', () => {
      const now = new Date();
      const recentDate = new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000);

      const score1 = service.computeScore({
        stars: 100000,
        forks: 10000,
        lastUpdated: recentDate.toISOString(),
      });

      const score2 = service.computeScore({
        stars: 50000,
        forks: 10000,
        lastUpdated: recentDate.toISOString(),
      });

      expect(score1).toBe(score2);
    });

    it('should clamp normalized forks at 1.0', () => {
      const now = new Date();
      const recentDate = new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000);

      const score1 = service.computeScore({
        stars: 50000,
        forks: 20000,
        lastUpdated: recentDate.toISOString(),
      });

      const score2 = service.computeScore({
        stars: 50000,
        forks: 10000,
        lastUpdated: recentDate.toISOString(),
      });

      expect(score1).toBe(score2);
    });

    it('should return 1.0 recency factor for updates within 30 days', () => {
      const now = new Date();
      const date30DaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

      const score = service.computeScore({
        stars: 0,
        forks: 0,
        lastUpdated: date30DaysAgo.toISOString(),
      });

      expect(score).toBe(20);
    });

    it('should return 0.5 recency factor for updates within 31-90 days', () => {
      const now = new Date();
      const date45DaysAgo = new Date(now.getTime() - 45 * 24 * 60 * 60 * 1000);

      const score = service.computeScore({
        stars: 0,
        forks: 0,
        lastUpdated: date45DaysAgo.toISOString(),
      });

      expect(score).toBe(10);
    });

    it('should return 0.2 recency factor for updates older than 90 days', () => {
      const now = new Date();
      const date180DaysAgo = new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000);

      const score = service.computeScore({
        stars: 0,
        forks: 0,
        lastUpdated: date180DaysAgo.toISOString(),
      });

      expect(score).toBe(4);
    });

    it('should compute correct score for typical repository', () => {
      const now = new Date();
      const recentDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

      const score = service.computeScore({
        stars: 10000,
        forks: 2000,
        lastUpdated: recentDate.toISOString(),
      });

      const expectedNormStars = 10000 / 50000;
      const expectedNormForks = 2000 / 10000;
      const expectedRecency = 1.0;
      const expectedScore = Math.round(
        (0.5 * expectedNormStars + 0.3 * expectedNormForks + 0.2 * expectedRecency) * 100,
      );

      expect(score).toBe(expectedScore);
    });

    it('should handle edge case of exactly 31 days old', () => {
      const now = new Date();
      const date31DaysAgo = new Date(now.getTime() - 31 * 24 * 60 * 60 * 1000);

      const score = service.computeScore({
        stars: 0,
        forks: 0,
        lastUpdated: date31DaysAgo.toISOString(),
      });

      expect(score).toBe(10);
    });

    it('should handle edge case of exactly 91 days old', () => {
      const now = new Date();
      const date91DaysAgo = new Date(now.getTime() - 91 * 24 * 60 * 60 * 1000);

      const score = service.computeScore({
        stars: 0,
        forks: 0,
        lastUpdated: date91DaysAgo.toISOString(),
      });

      expect(score).toBe(4);
    });
  });
});
