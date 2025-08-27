import emailjs from '@emailjs/browser';

// EmailJS configuration
// You'll need to set up EmailJS account and get these IDs
const EMAILJS_SERVICE_ID = 'service_6jd7b3r'; // EmailJS service ID
const EMAILJS_TEMPLATE_ID = 'template_p6jxp6p'; // EmailJS template ID
const EMAILJS_PUBLIC_KEY = 'BUZkR4JL7p4TqI0pC'; // EmailJS public key

export interface WelcomeEmailData {
  user_name: string;
  user_email: string;
  github_username?: string;
  signup_date: string;
}

export const sendWelcomeEmail = async (emailData: WelcomeEmailData): Promise<boolean> => {
  try {
    // Initialize EmailJS
    emailjs.init(EMAILJS_PUBLIC_KEY);

    // Send the email
    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      {
        to_email: emailData.user_email,
        to_name: emailData.user_name,
        github_username: emailData.github_username || 'N/A',
        signup_date: emailData.signup_date,
        app_name: 'GitAlong',
        app_url: 'https://gitalong.vercel.app',
        support_email: 'support@gitalong.com'
      }
    );

    console.log('Welcome email sent successfully:', response);
    return true;
  } catch (error) {
    console.error('Failed to send welcome email:', error);
    return false;
  }
};

// Fallback email function using a simple HTML template
export const sendWelcomeEmailFallback = async (emailData: WelcomeEmailData): Promise<boolean> => {
  try {
    // This is a fallback that would typically be handled by a backend service
    // For now, we'll just log the email data
    console.log('Welcome email data (fallback):', {
      to: emailData.user_email,
      subject: 'Welcome to GitAlong! 🚀',
      template: 'welcome-email',
      data: emailData
    });

    // In a real implementation, you would send this to your backend
    // which would then send the actual email using a service like SendGrid, AWS SES, etc.
    
    return true;
  } catch (error) {
    console.error('Failed to send welcome email (fallback):', error);
    return false;
  }
};

// HTML template for the welcome email (for reference)
export const getWelcomeEmailTemplate = (data: WelcomeEmailData): string => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to GitAlong!</title>
        <style>
            body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #f8f9fa;
            }
            .container {
                background-color: #ffffff;
                border-radius: 12px;
                padding: 40px;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }
            .header {
                text-align: center;
                margin-bottom: 30px;
            }
            .logo {
                font-size: 32px;
                font-weight: bold;
                color: #2EA043;
                margin-bottom: 10px;
            }
            .welcome-text {
                font-size: 24px;
                color: #333;
                margin-bottom: 20px;
            }
            .content {
                margin-bottom: 30px;
            }
            .feature-list {
                background-color: #f8f9fa;
                border-radius: 8px;
                padding: 20px;
                margin: 20px 0;
            }
            .feature-item {
                margin: 10px 0;
                padding-left: 20px;
                position: relative;
            }
            .feature-item:before {
                content: "✓";
                position: absolute;
                left: 0;
                color: #2EA043;
                font-weight: bold;
            }
            .cta-button {
                display: inline-block;
                background-color: #2EA043;
                color: white;
                padding: 12px 24px;
                text-decoration: none;
                border-radius: 8px;
                font-weight: 600;
                margin: 20px 0;
            }
            .footer {
                text-align: center;
                margin-top: 40px;
                padding-top: 20px;
                border-top: 1px solid #e9ecef;
                color: #6c757d;
                font-size: 14px;
            }
            .social-links {
                margin: 20px 0;
            }
            .social-links a {
                color: #2EA043;
                text-decoration: none;
                margin: 0 10px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="logo">GitAlong</div>
                <div class="welcome-text">Welcome aboard! 🚀</div>
            </div>
            
            <div class="content">
                <p>Hi ${data.user_name},</p>
                
                <p>Welcome to GitAlong! We're excited to have you join our community of developers who are building amazing projects together.</p>
                
                <p>You've successfully signed up with:</p>
                <ul>
                    <li><strong>Email:</strong> ${data.user_email}</li>
                    ${data.github_username ? `<li><strong>GitHub:</strong> @${data.github_username}</li>` : ''}
                    <li><strong>Signup Date:</strong> ${data.signup_date}</li>
                </ul>
                
                <div class="feature-list">
                    <h3>What you can do with GitAlong:</h3>
                    <div class="feature-item">Find coding partners for your projects</div>
                    <div class="feature-item">Connect with developers worldwide</div>
                    <div class="feature-item">Share your GitHub repositories</div>
                    <div class="feature-item">Build amazing projects together</div>
                    <div class="feature-item">Join a community of passionate developers</div>
                </div>
                
                <p>Ready to start coding together? Click the button below to explore GitAlong:</p>
                
                <div style="text-align: center;">
                    <a href="https://gitalong.vercel.app" class="cta-button">Get Started with GitAlong</a>
                </div>
                
                <p>If you have any questions or need help getting started, feel free to reach out to our support team.</p>
            </div>
            
            <div class="footer">
                <p>Best regards,<br>The GitAlong Team</p>
                
                <div class="social-links">
                    <a href="https://github.com/gitalong">GitHub</a> |
                    <a href="https://twitter.com/gitalong">Twitter</a> |
                    <a href="mailto:support@gitalong.com">Support</a>
                </div>
                
                <p>© 2024 GitAlong. All rights reserved.</p>
                <p>You received this email because you signed up for GitAlong. If you didn't sign up, please ignore this email.</p>
            </div>
        </div>
    </body>
    </html>
  `;
};
