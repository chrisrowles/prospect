export interface Pagination<T> {
  data: T[];
  first_page_url: string;
  last_page_url: string;
  next_page_url: string | null;
  prev_page_url: string | null;
  path: string;
  per_page: number;
  from: number;
  to: number;
  total: number;
  current_page: number;
  last_page: number;
}