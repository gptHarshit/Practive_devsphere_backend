const { SendEmailCommand } = require("@aws-sdk/client-ses");
const { sesClient } = require("./sesClient.js");

const createSendEmailCommand = (toAddress, fromAddress, subject, htmlBody, textBody) => {
  return new SendEmailCommand({
    Destination: {
      ToAddresses: [toAddress],
    }, 
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: htmlBody,
        },
        Text: {
          Charset: "UTF-8",
          Data: textBody,
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: subject,
      },
    },
    Source: fromAddress,
  });
};

const sendDynamicEmail = async (toEmail, emailType, data = {}) => {
  const fromAddress = "harshit@devsphere.club";
  
  const emailTemplates = {
    connectionRequest: {
      subject: `🔗 New Connection Request on DevSphere from ${data.senderName || 'Someone'}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">New Connection Request! 🎉</h2>
          <p>Hello <strong>${data.receiverName || 'there'}</strong>,</p>
          <p>You have received a new connection request from <strong>${data.senderName}</strong> on DevSphere.</p>
          
          ${data.senderMessage ? `
          <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0;"><strong>Message from ${data.senderName}:</strong></p>
            <p style="margin: 10px 0 0 0; font-style: italic;">"${data.senderMessage}"</p>
          </div>
          ` : ''}
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${data.profileLink || 'https://your-devsphere-app.com'}" 
               style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
               View Profile & Respond
            </a>
          </div>
          
          <p>Best regards,<br>The DevSphere Team</p>
        </div>
      `,
      text: `New connection request from ${data.senderName}. Message: ${data.senderMessage || 'No message provided'}. Visit your profile to respond.`
    },
    
    welcome: {
      subject: "🎉 Welcome to DevSphere - Let's Build Your Developer Network!",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Welcome to DevSphere! 🚀</h2>
          <p>Hello <strong>${data.userName || 'there'}</strong>,</p>
          <p>We're excited to have you join our community of developers! Here's what you can do:</p>
          <ul>
            <li>🔗 Connect with other developers</li>
            <li>💼 Showcase your projects</li>
            <li>📚 Share your knowledge</li>
            <li>🌟 Build your professional network</li>
          </ul>
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://your-devsphere-app.com/profile" 
               style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
               Complete Your Profile
            </a>
          </div>
          <p>Happy coding!<br>The DevSphere Team</p>
        </div>
      `,
      text: `Welcome to DevSphere! Complete your profile and start connecting with developers.`
    }
  };

  const template = emailTemplates[emailType];
  if (!template) {
    throw new Error(`Email template '${emailType}' not found`);
  }

  const sendEmailCommand = createSendEmailCommand(
    toEmail,
    fromAddress,
    template.subject,
    template.html,
    template.text
  );

  try {
    const result = await sesClient.send(sendEmailCommand);
    //console.log(`Email sent to ${toEmail} - Type: ${emailType}`);
    return result;
  } catch (error) {
    console.error("SES Send Error:", error);
    throw error;
  }
};

module.exports = { sendDynamicEmail };