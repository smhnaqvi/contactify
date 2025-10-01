# Contactify 📧

A lightweight backend service that powers "Contact Us" forms for any website or application. Contactify provides a simple API endpoint where users can submit their details and messages, and automatically forwards them to a configured email inbox.

**Created by:** Syed Mohammad Hussain Naqvi  
**Contact:** smhnaqvi111@gmail.com

## ✨ Features

- **📩 Form to Inbox** – Accepts form submissions and sends them directly to your email
- **🔒 Secure & Reliable** – Handles input validation and email delivery safely
- **⚡ Lightweight & Fast** – Minimal setup, quick integration with any frontend
- **⚙️ Configurable** – Set your destination mailbox easily via environment variables
- **🌍 Framework-Agnostic** – Works with any frontend (React, Next.js, Vue, plain HTML, etc.)

## 🚀 Use Cases

- Website Contact Us pages
- Feedback or inquiry forms
- Landing pages needing quick lead collection
- SaaS apps needing a simple support form

## 🔧 How it Works

1. Frontend form submits user data (name, email, message, etc.) to Contactify API
2. Backend processes the request and validates input
3. Email is sent to the configured recipient inbox

## 📋 Requirements

- Node.js (v14 or higher)
- npm or yarn
- SMTP email service (Gmail, SendGrid, etc.)

## 🛠️ Installation

```bash
# Clone the repository
git clone https://github.com/smhnaqvi/contactify.git
cd contactify

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Configure your email settings in .env
```

## ⚙️ Configuration

Create a `.env` file in the root directory with the following variables:

```env
# Email Configuration
SMTP_HOST=your-smtp-host
SMTP_PORT=587
SMTP_USER=your-email@example.com
SMTP_PASS=your-email-password
RECIPIENT_EMAIL=contact@yourdomain.com

# Server Configuration
PORT=3000
NODE_ENV=production
```

## 🚀 Usage

### Starting the Server

```bash
# Development
npm run dev

# Production
npm start
```

### API Endpoint

**POST** `/api/contact`

Send contact form data to this endpoint:

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "subject": "Inquiry about your services",
  "message": "Hello, I'm interested in learning more about..."
}
```

### Frontend Integration

#### JavaScript/React Example

```javascript
const handleSubmit = async (formData) => {
  try {
    const response = await fetch('https://your-contactify-api.com/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData)
    });
    
    if (response.ok) {
      alert('Message sent successfully!');
    } else {
      alert('Failed to send message. Please try again.');
    }
  } catch (error) {
    console.error('Error:', error);
  }
};
```

#### HTML Form Example

```html
<form id="contact-form">
  <input type="text" name="name" placeholder="Your Name" required>
  <input type="email" name="email" placeholder="Your Email" required>
  <input type="text" name="subject" placeholder="Subject" required>
  <textarea name="message" placeholder="Your Message" required></textarea>
  <button type="submit">Send Message</button>
</form>

<script>
document.getElementById('contact-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const data = Object.fromEntries(formData);
  
  try {
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    
    if (response.ok) {
      alert('Message sent successfully!');
      e.target.reset();
    }
  } catch (error) {
    alert('Error sending message');
  }
});
</script>
```

## 📝 API Response

### Success Response (200)
```json
{
  "success": true,
  "message": "Email sent successfully"
}
```

### Error Response (400/500)
```json
{
  "success": false,
  "error": "Validation error or server error message"
}
```

## 🔒 Security Features

- Input validation and sanitization
- Rate limiting to prevent spam
- CORS configuration
- Environment variable protection

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

## 📦 Deployment

### Docker

```bash
# Build image
docker build -t contactify .

# Run container
docker run -p 3000:3000 --env-file .env contactify
```

### Environment Variables for Production

Make sure to set the following environment variables in your production environment:

- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_USER`
- `SMTP_PASS`
- `RECIPIENT_EMAIL`
- `PORT`
- `NODE_ENV=production`

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 👨‍💻 Author

**Syed Mohammad Hussain Naqvi**  
Email: smhnaqvi111@gmail.com  
GitHub: [@smhnaqvi](https://github.com/smhnaqvi)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you have any questions or need help, please:

1. Check the [Issues](https://github.com/smhnaqvi/contactify/issues) page
2. Create a new issue if your problem isn't already reported
3. Contact us at smhnaqvi111@gmail.com

## 🙏 Acknowledgments

- Built with Node.js and Express
- Email delivery powered by Nodemailer
- Input validation with Joi
- Rate limiting with express-rate-limit

---

Made with ❤️ for developers who need simple, reliable contact forms.
