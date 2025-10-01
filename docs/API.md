# Contactify API Documentation

## Overview

Contactify is a lightweight backend service that powers "Contact Us" forms for any website or application. It provides a simple API endpoint where users can submit their details and messages, and automatically forwards them to a configured email inbox.

## Base URL

```
http://localhost:3000
```

## Authentication

Currently, no authentication is required for the contact form submission. Admin endpoints (submissions) are not protected in this basic implementation but should be secured in production.

## Endpoints

### 1. Submit Contact Form

**POST** `/api/contact`

Submit a contact form with user details and message.

#### Request Body

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "subject": "Inquiry about your services",
  "message": "Hello, I'm interested in learning more about your services...",
  "phone": "+1234567890",     // Optional
  "company": "Acme Corp"      // Optional
}
```

#### Validation Rules

- `name`: Required, 2-100 characters
- `email`: Required, valid email format, max 255 characters
- `subject`: Required, 5-200 characters
- `message`: Required, 10-2000 characters
- `phone`: Optional, valid phone number format
- `company`: Optional, max 100 characters

#### Success Response (200)

```json
{
  "success": true,
  "message": "Email sent successfully",
  "submissionId": "1703123456789"
}
```

#### Error Response (400)

```json
{
  "success": false,
  "error": "Validation failed",
  "details": [
    "Name must be at least 2 characters long",
    "Please provide a valid email address"
  ]
}
```

### 2. Health Check

**GET** `/api/contact/health`

Check the health status of the service and its dependencies.

#### Success Response (200)

```json
{
  "success": true,
  "message": "Service is healthy",
  "timestamp": "2023-12-21T10:30:00.000Z",
  "services": {
    "email": "connected"
  }
}
```

### 3. Get All Submissions (Admin)

**GET** `/api/contact/submissions`

Retrieve all contact form submissions. This endpoint should be protected in production.

#### Success Response (200)

```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "id": "1703123456789",
      "name": "John Doe",
      "email": "john@example.com",
      "subject": "Inquiry about services",
      "message": "Hello...",
      "phone": "+1234567890",
      "company": "Acme Corp",
      "createdAt": "2023-12-21T10:30:00.000Z",
      "status": "sent"
    }
  ]
}
```

### 4. Get Submission by ID (Admin)

**GET** `/api/contact/submissions/:id`

Retrieve a specific contact form submission by ID.

#### Success Response (200)

```json
{
  "success": true,
  "data": {
    "id": "1703123456789",
    "name": "John Doe",
    "email": "john@example.com",
    "subject": "Inquiry about services",
    "message": "Hello...",
    "phone": "+1234567890",
    "company": "Acme Corp",
    "createdAt": "2023-12-21T10:30:00.000Z",
    "status": "sent"
  }
}
```

#### Error Response (404)

```json
{
  "success": false,
  "error": "Submission not found"
}
```

### 5. API Information

**GET** `/api`

Get general information about the API.

#### Success Response (200)

```json
{
  "success": true,
  "message": "Contactify API",
  "version": "1.0.0",
  "description": "A lightweight backend service for contact forms",
  "endpoints": {
    "POST /api/contact": "Submit contact form",
    "GET /api/contact/health": "Health check",
    "GET /api/contact/submissions": "Get all submissions (admin)",
    "GET /api/contact/submissions/:id": "Get submission by ID (admin)"
  }
}
```

## Error Handling

All endpoints return consistent error responses:

```json
{
  "success": false,
  "error": "Error message description"
}
```

Common HTTP status codes:
- `200`: Success
- `400`: Bad Request (validation errors)
- `404`: Not Found
- `429`: Too Many Requests (rate limit exceeded)
- `500`: Internal Server Error

## Rate Limiting

The API implements rate limiting to prevent spam:
- Default: 100 requests per 15 minutes per IP address
- Configurable via environment variables

## CORS

CORS is configured to allow cross-origin requests. The allowed origins can be configured via the `CORS_ORIGIN` environment variable.

## Frontend Integration Examples

### JavaScript/React

```javascript
const handleSubmit = async (formData) => {
  try {
    const response = await fetch('http://localhost:3000/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData)
    });
    
    const result = await response.json();
    
    if (result.success) {
      alert('Message sent successfully!');
    } else {
      alert('Failed to send message: ' + result.error);
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Network error. Please try again.');
  }
};
```

### HTML Form

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
    
    const result = await response.json();
    
    if (result.success) {
      alert('Message sent successfully!');
      e.target.reset();
    } else {
      alert('Failed to send message: ' + result.error);
    }
  } catch (error) {
    alert('Error sending message');
  }
});
</script>
```
