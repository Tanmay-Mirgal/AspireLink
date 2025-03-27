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