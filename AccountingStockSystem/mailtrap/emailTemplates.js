export const VERIFICATION_EMAIL_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify Your Email</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(to right, #fe6c00, #bd5302); padding: 20px; text-align: center;">
    <h1 style="color: white; margin: 0;">Verify Your Email</h1>
  </div>
  <div style="background-color: #f9f9f9; padding: 20px; border-radius: 0 0 5px 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
    <p>Hello, {fullName},</p>
    <p>Thank you for signing up! Your verification code is:</p>
    <div style="text-align: center; margin: 30px 0;">
      <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #4CAF50;">{verificationCode}</span>
    </div>
    <p>Enter this code on the verification page to complete your registration.</p>
    <p>This code will expire in 15 minutes for security reasons.</p>
    <p>If you didn't create an account with us, please ignore this email.</p>
    <p>Best regards,<br>Your App Team</p>
  </div>
  <div style="text-align: center; margin-top: 20px; color: #888; font-size: 0.8em;">
    <p>This is an automated message, please do not reply to this email.</p>
  </div>
</body>
</html>
`;

export const WELCOME_EMAIL_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to Sokoto Guest Inn!</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(to right, #fe6c00, #bd5302); padding: 20px; text-align: center;">
    <h1 style="color: white; margin: 0;">Welcome to Sokoto Guest Inn!</h1>
  </div>
  <div style="background-color: #f9f9f9; padding: 20px; border-radius: 0 0 5px 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
    <p>Hello {userName},</p>
    <p>We're thrilled to welcome you to Sokoto Guest Inn! We're excited to have you join our community.</p>
    <p>Here are a few things you can do to get started:</p>
    <ul>
      <li>Complete your profile and tell us a bit more about yourself.</li>
      <li>Explore our features and discover what Sokoto Guest Inn has to offer.</li>
      <li>Check out our FAQs or contact support if you have any questions.</li>
    </ul>
    <p>We're constantly working to improve Sokoto Guest Inn and provide you with the best possible experience. Your feedback is valuable to us!</p>
    <p>Best regards,<br>The Sokoto Guest Inn Team</p>
  </div>
  <div style="text-align: center; margin-top: 20px; color: #888; font-size: 0.8em;">
    <p>This is an automated message, please do not reply to this email.</p>
  </div>
</body>
</html>
`;

export const PASSWORD_RESET_SUCCESS_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Password Reset Successful</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(to right, #fe6c00, #bd5302); padding: 20px; text-align: center;">
    <h1 style="color: white; margin: 0;">Password Reset Successful</h1>
  </div>
  <div style="background-color: #f9f9f9; padding: 20px; border-radius: 0 0 5px 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
    <p>Hello,</p>
    <p>We're writing to confirm that your password has been successfully reset.</p>
    <div style="text-align: center; margin: 30px 0;">
      <div style="background-color: #4CAF50; color: white; width: 50px; height: 50px; line-height: 50px; border-radius: 50%; display: inline-block; font-size: 30px;">
        ✓
      </div>
    </div>
    <p>If you did not initiate this password reset, please contact our support team immediately.</p>
    <p>For security reasons, we recommend that you:</p>
    <ul>
      <li>Use a strong, unique password</li>
      <li>Enable two-factor authentication if available</li>
      <li>Avoid using the same password across multiple sites</li>
    </ul>
    <p>Thank you for helping us keep your account secure.</p>
    <p>Best regards,<br>Your App Team</p>
  </div>
  <div style="text-align: center; margin-top: 20px; color: #888; font-size: 0.8em;">
    <p>This is an automated message, please do not reply to this email.</p>
  </div>
</body>
</html>
`;

export const PASSWORD_RESET_REQUEST_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Your Password</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(to right, #fe6c00, #bd5302); padding: 20px; text-align: center;">
    <h1 style="color: white; margin: 0;">Password Reset</h1>
  </div>
  <div style="background-color: #f9f9f9; padding: 20px; border-radius: 0 0 5px 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
    <p>Hello,</p>
    <p>We received a request to reset your password. If you didn't make this request, please ignore this email.</p>
    <p>To reset your password, click the button below:</p>
    <div style="text-align: center; margin: 30px 0;">
      <a href="{resetURL}" style="background-color: #4CAF50; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Reset Password</a>
    </div>
    <p>This link will expire in 1 hour for security reasons.</p>
    <p>Best regards,<br>Your App Team</p>
  </div>
  <div style="text-align: center; margin-top: 20px; color: #888; font-size: 0.8em;">
    <p>This is an automated message, please do not reply to this email.</p>
  </div>
</body>
</html>
`;

export const PASSWORD_CHANGED_NOTIFICATION_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Password Changed Successfully</title>
  <style>
    /* Inline CSS for better email client compatibility */
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      background-color: #f4f4f4;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 20px auto;
      background-color: #fff;
      border-radius: 5px;
      box-shadow: 0 2px 5px rgba(0,0,0,0.1);
      overflow: hidden; /* For rounded corners on header */
    }
    .header {
       background: linear-gradient(to right, #fe6c00, #bd5302);
      padding: 20px;
      text-align: center;
    }
    .header h1 {
      color: white;
      margin: 0;
      font-size: 24px;
    }
    .content {
      padding: 20px;
    }
    .check-icon {
       background-color: #4CAF50;
      color: white;
      width: 60px; /* Slightly larger */
      height: 60px;
      line-height: 60px;
      border-radius: 50%;
      display: inline-block;
      font-size: 36px; /* Larger checkmark */
      text-align: center;
    }
    .footer {
      text-align: center;
      margin-top: 20px;
      color: #888;
      font-size: 0.8em;
      padding: 10px;
      background-color: #f0f0f0;
    }
    a {
        color: #4CAF50;
        text-decoration: none;
    }
     ul {
        list-style: disc; /* Use standard bullet points */
        margin-left: 20px; /* Indent the list */
        padding-left: 0; /* Remove default padding */
    }

    li {
        margin-bottom: 5px; /* Add some spacing between list items */
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Password Changed Successfully</h1>
    </div>
    <div class="content">
      <p>Hello {userName},</p>
      <p>This email confirms that your password for <strong>[Your App Name]</strong> has been changed.</p>
      <div style="text-align: center; margin: 30px 0;">
        <div class="check-icon">✓</div>
      </div>
      <p>If you did <strong>not</strong> change your password, please <a href="{contactURL}">contact support immediately</a>.  This could indicate unauthorized access to your account.</p>

      <p>Here are some tips to keep your account secure:</p>
        <ul>
            <li>Use a strong, unique password that is difficult to guess.</li>
            <li>Do not use the same password for multiple accounts.</li>
            <li>Consider enabling two-factor authentication for added security (if available).</li>
            <li>Be cautious of phishing emails and never share your password with anyone.</li>
        </ul>

      <p>Best regards,<br>The [Your App Name] Team</p>
    </div>
    <div class="footer">
      <p>This is an automated message. Please do not reply to this email.</p>
    </div>
  </div>
</body>
</html>
`;

export const FORGOT_PASSWORD_HTML_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Password Reset Request</title>
</head>
<body style="font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
    <tr>
      <td style="padding: 20px; text-align: center; background-color: #fe6c00; color: #ffffff; border-top-left-radius: 8px; border-top-right-radius: 8px;">
        <h1 style="margin: 0; font-size: 24px;">Sokoto Guest Inn</h1>
      </td>
    </tr>
    <tr>
      <td style="padding: 30px; text-align: center;">
        <h2 style="font-size: 20px; color: #333333; margin-top: 0;">Reset Your Password</h2>
        <p style="font-size: 16px; color: #666666; line-height: 1.5;">Hello {userName},</p>
        <p style="font-size: 16px; color: #666666; line-height: 1.5;">We received a request to reset your password. Click the button below to proceed:</p>
        <div style="margin: 20px 0;">
          <a href="{resetUrl}" style="display: inline-block; padding: 15px 25px; font-size: 18px; color: #ffffff; background-color: #fe6c00; border-radius: 5px; text-decoration: none;">Reset Your Password</a>
        </div>
        <p style="font-size: 14px; color: #999999; line-height: 1.5;">This link expires in 15 minutes. If you didn’t request this, please ignore this email or contact us at <a href="{contactURL}" style="color: #fe6c00; text-decoration: none;">support</a>.</p>
      </td>
    </tr>
    <tr>
      <td style="padding: 20px; text-align: center; background-color: #f9f9f9; border-bottom-left-radius: 8px; border-bottom-right-radius: 8px;">
        <p style="font-size: 12px; color: #999999; margin: 0;">© 2025 Justhitclick-Digital Technologies Ltd. All rights reserved.</p>
      </td>
    </tr>
  </table>
</body>
</html>
`;
