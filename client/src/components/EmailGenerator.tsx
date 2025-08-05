import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Send, Sparkles, Users } from 'lucide-react';
import { GenerateEmailRequest, GenerateEmailResponse, SendEmailRequest } from '../types';

interface EmailGeneratorProps {
  onShowToast: (message: string, type: 'success' | 'error') => void;
}

const EmailGenerator: React.FC<EmailGeneratorProps> = ({ onShowToast }) => {
  const [recipients, setRecipients] = useState('');
  const [prompt, setPrompt] = useState('');
  const [generatedEmail, setGeneratedEmail] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [showEmailEditor, setShowEmailEditor] = useState(false);
  const API_URL= import.meta.env.VITE_URL;
  
  const handleGenerateEmail = async () => {
    if (!prompt.trim()) {
      onShowToast('Please enter a prompt for email generation', 'error');
      return;
    }

    setIsGenerating(true);
    
    try {
      const response = await fetch(`${API_URL}/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt } as GenerateEmailRequest),
      });

      if (!response.ok) {
        throw new Error(`Failed to generate email: ${response.statusText}`);
      }

      const data: GenerateEmailResponse = await response.json();
      
      setGeneratedEmail(data.email);
      setEmailBody(data.email);
      setShowEmailEditor(true);
      onShowToast('Email generated successfully!', 'success');
    } catch (error) {
      console.error('Error generating email:', error);
      onShowToast('Failed to generate email. Please try again.', 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSendEmail = async () => {
    if (!recipients.trim()) {
      onShowToast('Please enter at least one recipient email address', 'error');
      return;
    }

    if (!emailBody.trim()) {
      onShowToast('Please generate or enter email content', 'error');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const recipientList = recipients.split(',').map(email => email.trim());
    const invalidEmails = recipientList.filter(email => !emailRegex.test(email));
    
    if (invalidEmails.length > 0) {
      onShowToast(`Invalid email addresses: ${invalidEmails.join(', ')}`, 'error');
      return;
    }

    setIsSending(true);

    try {
      const response = await fetch(`${API_URL}/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recipients,
          emailBody,
        } as SendEmailRequest),
      });

      if (!response.ok) {
        throw new Error(`Failed to send email: ${response.statusText}`);
      }

      onShowToast(`Email sent successfully to ${recipientList.length} recipient(s)!`, 'success');
      
      // Reset form after successful send
      setRecipients('');
      setPrompt('');
      setEmailBody('');
      setGeneratedEmail('');
      setShowEmailEditor(false);
    } catch (error) {
      console.error('Error sending email:', error);
      onShowToast('Failed to send email. Please try again.', 'error');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Recipients Input */}
      <div className="space-y-2">
        <label htmlFor="recipients" className="flex items-center gap-2 text-sm font-medium text-gray-700">
          <Users className="h-4 w-4" />
          Recipients
        </label>
        <input
          id="recipients"
          type="text"
          value={recipients}
          onChange={(e) => setRecipients(e.target.value)}
          placeholder="email1@example.com, email2@example.com"
          className="w-full px-4 py-3 rounded-lg border border-gray-200 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500"
          disabled={isSending}
        />
        <p className="text-xs text-gray-500">Enter comma-separated email addresses</p>
      </div>

      {/* Prompt Input */}
      <div className="space-y-2">
        <label htmlFor="prompt" className="flex items-center gap-2 text-sm font-medium text-gray-700">
          <Sparkles className="h-4 w-4" />
          Email Prompt
        </label>
        <textarea
          id="prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe the email you want to generate (e.g., 'Write a professional follow-up email for a job interview')"
          rows={4}
          className="w-full px-4 py-3 rounded-lg border border-gray-200 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500 resize-none"
          disabled={isGenerating || isSending}
        />
      </div>

      {/* Generate Email Button */}
      <motion.button
        onClick={handleGenerateEmail}
        disabled={isGenerating || isSending}
        className="w-full bg-gray-900 hover:bg-gray-800 disabled:bg-gray-400 text-white font-medium py-3 px-6 rounded-lg shadow-md transition-all duration-200 flex items-center justify-center gap-2"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Sparkles className="h-4 w-4" />
        {isGenerating ? 'Generating Email...' : 'Generate Email'}
      </motion.button>

      {/* Email Editor Section */}
      <AnimatePresence>
        {showEmailEditor && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-4 pt-6 border-t border-gray-100"
          >
            <div className="space-y-2">
              <label htmlFor="emailBody" className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <Mail className="h-4 w-4" />
                Generated Email (Editable)
              </label>
              <textarea
                id="emailBody"
                value={emailBody}
                onChange={(e) => setEmailBody(e.target.value)}
                placeholder="Your generated email will appear here..."
                rows={12}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500 resize-none font-mono text-sm"
                disabled={isSending}
              />
            </div>

            {/* Send Email Button */}
            <motion.button
              onClick={handleSendEmail}
              disabled={isSending || !emailBody.trim() || !recipients.trim()}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-3 px-6 rounded-lg shadow-md transition-all duration-200 flex items-center justify-center gap-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Send className="h-4 w-4" />
              {isSending ? 'Sending Email...' : 'Send Email'}
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EmailGenerator;