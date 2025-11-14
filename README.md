# 🎬 Movie Stats - VSCode Extension

View trending movies directly in Visual Studio Code! Take quick breaks and stay updated on popular movies without leaving your development environment.

![Movie Stats Banner](resources/icon.png)

## ✨ Features

- **Top Trending Movies**: Browse the top 20 trending movies of the week
- **Simple & Clean UI**: Minimalist grid layout with movie posters and ratings
- **Easy Navigation**: Next/Previous buttons to browse through movies
- **Dark/Light Theme Support**: Automatically adapts to your VSCode theme
- **No Setup Required**: Works immediately with included demo API key
- **Activity Bar Integration**: Quick access via the activity bar icon

## 📸 Screenshots

### Main View
The extension displays 5 trending movies at a time in a clean grid layout:

```
┌────────────────────────────────────────────┐
│  🎬 Trending Movies          [🔄 Refresh]  │
├────────────────────────────────────────────┤
│                                            │
│  [Poster] [Poster] [Poster] [Poster] [Poster]
│  Movie 1  Movie 2  Movie 3  Movie 4  Movie 5
│  ⭐ 8.5   ⭐ 7.9   ⭐ 9.1   ⭐ 8.2   ⭐ 7.6
│                                            │
│       [◀ Prev]  1-5 of 20  [Next ▶]       │
└────────────────────────────────────────────┘
```

## 🚀 Getting Started

### Installation

1. **From VSIX** (Local Installation):
   ```bash
   # Install dependencies
   npm install

   # Build the extension
   npm run compile

   # Package the extension
   npx vsce package

   # Install in VSCode
   code --install-extension movie-stats-1.0.0.vsix
   ```

2. **From Source** (Development):
   ```bash
   # Clone the repository
   git clone <repository-url>
   cd movie-stats

   # Install dependencies
   npm install

   # Open in VSCode
   code .

   # Press F5 to launch Extension Development Host
   ```

### Quick Start

1. Click the 🎬 **Movie Stats** icon in the activity bar (left sidebar)
2. The extension will automatically load trending movies
3. Use **Next/Prev** buttons to browse through movies
4. Click **Refresh** to get the latest trending movies

### Using Your Own API Key (Optional)

The extension includes a demo API key for immediate use. For unlimited requests:

1. Sign up at [The Movie Database (TMDB)](https://www.themoviedb.org/signup)
2. Request an API key from [TMDB Settings](https://www.themoviedb.org/settings/api)
3. In VSCode:
   - Open Settings (`Cmd/Ctrl + ,`)
   - Search for "Movie Stats"
   - Enter your API key in `movieStats.apiKey`

## 🎯 Usage

### Available Commands

Access these commands via the Command Palette (`Cmd/Ctrl + Shift + P`):

- `Movie Stats: Show Trending Movies` - Open the Movie Stats panel
- `Movie Stats: Refresh` - Refresh movie data

### Navigation

- **Next Button**: View movies 6-10, 11-15, 16-20
- **Prev Button**: Go back to previous page
- **Refresh Button**: Reload trending movies from API
- **Counter**: Shows current range (e.g., "1-5 of 20")

## 🛠️ Technology Stack

- **TypeScript**: Type-safe development
- **VSCode Extension API**: Webview and Activity Bar integration
- **TMDB API**: The Movie Database API for movie data
- **Axios**: HTTP client for API requests
- **Webpack**: Module bundling
- **ESLint & Prettier**: Code quality and formatting

## 📁 Project Structure

```
movie-stats/
├── src/
│   ├── extension.ts              # Extension entry point
│   ├── movieStatsProvider.ts     # Webview provider and UI logic
│   ├── api/
│   │   └── tmdbClient.ts         # TMDB API client
│   └── types/
│       └── movie.ts              # TypeScript interfaces
├── resources/
│   ├── icon.png                  # Extension icon
│   └── movie-icon.svg            # Activity bar icon
├── package.json                  # Extension manifest
├── tsconfig.json                 # TypeScript config
├── webpack.config.js             # Webpack config
├── .eslintrc.json               # ESLint config
└── README.md                     # This file
```

## 🔧 Development

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Visual Studio Code

### Setup Development Environment

```bash
# Install dependencies
npm install

# Compile TypeScript
npm run compile

# Watch mode for development
npm run watch

# Lint code
npm run lint

# Format code
npm run format
```

### Testing

1. Press `F5` in VSCode to launch the Extension Development Host
2. In the new window, click the Movie Stats icon
3. Test navigation, refresh, and error handling

### Building

```bash
# Production build
npm run package

# Create VSIX package
npx vsce package
```

## 🎨 UI Features

### Responsive Design
- Adapts to panel width
- Grid layout adjusts for narrow/wide views
- Mobile-friendly aspect ratios

### Theme Support
- Uses VSCode's native color tokens
- Automatically switches with editor theme
- Consistent with VSCode's design language

### User Experience
- Loading states while fetching data
- Error messages for network issues
- Disabled buttons at pagination boundaries
- Smooth transitions and hover effects

## 🔒 Privacy & Security

- **No Data Collection**: This extension does not collect any user data
- **API Key Security**: API keys stored in VSCode settings (not in code)
- **XSS Protection**: All HTML output is escaped
- **HTTPS Only**: All API requests use secure HTTPS

## 📊 API Information

### TMDB API

This extension uses [The Movie Database (TMDB) API](https://www.themoviedb.org/documentation/api):

- **Endpoint**: `/trending/movie/week`
- **Data Returned**: Top 20 trending movies
- **Update Frequency**: Daily
- **Rate Limit**: Demo key limited, personal key ~40 req/10sec

### Data Displayed

For each movie:
- Title
- Poster image (500px width)
- Rating (vote average out of 10)
- Release year (from release_date)

## 🐛 Troubleshooting

### Movies Not Loading

1. Check your internet connection
2. Verify TMDB API is accessible
3. If using custom API key, ensure it's valid
4. Try clicking Refresh button

### Extension Not Appearing

1. Ensure extension is installed: `code --list-extensions`
2. Reload VSCode window: `Developer: Reload Window`
3. Check VSCode output panel for errors

### Build Errors

```bash
# Clean build
rm -rf dist/ out/ node_modules/
npm install
npm run compile
```

## 📝 License

MIT License - See [LICENSE](LICENSE) file for details

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 🙏 Acknowledgments

- Movie data provided by [The Movie Database (TMDB)](https://www.themoviedb.org/)
- Icons from [Material Design Icons](https://materialdesignicons.com/)
- Built with [VSCode Extension API](https://code.visualstudio.com/api)

## 📮 Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/movie-stats/issues)
- **Questions**: Open a discussion on GitHub
- **Email**: your.email@example.com

## 🗺️ Roadmap

Future features planned:

- [ ] Search functionality for specific movies
- [ ] Filter by genre
- [ ] Detailed movie view with cast and crew
- [ ] Popular movies and top-rated movies tabs
- [ ] Upcoming movies section
- [ ] Movie watchlist feature
- [ ] Customizable number of movies per page

---

**Enjoy discovering trending movies while you code! 🎬**

Made with ❤️ for developers who love movies
