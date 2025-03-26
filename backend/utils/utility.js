import transporter from "../config/nodemailer.js";
import { config } from "dotenv";
import cloudinary from "../config/cloudinary.js";
config();

export const uploadToCloudinary = async (filePath, options = {}) => {
  try {
    const defaultOptions = {
      folder: "uploads",
      resource_type: "auto",
    };

    const uploadOptions = { ...defaultOptions, ...options };

    const result = await cloudinary.uploader.upload(filePath, uploadOptions);
    return result.secure_url;
  } catch (error) {
    console.error("Cloudinary Upload Error:", error);
    throw new Error(`Error uploading file to Cloudinary: ${error.message}`);
  }
};

export const sendMail = async ({ to, subject, html }) => {
  try {
    if (!to) throw new Error("Recipient email is required");
    if (!subject) throw new Error("Email subject is required");
    if (!html) throw new Error("Email content is required");

    const mailOptions = {
      from: process.env.EMAIL,
      to,
      subject,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully:", info.response);
    return info;
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send email");
  }
};
