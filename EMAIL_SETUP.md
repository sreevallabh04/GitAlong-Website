# Email Setup Guide for GitAlong

This guide will help you set up EmailJS to send welcome emails to new users when they sign up.

## Prerequisites

1. An EmailJS account (free tier available)
2. A Gmail account or other email service
3. Basic knowledge of HTML/CSS for email templates

## Step 1: Create EmailJS Account

1. Go to [EmailJS.com](https://www.emailjs.com/) and sign up for a free account
2. Verify your email address

## Step 2: Add Email Service

1. In your EmailJS dashboard, go to "Email Services"
2. Click "Add New Service"
3. Choose your email provider (Gmail recommended for testing)
4. Follow the authentication steps
5. Note down your **Service ID** (e.g., `service_abc123`)

## Step 3: Create Email Template

1. Go to "Email Templates" in your EmailJS dashboard
2. Click "Create New Template"
3. Use the following template:

### Template Variables
- `to_email` - User's email address
- `to_name` - User's display name
- `github_username` - User's GitHub username
- `signup_date` - Date of signup
- `app_name` - "GitAlong"
- `app_url` - "https://gitalong.vercel.app"
- `support_email` - "support@gitalong.com"

### HTML Template
```html
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
            <p>Hi {{to_name}},</p>
            
            <p>Welcome to GitAlong! We're excited to have you join our community of developers who are building amazing projects together.</p>
            
            <p>You've successfully signed up with:</p>
            <ul>
                <li><strong>Email:</strong> {{to_email}}</li>
                <li><strong>GitHub:</strong> @{{github_username}}</li>
                <li><strong>Signup Date:</strong> {{signup_date}}</li>
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
                <a href="{{app_url}}" class="cta-button">Get Started with GitAlong</a>
            </div>
            
            <p>If you have any questions or need help getting started, feel free to reach out to our support team.</p>
        </div>
        
        <div class="footer">
            <p>Best regards,<br>The GitAlong Team</p>
            
            <div class="social-links">
                <a href="https://github.com/gitalong">GitHub</a> |
                <a href="https://twitter.com/gitalong">Twitter</a> |
                <a href="mailto:{{support_email}}">Support</a>
            </div>
            
            <p>© 2024 GitAlong. All rights reserved.</p>
            <p>You received this email because you signed up for GitAlong. If you didn't sign up, please ignore this email.</p>
        </div>
    </div>
</body>
</html>
```

4. Save the template and note down your **Template ID** (e.g., `template_xyz789`)

## Step 4: Get Public Key

1. Go to "Account" → "API Keys" in your EmailJS dashboard
2. Copy your **Public Key** (e.g., `user_def456`)

## Step 5: Update Configuration

1. Open `src/utils/emailService.ts`
2. Replace the placeholder values with your actual IDs:

```typescript
const EMAILJS_SERVICE_ID = 'your_service_id_here';
const EMAILJS_TEMPLATE_ID = 'your_template_id_here';
const EMAILJS_PUBLIC_KEY = 'your_public_key_here';
```

## Step 6: Test the Setup

1. Build and run your application
2. Sign up with a new GitHub account
3. Check the console for email sending logs
4. Check the email inbox for the welcome email

## Troubleshooting

### Email Not Sending
- Check browser console for errors
- Verify all IDs are correct
- Ensure EmailJS service is properly configured
- Check email service authentication

### Template Variables Not Working
- Make sure variable names match exactly
- Use double curly braces: `{{variable_name}}`
- Test template in EmailJS dashboard first

### Rate Limiting
- Free EmailJS accounts have limits
- Consider upgrading for production use
- Implement fallback email service

## Alternative Email Services

If you prefer not to use EmailJS, you can:

1. **Backend API**: Create a backend endpoint to send emails
2. **SendGrid**: Use SendGrid's API directly
3. **AWS SES**: Use Amazon Simple Email Service
4. **Firebase Functions**: Create a Cloud Function to send emails

## Security Notes

- Never expose private keys in client-side code
- Use environment variables for sensitive data
- Consider implementing rate limiting
- Validate email addresses before sending

## Production Considerations

1. **Email Service**: Use a reliable email service (SendGrid, AWS SES, etc.)
2. **Template Management**: Store email templates in a CMS
3. **Analytics**: Track email open rates and click-through rates
4. **Unsubscribe**: Include unsubscribe links in emails
5. **Compliance**: Ensure compliance with email regulations (CAN-SPAM, GDPR)
