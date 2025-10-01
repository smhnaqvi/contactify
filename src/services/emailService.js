/**
 * Email service using Nodemailer
 */

const nodemailer = require('nodemailer');
const config = require('../config');
const logger = require('../utils/logger');

class EmailService {
  constructor() {
    this.transporter = null;
    this.initializeTransporter();
  }

  initializeTransporter() {
    try {
      this.transporter = nodemailer.createTransporter(config.email.smtp);
      logger.info('Email transporter initialized successfully');
    } catch (error) {
      logger.error('Failed to initialize email transporter', { error: error.message });
      throw error;
    }
  }

  async verifyConnection() {
    try {
      await this.transporter.verify();
      logger.info('Email connection verified successfully');
      return true;
    } catch (error) {
      logger.error('Email connection verification failed', { error: error.message });
      return false;
    }
  }

  async sendContactEmail(contactData) {
    const { name, email, subject, message, phone, company } = contactData;

    const mailOptions = {
      from: `"${name}" <${config.email.smtp.auth.user}>`,
      to: config.email.recipient,
      replyTo: email,
      subject: `Contact Form: ${subject}`,
      html: this.generateEmailTemplate(contactData),
      text: this.generateTextTemplate(contactData)
    };

    try {
      const result = await this.transporter.sendMail(mailOptions);
      logger.info('Contact email sent successfully', { 
        messageId: result.messageId,
        to: config.email.recipient,
        from: email
      });
      return result;
    } catch (error) {
      logger.error('Failed to send contact email', { 
        error: error.message,
        to: config.email.recipient,
        from: email
      });
      throw error;
    }
  }

  generateEmailTemplate(data) {
    const { name, email, subject, message, phone, company } = data;
    
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>New Contact Form Submission</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #f4f4f4; padding: 20px; border-radius: 5px; margin-bottom: 20px; }
            .field { margin-bottom: 15px; }
            .label { font-weight: bold; color: #555; }
            .value { margin-top: 5px; padding: 10px; background-color: #f9f9f9; border-radius: 3px; }
            .message { white-space: pre-wrap; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>📧 New Contact Form Submission</h2>
              <p>You have received a new message through your contact form.</p>
            </div>
            
            <div class="field">
              <div class="label">Name:</div>
              <div class="value">${name}</div>
            </div>
            
            <div class="field">
              <div class="label">Email:</div>
              <div class="value"><a href="mailto:${email}">${email}</a></div>
            </div>
            
            ${company ? `
            <div class="field">
              <div class="label">Company:</div>
              <div class="value">${company}</div>
            </div>
            ` : ''}
            
            ${phone ? `
            <div class="field">
              <div class="label">Phone:</div>
              <div class="value">${phone}</div>
            </div>
            ` : ''}
            
            <div class="field">
              <div class="label">Subject:</div>
              <div class="value">${subject}</div>
            </div>
            
            <div class="field">
              <div class="label">Message:</div>
              <div class="value message">${message}</div>
            </div>
            
            <hr style="margin: 30px 0;">
            <p style="color: #666; font-size: 12px;">
              This email was sent from your contact form at ${new Date().toLocaleString()}.
            </p>
          </div>
        </body>
      </html>
    `;
  }

  generateTextTemplate(data) {
    const { name, email, subject, message, phone, company } = data;
    
    let text = `New Contact Form Submission\n\n`;
    text += `Name: ${name}\n`;
    text += `Email: ${email}\n`;
    if (company) text += `Company: ${company}\n`;
    if (phone) text += `Phone: ${phone}\n`;
    text += `Subject: ${subject}\n\n`;
    text += `Message:\n${message}\n\n`;
    text += `---\n`;
    text += `Sent from your contact form at ${new Date().toLocaleString()}`;
    
    return text;
  }
}

module.exports = new EmailService();
