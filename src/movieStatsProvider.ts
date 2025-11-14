import * as vscode from 'vscode';
import { TMDBClient } from './api/tmdbClient';
import { Movie } from './types/movie';

/**
 * WebView provider for Movie Stats panel
 */
export class MovieStatsProvider implements vscode.WebviewViewProvider {
  public static readonly viewType = 'movieStatsView';

  private _view?: vscode.WebviewView;
  private tmdbClient: TMDBClient;
  private allMovies: Movie[] = [];
  private currentPage = 0;
  private readonly MOVIES_PER_PAGE = 5;

  constructor(private readonly _extensionUri: vscode.Uri) {
    this.tmdbClient = new TMDBClient();
  }

  /**
   * Called when the view is first created
   */
  public resolveWebviewView(
    webviewView: vscode.WebviewView,
    _context: vscode.WebviewViewResolveContext,
    _token: vscode.CancellationToken
  ) {
    this._view = webviewView;

    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [this._extensionUri],
    };

    webviewView.webview.html = this._getLoadingHtml();

    // Handle messages from the webview
    webviewView.webview.onDidReceiveMessage(async (data) => {
      switch (data.type) {
        case 'nextPage':
          this.nextPage();
          break;
        case 'prevPage':
          this.prevPage();
          break;
        case 'refresh':
          this.refresh();
          break;
      }
    });

    // Load initial data
    this.loadMovies();
  }

  /**
   * Refresh movie data
   */
  public async refresh() {
    this.currentPage = 0;
    await this.loadMovies();
  }

  /**
   * Load trending movies from API
   */
  private async loadMovies() {
    try {
      // Get API key from settings or use demo key
      const config = vscode.workspace.getConfiguration('movieStats');
      const apiKey = config.get<string>('apiKey');

      if (apiKey) {
        this.tmdbClient = new TMDBClient(apiKey);
      }

      const response = await this.tmdbClient.getTrendingMovies();
      this.allMovies = response.results;
      this.updateView();
    } catch (error) {
      this.showError(error instanceof Error ? error.message : 'Unknown error occurred');
    }
  }

  /**
   * Navigate to next page
   */
  private nextPage() {
    const maxPage = Math.ceil(this.allMovies.length / this.MOVIES_PER_PAGE) - 1;
    if (this.currentPage < maxPage) {
      this.currentPage++;
      this.updateView();
    }
  }

  /**
   * Navigate to previous page
   */
  private prevPage() {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.updateView();
    }
  }

  /**
   * Get current page of movies
   */
  private getCurrentMovies(): Movie[] {
    const start = this.currentPage * this.MOVIES_PER_PAGE;
    const end = start + this.MOVIES_PER_PAGE;
    return this.allMovies.slice(start, end);
  }

  /**
   * Update the webview content
   */
  private updateView() {
    if (this._view) {
      const movies = this.getCurrentMovies();
      this._view.webview.html = this._getHtmlForWebview(movies);
    }
  }

  /**
   * Show error message in webview
   */
  private showError(message: string) {
    if (this._view) {
      this._view.webview.html = this._getErrorHtml(message);
    }
  }

  /**
   * Generate HTML content for webview
   */
  private _getHtmlForWebview(movies: Movie[]): string {
    const totalPages = Math.ceil(this.allMovies.length / this.MOVIES_PER_PAGE);
    const start = this.currentPage * this.MOVIES_PER_PAGE + 1;
    const end = Math.min(start + this.MOVIES_PER_PAGE - 1, this.allMovies.length);

    const movieCards = movies
      .map(
        (movie) => `
      <div class="movie-card">
        <img
          src="${this.tmdbClient.getPosterUrl(movie.poster_path)}"
          alt="${movie.title}"
          class="poster"
        />
        <div class="movie-info">
          <div class="title">${this.escapeHtml(movie.title)}</div>
          <div class="rating">⭐ ${movie.vote_average.toFixed(1)}</div>
        </div>
      </div>
    `
      )
      .join('');

    return `<!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Movie Stats</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: var(--vscode-font-family);
          color: var(--vscode-foreground);
          background-color: var(--vscode-editor-background);
          padding: 16px;
        }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        h1 {
          font-size: 20px;
          font-weight: 600;
        }

        .refresh-btn {
          background: var(--vscode-button-background);
          color: var(--vscode-button-foreground);
          border: none;
          padding: 6px 12px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 12px;
        }

        .refresh-btn:hover {
          background: var(--vscode-button-hoverBackground);
        }

        .movies-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
          gap: 16px;
          margin-bottom: 24px;
        }

        .movie-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        .poster {
          width: 100%;
          aspect-ratio: 2/3;
          object-fit: cover;
          border-radius: 8px;
          margin-bottom: 8px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
        }

        .movie-info {
          width: 100%;
        }

        .title {
          font-size: 13px;
          font-weight: 500;
          margin-bottom: 4px;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          line-height: 1.3;
        }

        .rating {
          font-size: 12px;
          color: var(--vscode-descriptionForeground);
        }

        .pagination {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 12px;
          margin-top: 20px;
        }

        .page-btn {
          background: var(--vscode-button-secondaryBackground);
          color: var(--vscode-button-secondaryForeground);
          border: none;
          padding: 8px 16px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 13px;
          min-width: 80px;
        }

        .page-btn:hover:not(:disabled) {
          background: var(--vscode-button-secondaryHoverBackground);
        }

        .page-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .page-info {
          font-size: 13px;
          color: var(--vscode-descriptionForeground);
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>🎬 Trending Movies</h1>
        <button class="refresh-btn" onclick="refresh()">🔄 Refresh</button>
      </div>

      <div class="movies-grid">
        ${movieCards}
      </div>

      <div class="pagination">
        <button
          class="page-btn"
          onclick="prevPage()"
          ${this.currentPage === 0 ? 'disabled' : ''}
        >
          ◀ Prev
        </button>
        <span class="page-info">${start}-${end} of ${this.allMovies.length}</span>
        <button
          class="page-btn"
          onclick="nextPage()"
          ${this.currentPage >= totalPages - 1 ? 'disabled' : ''}
        >
          Next ▶
        </button>
      </div>

      <script>
        const vscode = acquireVsCodeApi();

        function nextPage() {
          vscode.postMessage({ type: 'nextPage' });
        }

        function prevPage() {
          vscode.postMessage({ type: 'prevPage' });
        }

        function refresh() {
          vscode.postMessage({ type: 'refresh' });
        }
      </script>
    </body>
    </html>`;
  }

  /**
   * Loading state HTML
   */
  private _getLoadingHtml(): string {
    return `<!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body {
          font-family: var(--vscode-font-family);
          color: var(--vscode-foreground);
          background-color: var(--vscode-editor-background);
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          margin: 0;
        }
        .loading {
          text-align: center;
        }
      </style>
    </head>
    <body>
      <div class="loading">
        <h2>🎬 Loading trending movies...</h2>
      </div>
    </body>
    </html>`;
  }

  /**
   * Error state HTML
   */
  private _getErrorHtml(message: string): string {
    return `<!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body {
          font-family: var(--vscode-font-family);
          color: var(--vscode-errorForeground);
          background-color: var(--vscode-editor-background);
          padding: 20px;
        }
        .error {
          text-align: center;
        }
      </style>
    </head>
    <body>
      <div class="error">
        <h2>❌ Error</h2>
        <p>${this.escapeHtml(message)}</p>
      </div>
    </body>
    </html>`;
  }

  /**
   * Escape HTML to prevent XSS
   */
  private escapeHtml(text: string): string {
    const map: { [key: string]: string } = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;',
    };
    return text.replace(/[&<>"']/g, (m) => map[m]);
  }
}
