// EmailSettings.tsx
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Globe, Send, Loader2 } from "lucide-react";

interface EmailSettingsData {
  mailType: string;
  mailTitle: string;
  mailHost: string;
  mailPort: string;
  mailUsername: string;
  mailPassword: string;
  mailEncryption: string;
}

const EmailSettings: React.FC = () => {
  const [formData, setFormData] = useState<EmailSettingsData>({
    mailType: "smtp",
    mailTitle: "Live Doctor: Verify Your Account at Live Doctors",
    mailHost: "smtp.gmail.com",
    mailPort: "465",
    mailUsername: "",
    mailPassword: "",
    mailEncryption: "SSL",
  });

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [sendingTest, setSendingTest] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Load existing settings on component mount
  useEffect(() => {
    loadEmailSettings();
  }, []);

  const loadEmailSettings = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/settings/email_settings');
      if (response.ok) {
        const result = await response.json();
        console.log('Loaded email settings:', result.data[0]);
        if (result.success && result.data) {
          setFormData({
            mailType: result.data[0].mailType || "smtp",
            mailTitle: result.data[0].mailTitle || "",
            mailHost: result.data[0].mailHost || "",
            mailPort: result.data[0].mailPort?.toString() || "",
            mailUsername: result.data[0].mailUsername || "",
            mailPassword: result.data[0].mailUsername || "",
            mailEncryption: result.data[0].mailEncryption || "SSL",
          });
        }
      } else if (response.status === 404) {
        // No existing config found, use defaults
        console.log('No existing email configuration found, using defaults');
      } else {
        const errorResult = await response.json();
        setMessage({ 
          type: 'error', 
          text: errorResult.message || 'Failed to load email settings' 
        });
      }
    } catch (error) {
      console.error('Error loading email settings:', error);
      setMessage({ 
        type: 'error', 
        text: 'Network error occurred while loading settings' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof EmailSettingsData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear message when user starts typing
    if (message) setMessage(null);
  };

  const validateForm = (): string | null => {
    if (!formData.mailType.trim()) return "Mail Type is required";
    if (!formData.mailTitle.trim()) return "Mail Title is required";
    if (!formData.mailHost.trim()) return "Mail Host is required";
    if (!formData.mailPort.trim()) return "Mail Port is required";
    
    const portNumber = parseInt(formData.mailPort);
    if (isNaN(portNumber) || portNumber <= 0 || portNumber > 65535) {
      return "Mail Port must be a valid number between 1 and 65535";
    }
    
    if (formData.mailEncryption && !['SSL', 'TLS', 'STARTTLS', ''].includes(formData.mailEncryption)) {
      return "Mail Encryption must be SSL, TLS, STARTTLS, or None";
    }
    
    return null;
  };

  const handleSaveSettings = async () => {
    // Validate form before submitting
    const validationError = validateForm();
    if (validationError) {
      setMessage({ type: 'error', text: validationError });
      return;
    }

    setSaving(true);
    setMessage(null);

    try {
      const response = await fetch('/api/admin/settings/email_settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          mailPort: parseInt(formData.mailPort) // Convert to number for API
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setMessage({ type: 'success', text: result.message || 'Settings saved successfully' });
        // Clear password field after successful save
        setFormData(prev => ({ ...prev, mailPassword: "" }));
      } else {
        setMessage({ 
          type: 'error', 
          text: result.message || 'Failed to save settings' 
        });
      }
    } catch (error) {
      console.error('Error saving email settings:', error);
      setMessage({ 
        type: 'error', 
        text: 'Network error occurred while saving settings' 
      });
    } finally {
      setSaving(false);
    }
  };

  const handleSendTestMail = async () => {
    // Validate form before sending test
    const validationError = validateForm();
    if (validationError) {
      setMessage({ type: 'error', text: validationError });
      return;
    }

    if (!formData.mailUsername.trim()) {
      setMessage({ type: 'error', text: 'Mail Username is required for sending test email' });
      return;
    }

    if (!formData.mailPassword.trim()) {
      setMessage({ type: 'error', text: 'Mail Password is required for sending test email' });
      return;
    }

    setSendingTest(true);
    setMessage(null);

    try {
      const response = await fetch('/api/admin/settings/email_settings/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          mailPort: parseInt(formData.mailPort)
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setMessage({ 
          type: 'success', 
          text: result.message || 'Test email sent successfully' 
        });
      } else {
        setMessage({ 
          type: 'error', 
          text: result.message || 'Failed to send test email' 
        });
      }
    } catch (error) {
      console.error('Error sending test email:', error);
      setMessage({ 
        type: 'error', 
        text: 'Network error occurred while sending test email' 
      });
    } finally {
      setSendingTest(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-6 h-6 animate-spin mr-2" />
        <span>Loading email settings...</span>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Email Settings</h2>

      {message && (
        <div className={`border-l-4 rounded-lg p-4 mb-4 ${
          message.type === 'success' 
            ? 'border-green-500 bg-green-50 text-green-700' 
            : 'border-red-500 bg-red-50 text-red-700'
        }`}>
          {message.text}
        </div>
      )}

      <div className="border-l-4 border-blue-500 rounded-lg p-4 mb-4 bg-blue-50">
        <div className="flex items-center mb-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-5 h-5 mr-2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
          <span className="font-semibold">Common Email Provider Settings</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <h4 className="font-semibold text-blue-700 mb-1">Gmail SMTP</h4>
            <p>Host: smtp.gmail.com</p>
            <p>Port: 465 (SSL) / 587 (STARTTLS)</p>
          </div>
          
          <div>
            <h4 className="font-semibold text-blue-700 mb-1">Outlook/Hotmail SMTP</h4>
            <p>Host: smtp.live.com</p>
            <p>Port: 587 (STARTTLS)</p>
          </div>
          
          <div>
            <h4 className="font-semibold text-blue-700 mb-1">Yahoo SMTP</h4>
            <p>Host: smtp.mail.yahoo.com</p>
            <p>Port: 465 (SSL) / 587 (STARTTLS)</p>
          </div>
          
          <div>
            <h4 className="font-semibold text-blue-700 mb-1">Office 365 SMTP</h4>
            <p>Host: smtp.office365.com</p>
            <p>Port: 587 (STARTTLS)</p>
          </div>
        </div>
        
        <div className="flex items-center mt-3 pt-3 border-t border-blue-200">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-5 h-5 mr-2 text-blue-600"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="text-blue-600 text-sm">
            {`For Gmail: Enable 2FA and use App Passwords, or enable "Less secure app access"`}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block font-medium mb-1">
            Mail Type <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.mailType}
            onChange={(e) => handleInputChange('mailType', e.target.value)}
            className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={saving || sendingTest}
            required
          >
            <option value="smtp">SMTP (Simple Mail Transfer Protocol)</option>
            <option value="pop3">POP3 (Post Office Protocol 3)</option>
            <option value="imap">IMAP (Internet Message Access Protocol)</option>
          </select>
          <p className="text-xs text-gray-500 mt-1">
            SMTP for sending emails, POP3/IMAP for receiving emails
          </p>
        </div>

        <div>
          <label className="block font-medium mb-1">
            Mail Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.mailTitle}
            onChange={(e) => handleInputChange('mailTitle', e.target.value)}
            className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={saving || sendingTest}
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-1">
            Mail Host <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.mailHost}
            onChange={(e) => handleInputChange('mailHost', e.target.value)}
            className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={saving || sendingTest}
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-1">
            Mail Port <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            value={formData.mailPort}
            onChange={(e) => handleInputChange('mailPort', e.target.value)}
            className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={saving || sendingTest}
            min="1"
            max="65535"
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Mail Username</label>
          <input
            type="text"
            value={formData.mailUsername}
            onChange={(e) => handleInputChange('mailUsername', e.target.value)}
            className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={saving || sendingTest}
            placeholder="Your email address"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Mail Password</label>
          <input
            type="password"
            value={formData.mailPassword}
            onChange={(e) => handleInputChange('mailPassword', e.target.value)}
            className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={saving || sendingTest}
            placeholder="Enter password to update"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Mail Encryption</label>
          <select
            value={formData.mailEncryption}
            onChange={(e) => handleInputChange('mailEncryption', e.target.value)}
            className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={saving || sendingTest}
          >
            <option value="SSL">SSL (Secure Sockets Layer)</option>
            <option value="TLS">TLS (Transport Layer Security)</option>
          </select>
          <p className="text-xs text-gray-500 mt-1">
            <Globe className="inline-block w-4 h-4 mr-1" />
            SSL/TLS for port 465/993/995, STARTTLS for port 587/143/110, None for port 25
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-2">
        <Button 
          onClick={handleSendTestMail}
          className="flex items-center w-full sm:w-auto"
          disabled={sendingTest || saving}
          variant="outline"
        >
          {sendingTest ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Send className="w-4 h-4 mr-2" />
          )}
          {sendingTest ? 'Sending...' : 'Send Test Mail'}
        </Button>
        
        <Button 
          onClick={handleSaveSettings} 
          className="w-full sm:w-auto"
          disabled={saving || sendingTest}
        >
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            'Save My Changes'
          )}
        </Button>
      </div>
    </div>
  );
};

export default EmailSettings;