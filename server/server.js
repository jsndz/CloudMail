const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const nodemailer = require('nodemailer');
const axios = require('axios');

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3001;

// Middleware
app.use(cors({
  origin: process.env.ORIGIN,
  credentials: true
}));
app.use(express.json());

// Error handling middleware
const handleError = (res, error, message = 'An error occurred') => {
  console.error('Error:', error);
  res.status(500).json({ 
    error: error.message || message 
  });
};

// Validate environment variables
const validateEnvVars = () => {
  const required = ['GROQ_API_KEY', 'EMAIL_USER', 'EMAIL_PASS','ORIGIN'];
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    console.error(`Missing required environment variables: ${missing.join(', ')}`);
    process.exit(1);
  }
};

// POST /generate - Generate email content using Groq API
app.post('/generate', async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: 'llama3-8b-8192',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 1000,
        temperature: 0.7
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const emailContent = response.data.choices[0].message.content;

    res.json({ email: emailContent });

  } catch (error) {
    if (error.response) {
      // Groq API error
      handleError(res, { message: `Groq API Error: ${error.response.data.error?.message || 'API request failed'}` });
    } else if (error.request) {
      // Network error
      handleError(res, { message: 'Network error: Unable to connect to Groq API' });
    } else {
      // Other error
      handleError(res, error, 'Failed to generate email content');
    }
  }
});

// POST /send - Send email using nodemailer
app.post('/send', async (req, res) => {
  try {
    const { recipients, emailBody } = req.body;

    if (!recipients || !emailBody) {
      return res.status(400).json({ error: 'Recipients and emailBody are required' });
    }

    // Parse recipients (comma-separated string to array)
    const recipientList = recipients.split(',').map(email => email.trim());

    // Validate email addresses
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const invalidEmails = recipientList.filter(email => !emailRegex.test(email));
    
    if (invalidEmails.length > 0) {
      return res.status(400).json({ 
        error: `Invalid email addresses: ${invalidEmails.join(', ')}` 
      });
    }

    // Create nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    // Verify SMTP connection
    await transporter.verify();

    // Send email to each recipient
    const emailPromises = recipientList.map(recipient => 
      transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: recipient,
        subject: 'Generated Email',
        text: emailBody,
        html: emailBody.replace(/\n/g, '<br>')
      })
    );

    await Promise.all(emailPromises);

    res.json({ success: true });

  } catch (error) {
    if (error.code === 'EAUTH') {
      handleError(res, { message: 'Email authentication failed. Please check EMAIL_USER and EMAIL_PASS.' });
    } else if (error.code === 'ENOTFOUND') {
      handleError(res, { message: 'Email service not found. Please check your internet connection.' });
    } else {
      handleError(res, error, 'Failed to send email');
    }
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
const startServer = () => {
  validateEnvVars();
  
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📧 Email service configured with: ${process.env.EMAIL_USER}`);
    console.log(`🤖 Groq API configured`);
  });
};

startServer();