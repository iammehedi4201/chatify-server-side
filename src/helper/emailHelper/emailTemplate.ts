export const getVerificationEmailTemplate = (verificationUrl: string) => `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Verify Your Email</title>
  </head>
  <body style="margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;background-color:#f4f7fa;">
    <table role="presentation" style="width:100%;border-collapse:collapse;background-color:#f4f7fa;">
      <tr>
        <td align="center" style="padding:40px 20px;">
          <table role="presentation" style="width:100%;max-width:600px;border-collapse:collapse;background-color:#ffffff;border-radius:12px;box-shadow:0 4px 6px rgba(0,0,0,0.1);">
            <tr>
              <td style="padding:40px 40px 30px;text-align:center;background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);border-radius:12px 12px 0 0;">
                <div style="width:80px;height:80px;background-color:rgba(255,255,255,0.2);border-radius:50%;display:inline-flex;align-items:center;justify-content:center;backdrop-filter:blur(10px);">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 4H4C2.9 4 2.01 4.9 2.01 6L2 18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 8L12 13L4 8V6L12 11L20 6V8Z" fill="white"/>
                  </svg>
                </div>
              </td>
            </tr>
            <tr>
              <td style="padding:40px;">
                <h1 style="margin:0 0 16px;font-size:28px;font-weight:700;color:#1a1a1a;text-align:center;">Verify Your Email Address</h1>
                <p style="margin:0 0 24px;font-size:16px;line-height:1.6;color:#4a5568;text-align:center;">
                  Please confirm your email address to get started.
                </p>
                <table role="presentation" style="width:100%;margin:32px 0;">
                  <tr>
                    <td align="center">
                      <a href="${verificationUrl}" style="display:inline-block;padding:16px 48px;background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);color:#ffffff;text-decoration:none;border-radius:8px;font-size:16px;font-weight:600;box-shadow:0 4px 12px rgba(102,126,234,0.4);transition:transform 0.2s;">
                        Verify Email Address
                      </a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:0 40px 40px;">
                <div style="background-color:#fff5f5;border-left:4px solid #f56565;padding:16px;border-radius:6px;">
                  <p style="margin:0;font-size:14px;color:#742a2a;line-height:1.5;">
                    <strong>⏰ Important:</strong> This verification link will expire in <strong>1 hour</strong> for security reasons.
                  </p>
                </div>
              </td>
            </tr>
            <tr>
              <td style="padding:32px 40px;background-color:#f8fafc;border-radius:0 0 12px 12px;border-top:1px solid #e2e8f0;">
                <p style="margin:0;font-size:13px;color:#a0aec0;text-align:center;">
                  © 2024 Your Company. All rights reserved.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;

export const getOTPEmailTemplate = (
  otp: string,
  expiryMinutes: number = 10,
) => `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Your Verification Code</title>
  </head>
  <body
    style="margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;background-color:#f4f7fa;"
  >
    <table
      role="presentation"
      style="width:100%;border-collapse:collapse;background-color:#f4f7fa;"
    >
      <tr>
        <td align="center" style="padding:40px 20px;">
          <table
            role="presentation"
            style="width:100%;max-width:600px;border-collapse:collapse;background-color:#ffffff;border-radius:12px;box-shadow:0 4px 6px rgba(0,0,0,0.1);"
          >
            <!-- Header Section -->
            <tr>
              <td
                style="padding:40px 40px 30px;text-align:center;background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);border-radius:12px 12px 0 0;"
              >
                <div
                  style="width:80px;height:80px;background-color:rgba(255,255,255,0.2);border-radius:50%;display:inline-flex;align-items:center;justify-content:center;backdrop-filter:blur(10px);margin:0 auto;"
                >
                  <svg
                    width="40"
                    height="40"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 17C11.45 17 11 16.55 11 16V12C11 11.45 11.45 11 12 11C12.55 11 13 11.45 13 12V16C13 16.55 12.55 17 12 17ZM13 9H11V7H13V9Z"
                      fill="white"
                    />
                  </svg>
                </div>
              </td>
            </tr>

            <!-- Main Content -->
            <tr>
              <td style="padding:40px;">
                <h1
                  style="margin:0 0 16px;font-size:28px;font-weight:700;color:#1a1a1a;text-align:center;"
                >
                  Verification Code
                </h1>
                <p
                  style="margin:0 0 24px;font-size:16px;line-height:1.6;color:#4a5568;text-align:center;"
                >
                  Use the following code to complete your verification:
                </p>

                <!-- OTP Box -->
                <table role="presentation" style="width:100%;margin:0px 0;">
                  <tr>
                    <td align="center">
                      <div
                        style="display:inline-block;background:linear-gradient(135deg,#f7fafc 0%,#edf2f7 100%);border:2px dashed #cbd5e0;border-radius:12px;padding:24px 48px;"
                      >
                        <div
                          style="font-size:42px;font-weight:800;letter-spacing:8px;color:#667eea;font-family:'Courier New',monospace;text-align:center;"
                        >
                          ${otp}
                        </div>
                      </div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Warning Section -->
            <tr>
              <td style="padding:0 40px 40px;">
                <div
                  style="background-color:#fff5f5;border-left:4px solid #f56565;padding:16px;border-radius:6px;"
                >
                  <p
                    style="margin:0;font-size:14px;color:#742a2a;line-height:1.5;"
                  >
                    <strong>⏰ Important:</strong> This code will expire in
                    <strong>${expiryMinutes} minutes</strong> for security
                    reasons.
                  </p>
                </div>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td
                style="padding:32px 40px;background-color:#f8fafc;border-radius:0 0 12px 12px;border-top:1px solid #e2e8f0;"
              >
                <p
                  style="margin:0 0 8px;font-size:13px;color:#64748b;text-align:center;"
                >
                  Need help? Contact our support team
                </p>
                <p
                  style="margin:0;font-size:13px;color:#a0aec0;text-align:center;"
                >
                  © ${new Date().getFullYear()} Your Company. All rights
                  reserved.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`;

export const getPasswordResetEmailTemplate = (resetUrl: string) => `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Reset Your Password</title>
  </head>
  <body style="margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;background-color:#f4f7fa;">
    <table role="presentation" style="width:100%;border-collapse:collapse;background-color:#f4f7fa;">
      <tr>
        <td align="center" style="padding:40px 20px;">
          <table role="presentation" style="width:100%;max-width:600px;border-collapse:collapse;background-color:#ffffff;border-radius:12px;box-shadow:0 4px 6px rgba(0,0,0,0.1);">
            <tr>
              <td style="padding:40px 40px 30px;text-align:center;background:linear-gradient(135deg,#f56565 0%,#ed8936 100%);border-radius:12px 12px 0 0;">
                <div style="width:80px;height:80px;background-color:rgba(255,255,255,0.2);border-radius:50%;display:inline-flex;align-items:center;justify-content:center;backdrop-filter:blur(10px);">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18 8H17V6C17 3.24 14.76 1 12 1C9.24 1 7 3.24 7 6V8H6C4.9 8 4 8.9 4 10V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V10C20 8.9 19.1 8 18 8ZM12 17C10.9 17 10 16.1 10 15C10 13.9 10.9 13 12 13C13.1 13 14 13.9 14 15C14 16.1 13.1 17 12 17ZM15.1 8H8.9V6C8.9 4.29 10.29 2.9 12 2.9C13.71 2.9 15.1 4.29 15.1 6V8Z" fill="white"/>
                  </svg>
                </div>
              </td>
            </tr>
            <tr>
              <td style="padding:40px;">
                <h1 style="margin:0 0 16px;font-size:28px;font-weight:700;color:#1a1a1a;text-align:center;">Reset Your Password</h1>
                <p style="margin:0 0 24px;font-size:16px;line-height:1.6;color:#4a5568;text-align:center;">
                  We received a request to reset your password. Click the button below to create a new password.
                </p>
                <table role="presentation" style="width:100%;margin:32px 0;">
                  <tr>
                    <td align="center">
                      <a href="${resetUrl}" style="display:inline-block;padding:16px 48px;background:linear-gradient(135deg,#f56565 0%,#ed8936 100%);color:#ffffff;text-decoration:none;border-radius:8px;font-size:16px;font-weight:600;box-shadow:0 4px 12px rgba(245,101,101,0.4);transition:transform 0.2s;">
                        Reset Password
                      </a>
                    </td>
                  </tr>
                </table>
                <p style="margin:24px 0 0;font-size:14px;line-height:1.6;color:#718096;text-align:center;">
                  If you didn't request a password reset, you can safely ignore this email.
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding:0 40px 40px;">
                <div style="background-color:#fff5f5;border-left:4px solid #f56565;padding:16px;border-radius:6px;">
                  <p style="margin:0;font-size:14px;color:#742a2a;line-height:1.5;">
                    <strong>⏰ Important:</strong> This password reset link will expire in <strong>15 minutes</strong> for security reasons.
                  </p>
                </div>
              </td>
            </tr>
            <tr>
              <td style="padding:32px 40px;background-color:#f8fafc;border-radius:0 0 12px 12px;border-top:1px solid #e2e8f0;">
                <p style="margin:0;font-size:13px;color:#a0aec0;text-align:center;">
                  © ${new Date().getFullYear()} Your Company. All rights reserved.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
