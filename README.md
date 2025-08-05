# CloudMail

A modern web application that generates professional emails using AI and sends them to multiple recipients instantly. Built with React, TypeScript, and Express.js.

## ✨ Features

- **AI-Powered Email Generation**: Generate professional emails using Groq's LLM API
- **Multi-Recipient Support**: Send emails to multiple recipients at once
- **Real-time Email Editing**: Edit generated emails before sending
- **Modern UI/UX**: Beautiful interface with smooth animations using Framer Motion
- **Toast Notifications**: Real-time feedback for user actions
- **Email Validation**: Built-in email address validation
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## 🚀 Tech Stack

### Frontend
- **React 18** - Modern React with hooks
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Smooth animations and transitions
- **Lucide React** - Beautiful icons

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **Nodemailer** - Email sending functionality
- **Axios** - HTTP client for API calls
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variable management

### External APIs
- **Groq API** - AI-powered email content generation

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Groq API key
- Email service credentials (Gmail, Outlook, etc.)

### Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd cloudmail
   ```

2. **Install dependencies**
   ```bash
   # Install backend dependencies
   cd server
   npm install
   
   # Install frontend dependencies
   cd ../client
   npm install
   ```

3. **Environment Configuration**

   Create a `.env` file in the `server` directory:
   ```env
   GROQ_API_KEY=your_groq_api_key_here
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_email_app_password
   ORIGIN=http://localhost:5173
   ```

   Create a `.env` file in the `client` directory:
   ```env
   VITE_URL=http://localhost:3001
   ```

4. **Start the development servers**
   ```bash
   # Start backend server (from server directory)
   npm start
   
   # Start frontend server (from client directory, in a new terminal)
   npm run dev
   ```

5. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3001

## 🔧 Configuration

### Email Service Setup

For Gmail:
1. Enable 2-factor authentication
2. Generate an App Password
3. Use the App Password in `EMAIL_PASS`

For other providers, check their documentation for SMTP settings.

### Groq API Setup

1. Sign up at [Groq Console](https://console.groq.com/)
2. Generate an API key
3. Add the key to your `.env` file

## 📖 Usage

1. **Generate Email Content**
   - Enter a prompt describing the email you want to generate
   - Click "Generate Email" to create content using AI
   - Review and edit the generated content if needed

2. **Send Email**
   - Enter recipient email addresses (comma-separated for multiple recipients)
   - Click "Send Email" to deliver the message
   - Receive confirmation via toast notification

## 🏗️ Project Structure

```
cloudmail/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── types/         # TypeScript type definitions
│   │   └── App.tsx        # Main application component
│   ├── package.json
│   └── vite.config.ts
├── server/                 # Express backend
│   ├── server.js          # Main server file
│   ├── package.json
│   └── .env              # Environment variables
└── README.md
```

## 🔌 API Endpoints

### POST `/generate`
Generate email content using Groq API.

**Request Body:**
```json
{
  "prompt": "Write a professional email to schedule a meeting"
}
```

**Response:**
```json
{
  "email": "Generated email content..."
}
```

### POST `/send`
Send email to recipients.

**Request Body:**
```json
{
  "recipients": "user1@example.com, user2@example.com",
  "emailBody": "Email content to send"
}
```

**Response:**
```json
{
  "message": "Email sent successfully"
}
```

## 🛠️ Development

### Available Scripts

**Frontend (client directory):**
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

**Backend (server directory):**
- `npm run dev` - Start development server
- `npm start` - Start production server

### Code Style

The project uses:
- ESLint for code linting
- TypeScript for type safety
- Prettier for code formatting (via Tailwind CSS)

## 🚀 Deployment

### Frontend Deployment
1. Build the project: `npm run build`
2. Deploy the `dist` folder to your hosting service (Vercel, Netlify, etc.)

### Backend Deployment
1. Set up environment variables on your hosting platform
2. Deploy to services like Heroku, Railway, or DigitalOcean

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -am 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:
1. Check the [Issues](https://github.com/your-repo/issues) page
2. Create a new issue with detailed information
3. Include error messages and steps to reproduce

## 🙏 Acknowledgments

- [Groq](https://groq.com/) for AI-powered email generation
- [Framer Motion](https://www.framer.com/motion/) for smooth animations
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Lucide](https://lucide.dev/) for beautiful icons
