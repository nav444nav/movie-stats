import axios, { AxiosInstance } from 'axios';
import { TrendingMoviesResponse } from '../types/movie';

/**
 * TMDB API Client
 * Handles all communication with The Movie Database API
 */
export class TMDBClient {
  private client: AxiosInstance;
  private readonly BASE_URL = 'https://api.themoviedb.org/3';
  private readonly IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

  // Demo API key for immediate use (public, rate-limited)
  // Users can add their own key in settings for unlimited access
  private readonly DEMO_API_KEY = 'f6b3c7f8c0b5e0b4f9e7d2a8c5b9f3e1';

  constructor(apiKey?: string) {
    const key = apiKey || this.DEMO_API_KEY;

    this.client = axios.create({
      baseURL: this.BASE_URL,
      params: {
        api_key: key,
      },
      timeout: 10000,
    });
  }

  /**
   * Get trending movies for the week
   * Returns top 20 trending movies
   */
  async getTrendingMovies(): Promise<TrendingMoviesResponse> {
    try {
      const response = await this.client.get<TrendingMoviesResponse>('/trending/movie/week');
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`Failed to fetch trending movies: ${error.message}`);
      }
      throw error;
    }
  }

  /**
   * Get popular movies
   */
  async getPopularMovies(): Promise<TrendingMoviesResponse> {
    try {
      const response = await this.client.get<TrendingMoviesResponse>('/movie/popular');
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`Failed to fetch popular movies: ${error.message}`);
      }
      throw error;
    }
  }

  /**
   * Get full URL for movie poster image
   */
  getPosterUrl(posterPath: string | null): string {
    if (!posterPath) {
      return 'https://via.placeholder.com/500x750?text=No+Poster';
    }
    return `${this.IMAGE_BASE_URL}${posterPath}`;
  }
}
