import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: NextRequest) {
  try {
    const { to, organizationName, inviteUrl, role } = await request.json();

    console.log('📧 Attempting to send invitation email to:', to);

    // Validate required environment variables
    if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASSWORD) {
      throw new Error('SMTP configuration is missing. Check your environment variables.');
    }

    console.log('🔧 SMTP Configuration:');
    console.log('SMTP_HOST:', process.env.SMTP_HOST);
    console.log('SMTP_PORT:', process.env.SMTP_PORT);
    console.log('SMTP_USER:', process.env.SMTP_USER);
    console.log('SMTP_PASSWORD:', process.env.SMTP_PASSWORD ? '***SET***' : 'MISSING');

    // Try port 465 with SSL first (more likely to work with firewalls)
    const usePort465 = process.env.SMTP_PORT === '465';
    
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '465'),
      secure: usePort465, // true for 465, false for 587
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false, // Less strict for testing
      },
      // Add connection timeout settings
      connectionTimeout: 15000, // 15 seconds
      greetingTimeout: 15000,
      socketTimeout: 15000,
      // Enable debug output
      debug: true,
      logger: true
    });

    // Verify transporter configuration
    console.log('🔧 Verifying SMTP connection...');
    try {
      await transporter.verify();
      console.log('✅ SMTP connection verified successfully');
    } catch (verifyError: any) {
      console.error('❌ SMTP connection failed:', verifyError);
      console.error('Error code:', verifyError.code);
      console.error('Error message:', verifyError.message);
      
      // More specific error messages
      if (verifyError.code === 'EAUTH') {
        throw new Error('Gmail authentication failed. Please check your email and app password.');
      } else if (verifyError.code === 'ECONNECTION' || verifyError.code === 'ETIMEDOUT') {
        throw new Error('Cannot connect to Gmail SMTP server. Check your internet connection or firewall settings.');
      } else if (verifyError.message?.includes('Connection closed')) {
        throw new Error('SMTP connection closed unexpectedly. This may be due to firewall/antivirus blocking. Try disabling temporarily.');
      } else {
        throw new Error(`SMTP connection failed: ${verifyError.message}`);
      }
    }

    const fromEmail = process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER;
    const fromName = process.env.SMTP_FROM_NAME || 'Trello Clone';

    const mailOptions = {
      from: `"${fromName}" <${fromEmail}>`,
      to: to,
      subject: `You're invited to join ${organizationName} on Trello Clone`,
      html: generateInvitationEmail(to, organizationName, inviteUrl, role),
    };

    console.log('📤 Sending email via SMTP...');
    
    // Send email
    const result = await transporter.sendMail(mailOptions);
    
    console.log('✅ Email sent successfully:', result.messageId);
    console.log('📨 Response:', result.response);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Invitation sent successfully!',
      messageId: result.messageId
    });

  } catch (error: any) {
    console.error('❌ Error sending email:', error);
    console.error('Full error details:', JSON.stringify(error, null, 2));
    
    // Provide helpful error messages
    let errorMessage = 'Failed to send email: ' + error.message;
    
    if (error.message.includes('Invalid login') || error.message.includes('Authentication failed') || error.message.includes('EAUTH')) {
      errorMessage = 'Gmail authentication failed. Please check:\n1. Your Gmail address is correct\n2. You\'re using an App Password (not your regular password)\n3. 2-Factor Authentication is enabled';
    } else if (error.message.includes('Connection closed') || error.message.includes('ECONNECTION') || error.message.includes('ETIMEDOUT')) {
      errorMessage = 'Cannot connect to Gmail SMTP server. Please check:\n1. Your internet connection\n2. Firewall or antivirus blocking port 587\n3. Try using port 465 with secure: true\n4. Check if your ISP blocks SMTP';
    } else if (error.message.includes('recipients')) {
      errorMessage = 'Invalid email address. Please check the recipient email.';
    }
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

function generateInvitationEmail(
  email: string,
  organizationName: string,
  inviteLink: string,
  role: string
): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Join ${organizationName} on Trello Clone</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
    <h1 style="color: white; margin: 0;">🎉 You're Invited!</h1>
  </div>
  
  <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
    <p style="font-size: 16px;">Hello,</p>
    
    <p style="font-size: 16px;">
      You've been invited to join <strong>${organizationName}</strong> on Trello Clone as a <strong>${role}</strong>.
    </p>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="${inviteLink}" 
         style="background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
        Accept Invitation
      </a>
    </div>
    
    <p style="font-size: 14px; color: #666;">
      Or copy and paste this link into your browser:<br>
      <code style="background: #e0e0e0; padding: 8px; border-radius: 4px; display: inline-block; margin-top: 8px; word-break: break-all;">${inviteLink}</code>
    </p>
    
    <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
    
    <p style="font-size: 12px; color: #999; text-align: center;">
      This invitation will expire in 7 days.<br>
      If you didn't expect this invitation, you can safely ignore this email.
    </p>
  </div>
</body>
</html>
  `;
}