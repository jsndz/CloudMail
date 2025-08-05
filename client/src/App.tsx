import React from 'react';
import { motion } from 'framer-motion';
import { Mail } from 'lucide-react';
import EmailGenerator from './components/EmailGenerator';
import Toast from './components/Toast';
import { useToast } from './hooks/useToast';

function App() {
  const { toasts, addToast, removeToast } = useToast();

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-2xl mx-auto p-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-2 bg-gray-100 rounded-lg">
              <Mail className="h-6 w-6 text-gray-700" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">CloudMail</h1>
          </div>
          <p className="text-gray-600 max-w-md mx-auto leading-relaxed">
            Generate professional emails with AI and send them to multiple recipients instantly.
          </p>
        </motion.div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white border border-gray-100 rounded-xl shadow-sm p-6"
        >
          <EmailGenerator onShowToast={addToast} />
        </motion.div>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center mt-8 text-sm text-gray-500"
        >
          Built with React, Tailwind CSS, and Framer Motion
        </motion.footer>
      </div>

      {/* Toast Notifications */}
      <Toast toasts={toasts} onRemove={removeToast} />
    </div>
  );
}

export default App;