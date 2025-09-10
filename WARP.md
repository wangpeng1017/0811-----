# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

This is a Next.js-based AI-powered photo location recognition application that uses Google's Gemini 2.5 Flash multimodal model. Users can upload images to get detailed geographic location information including continent, country, province, city, specific location, and GPS coordinates.

### Core Features
- **AI Image Analysis**: Uses Gemini 2.5 Flash model for accurate location identification
- **Streaming Content Generation**: Real-time streaming introduction generation using Server-Sent Events
- **Smart Chat System**: Context-aware Q&A based on recognition results
- **Share Functionality**: Generate shareable links with QR codes
- **Example Images**: Quick experience with pre-selected landmark images
- **Token Management**: Built-in usage tracking and cost control
- **Responsive Design**: Mobile-first UI optimized for WeChat browser

## Development Commands

### Setup and Installation (Windows PowerShell)
```powershell
# Install dependencies
npm install

# Copy environment template
Copy-Item .env.local.example .env.local
```

### Development
```powershell
# Start development server (default port 3000)
npm run dev

# Start dev server on port 3003 (matches test-app-api.js)
npm run dev -- -p 3003

# Build for production
npm run build

# Start production server
npm run start

# Run linting
npm run lint
```

### Testing
```powershell
# Test the application API with real images
# NOTE: This script calls Zhipu API directly and requires a valid token.
# Update the script to read the token from an environment variable before running.
node test-real-image.js

# Test the application API endpoints (expects app running on http://localhost:3003)
node test-app-api.js
```

## Environment Configuration

- Node.js 18+ is required (fetch API is used in Node context by test scripts).

### Required Environment Variables
- `GEMINI_API_KEY`: Your Google Gemini API key (required for Gemini 2.5 Flash model)
- `NEXT_PUBLIC_ADMIN_PASSWORD`: Admin panel password (optional)
- `NEXT_PUBLIC_BASE_URL`: Base URL for the application (optional, auto-detected)

### Getting Google Gemini API Key
1. Visit [Google AI Studio](https://ai.google.dev/) or [Google Cloud Console](https://console.cloud.google.com/)
2. Create a project and enable the Generative Language API
3. Generate an API key
4. Add to `.env.local` file
5. Note: Gemini 2.5 Flash has usage limits and may require billing setup for higher usage

### Important note about tests and secrets
- Do not hardcode API tokens in scripts. The test scripts now read `GEMINI_API_KEY` from the environment.
- In PowerShell, you can set it for the current session like:
```powershell
$env:GEMINI_API_KEY = "{{GEMINI_API_KEY}}"
```
Replace {{GEMINI_API_KEY}} with your actual API key value.

## Architecture Overview

### Frontend Architecture
- **Next.js 14.2.5** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **React Components** with hooks-based state management
- **Client-side image compression** before upload

### Backend Architecture
- **Next.js API Routes** as serverless functions
- **Gemini 2.5 Flash Integration** for multimodal reasoning
- **In-memory storage** for images and shares (development)
- **Token usage tracking** with daily/total limits
- **Server-Sent Events** for streaming responses

### Key Components Structure

#### Core UI Components
- `ImageUpload`: File selection with validation
- `LocationResult`: Results display with sharing/chat features  
- `ExampleImages`: Pre-selected landmark images for quick testing
- `UsageStats`: Token usage monitoring
- `ErrorBoundary`: Error handling wrapper

#### API Endpoints
- `/api/analyze-image`: Main image analysis using Gemini 2.5 Flash
- `/api/upload-image`: Image upload and storage
- `/api/images/[imageId]`: Serve stored images
- `/api/generate-introduction`: Generate location descriptions
- `/api/generate-introduction-stream`: Streaming content generation
- `/api/chat`: Context-aware Q&A system
- `/api/share`: Create/retrieve shareable content
- `/api/status`: Service health and usage statistics

#### Utility Libraries
- `token-manager.ts`: Usage tracking and cost control
- `image-storage.ts`: In-memory image storage with cleanup
- `api.ts`: Client-side API calls and image compression
- `markdown-utils.ts`: Text formatting utilities

### Data Flow
1. **Image Upload**: Client compresses → uploads to server → stores in memory
2. **AI Analysis**: Server calls Gemini with inlineData image + structured prompt
3. **Results Display**: Parse JSON response → show location data
4. **Content Generation**: Stream additional content via SSE
5. **Chat System**: Context-aware conversations using location data
6. **Sharing**: Generate unique URLs with embedded content

## Gemini 2.5 Flash Integration Details

### Model Configuration
- **Model**: `gemini-2.5-flash` (multimodal fast reasoning model)
- **Temperature**: 0.1 for analysis, 0.7 for content generation
- **Max Output Tokens**: 2000 for analysis, 1500 for streaming content
- **Input**: Supports text + images via inlineData

### Prompt Engineering
The application uses carefully crafted prompts that:
- Require Chinese language responses for all location names
- Request structured JSON output with specific fields
- Handle multimodal input (text + image)
- Include fallback parsing for mixed text/JSON responses

### Token Management
- **Total Limit**: 20 million tokens
- **Daily Limit**: 100,000 tokens
- **Usage Tracking**: Automatic recording of actual token consumption
- **Cost Control**: Pre-flight checks before API calls

## Production Considerations

### Deployment Platform
- **Recommended**: Vercel (optimized for Next.js)
- **Alternative**: Netlify or other Node.js platforms
- **Serverless Functions**: All API routes are serverless-ready

### Storage Upgrades for Production
Current implementation uses in-memory storage. For production:
- Replace `image-storage.ts` with cloud storage (AWS S3, Cloudinary)
- Replace `token-manager.ts` memory storage with Vercel KV or database
- Update share functionality to use persistent storage

### Performance Optimizations
- Image compression on client-side before upload
- Streaming responses for better UX
- Automatic cleanup of expired content
- CDN integration for static assets

### Security Features
- API token stored securely in environment variables
- File type and size validation
- CORS configuration in `vercel.json`
- Request rate limiting through token management

## Development Guidelines

### Component Development
- Use TypeScript for all new components
- Follow existing patterns for state management
- Implement proper error boundaries
- Add loading states for better UX

### API Development  
- Follow existing error handling patterns
- Include proper request validation
- Return consistent response formats
- Log important operations for debugging

### Styling Guidelines
- Use Tailwind CSS classes consistently
- Follow mobile-first responsive design
- Maintain existing color scheme and spacing
- Test on various screen sizes

### Testing
Use the provided test scripts:
- `test-real-image.js`: Tests Gemini API directly (requires GEMINI_API_KEY env var)
- `test-app-api.js`: Tests application endpoints

## Common Development Tasks

### Adding New API Endpoints
1. Create new route file in `src/app/api/[endpoint]/route.ts`
2. Follow existing error handling patterns
3. Add proper TypeScript types in `src/types/index.ts`
4. Update `vercel.json` if special configuration needed

### Modifying Gemini Prompts
Edit the prompt in `src/app/api/analyze-image/route.ts`:
- Maintain JSON structure requirements
- Keep Chinese language requirements
- Test with various image types
- Monitor token usage changes
- Use Gemini's contents/parts structure

### Adding New UI Features
1. Create component in `src/components/`
2. Add to main page at `src/app/page.tsx`
3. Follow existing responsive design patterns
4. Add proper TypeScript interfaces

### Integrating New AI Features
- Follow existing patterns in API routes
- Add proper token usage estimation
- Include error handling for API failures
- Test with rate limiting scenarios
