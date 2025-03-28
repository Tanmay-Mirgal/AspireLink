export const meetingCreatedEmail = ({mentorName,date,time,passcode}) => {
    return ` <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body { font-family: Arial, sans-serif; background: #f4f4f4; padding: 20px; }
                        .container { max-width: 600px; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); }
                        .header { text-align: center; background: #007bff; color: white; padding: 15px; border-radius: 8px 8px 0 0; }
                        .content { padding: 20px; color: #333; line-height: 1.6; }
                        .passcode { background: #007bff; color: white; padding: 10px; display: inline-block; border-radius: 4px; font-size: 18px; font-weight: bold; }
                        .btn { display: inline-block; padding: 10px 15px; background: #28a745; color: white; text-decoration: none; border-radius: 4px; font-weight: bold; margin-top: 10px; }
                        .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #888; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h2>Meeting Scheduled</h2>
                        </div>
                        <div class="content">
                            <p>Dear Student,</p>
                            <p>Your mentor, <strong>${mentorName.firstName} ${mentorName.firstName}</strong>, has scheduled a meeting.</p>
                            <p><strong>Date:</strong> ${date}</p>
                            <p><strong>Time:</strong> ${time}</p>
                            <p><strong>Meeting Passcode:</strong> <span class="passcode">${passcode}</span></p>
                            <p>Please be on time and ensure you have access to the meeting platform.</p>
                            <a href="#">Join Meeting</a>
                        </div>
                        <div class="footer">
                            <p>If you have any questions, contact your mentor.</p>
                            <p>&copy; 2025 Your Platform Name. All Rights Reserved.</p>
                        </div>
                    </div>
                </body>
                </html>`
}
export const jobAppliedAcceptedAndScheduledMeeting = ({ studentName, action, date, time, passcode }) => {
    return `<!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Job Application ${action.charAt(0).toUpperCase() + action.slice(1)}</title>
      <style>
          body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
          }
          .header {
              text-align: center;
              margin-bottom: 30px;
          }
          .logo {
              max-width: 150px;
              margin-bottom: 15px;
          }
          h1 {
              color: #2a5885;
              margin-bottom: 20px;
          }
          h2 {
              color: #2a5885;
              font-size: 18px;
              margin-top: 25px;
              margin-bottom: 15px;
          }
          .meeting-details {
              background-color: #f7f9fc;
              border-left: 4px solid #2a5885;
              padding: 15px;
              margin: 20px 0;
          }
          .meeting-item {
              margin-bottom: 10px;
          }
          .meeting-label {
              font-weight: bold;
              display: inline-block;
              width: 120px;
          }
          ul {
              padding-left: 20px;
          }
          .footer {
              margin-top: 40px;
              padding-top: 20px;
              border-top: 1px solid #eee;
              font-size: 12px;
              color: #777;
          }
          .button {
              display: inline-block;
              background-color: #2a5885;
              color: white;
              padding: 12px 24px;
              text-decoration: none;
              border-radius: 4px;
              margin: 15px 0;
              font-weight: bold;
          }
      </style>
  </head>
  <body>
      <div class="header">
          <h1>Your Job Application Has Been ${action.charAt(0).toUpperCase() + action.slice(1)}!</h1>
      </div>
  
      <p>Dear ${studentName.firstName +" "+ studentName.lastName},</p>
  
      <p>Congratulations! We're pleased to inform you that your job application has been ${action}.</p>
  
      <h2>Meeting Details</h2>
      <p>A meeting has been scheduled to discuss the details further:</p>
  
      <div class="meeting-details">
          <div class="meeting-item">
              <span class="meeting-label">Date:</span> ${new Date(date).toLocaleDateString()}
          </div>
          <div class="meeting-item">
              <span class="meeting-label">Time:</span> ${time}
          </div>
          <div class="meeting-item">
              <span class="meeting-label">Location:</span> Virtual (Zoom)
          </div>
          <div class="meeting-item">
              <span class="meeting-label">Passcode:</span> ${passcode}
          </div>
      </div>
  
      <h2>What to Prepare</h2>
      <ul>
          <li>Please have your identification documents ready</li>
          <li>Have a copy of your resume ready for reference</li>
          <li>Prepare any questions you have about the role and company</li>
      </ul>
  
      <h2>What to Expect</h2>
      <p>During this meeting, we'll discuss:</p>
      <ul>
          <li>Compensation and benefits</li>
          <li>Your potential start date</li>
          <li>Team structure and your role's responsibilities</li>
          <li>Company culture and expectations</li>
      </ul>
  
      <p>If you need to reschedule or have any questions before the meeting, please contact us at our support email.</p>
  
      <p>We're excited to meet you and discuss the possibility of you joining our team!</p>
  
      <p>Best regards,</p>
      <p>
          The Recruitment Team
      </p>
  
      <div class="footer">
          <p>This email contains confidential information and is intended only for the named recipient. If you have received this email in error, please notify the sender immediately.</p>
      </div>
  </body>
  </html>`;
}