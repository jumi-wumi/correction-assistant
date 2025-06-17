# Student Assignment Assessment Tool

A full-stack application for uploading and automatically assessing student assignments using AI. The system allows teachers to upload multiple files (PDFs and text documents), provide a Notion URL with assignment descriptions, and get automated assessments of whether students have completed required tasks.

## Features

- **Bulk File Upload**: Upload entire folders of student assignments
- **PDF Text Extraction**: Automatically extracts text content from PDF files
- **Notion Integration**: Scrapes assignment descriptions from Notion pages
- **AI Assessment**: Uses OpenAI's GPT models to assess completion of assignment requirements
- **File Preview**: View uploaded PDFs directly in the browser
- **Real-time Progress**: Shows assessment progress with loading indicators

## Tech Stack

### Frontend
- **React 19** with Vite
- **Tailwind CSS** for styling
- File upload and management interface
- Real-time assessment status updates

### Backend
- **Node.js** with Express
- **Multer** for file upload handling
- **Puppeteer** for Notion page scraping
- **OpenAI API** for AI-powered assessments
- **PDF text extraction** using afpp library

## Project Structure

```
project/
├── client/                 # React frontend
│   ├── src/
│   │   ├── Dashboard.jsx   # Main dashboard component
│   │   ├── FileUpload.jsx  # File upload interface
│   │   ├── FileList.jsx    # Display uploaded files
│   │   └── AssessmentModal.jsx # Assessment configuration modal
│   └── package.json
├── server/                 # Express backend
│   ├── routes/
│   │   ├── upload-unzipped.js   # File upload handling
│   │   └── assess-folder.js     # Assessment logic
│   ├── extract-notion.js   # Notion page scraping
│   ├── index.js           # Server entry point
│   └── package.json
└── README.md
```

## Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- OpenAI API key

### Environment Configuration

1. **Server Environment Variables**
   Create a `.env` file in the `server/` directory:
   ```env
   PORT=3000
   OPEN_AI_KEY=your_openai_api_key_here
   ```

2. **Client Environment Variables**
   Create a `.env` file in the `client/` directory:
   ```env
   VITE_API_URL=http://localhost:3000
   ```

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd project
   ```

2. **Install server dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Install client dependencies**
   ```bash
   cd ../client
   npm install
   ```

4. **Create uploads directory**
   ```bash
   cd ../server
   mkdir uploads
   ```

### Running the Application

1. **Start the backend server**
   ```bash
   cd server
   npm run dev
   ```
   Server will run on http://localhost:3000

2. **Start the frontend development server**
   ```bash
   cd client
   npm run dev
   ```
   Client will run on http://localhost:5173

## Usage

1. **Upload Files**: Select a folder containing student assignment files (PDFs or text files)
2. **Upload to Server**: Click "Ladda upp filer" to upload all selected files
3. **Configure Assessment**: 
   - Click "Kontrollera alla filer" to open the assessment modal
   - Enter a Notion URL containing the assignment description (optional)
4. **Run Assessment**: Click "Kör" to start the AI assessment process
5. **View Results**: Assessment results will appear in the file list table
6. **Preview Files**: Click on any filename to preview the PDF content

## API Endpoints

### POST `/upload-from-folder`
Uploads multiple files to the server.
- **Body**: FormData with files
- **Response**: Array of uploaded file information

### POST `/assess-folder`
Assesses uploaded files against assignment requirements.
- **Body**: 
  ```json
  {
    "notionUrl": "https://notion.so/...",
    "uploadedFiles": [...]
  }
  ```
- **Response**: Assessment results for each file

### GET `/uploads/:filename`
Serves uploaded files for preview.

## Key Components

### Dashboard.jsx
Main application component that manages state and coordinates between child components.

### FileUpload.jsx
Handles folder selection and file upload to the server. Uses HTML5 `webkitdirectory` attribute for folder selection.

### FileList.jsx
Displays uploaded files in a table format with assessment results and preview functionality.

### AssessmentModal.jsx
Modal interface for configuring and running assessments, including progress indicators.

### extract-notion.js
Puppeteer-based scraper that extracts text content from Notion pages to use as assignment descriptions.

### assess-folder.js
Core assessment logic that processes files, extracts text content, and uses OpenAI API for evaluation.

## File Processing

The application supports:
- **PDF files**: Text extraction using the `afpp` library
- **Text files**: Direct reading of file content
- **Error handling**: Graceful handling of unreadable or corrupted files

## Assessment Logic

The AI assessment:
1. Extracts text from uploaded files
2. Uses Notion content as assignment requirements (if provided)
3. Sends both to OpenAI's GPT model for evaluation
4. Returns assessment results in Swedish
5. Focuses on checking completion of "G-nivå" (passing grade) requirements

## Security Considerations

- CORS configured for localhost development
- File uploads stored with UUID-based filenames
- Rate limiting should be implemented for production use
- API keys stored in environment variables

## Development Notes

- The application uses Swedish language for the UI
- Assessment prompts are in Swedish
- File upload uses temporary storage (consider cloud storage for production)
- Notion scraping relies on specific CSS selectors that may change

## Future Improvements

- Add user authentication
- Implement file storage cleanup
- Add support for more file formats
- Improve error handling and user feedback
- Add assessment criteria customization
- Implement batch processing optimization