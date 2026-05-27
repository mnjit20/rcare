export interface GithubRepository {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  updated_at: string;
  created_at: string;
}

export interface GithubSearchResponse {
  data: {
    items: GithubRepository[];
  };
}
