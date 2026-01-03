import transporter from "../config/email.js";

export const sendContactMessage = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.json({ success: false, message: "Missing required fields." });
    }

    // Email to YOU (admin)
    await transporter.sendMail({
      from: `"MAYILÉ Contact Form" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_TO, 
      subject: `New Contact Form Message from ${name}`,
      html: `
        <h2>New Message</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    });

    // Auto-response to the user
    await transporter.sendMail({
      from: `"MAYILÉ" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "We received your message — MAYILÉ",
      html: `
        <p>Hi ${name},</p>
        <p>Thank you for reaching out. We've received your message and our team will get back to you shortly.</p>
        <p>Warm regards,<br/>MAYILÉ</p>
      `,
    });

    return res.json({ success: true, message: "Message sent successfully!" });

  } catch (error) {
    console.error(error);
    return res.json({ success: false, message: "Failed to send email." });
  }
};
