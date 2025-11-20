const express = require('express');
const nodemailer = require('nodemailer');
const router = express.Router();

// POST /api/contact
router.post('/contact', async (req, res) => {
    const { firstName, email, contactNo, companyName, message } = req.body;

    if (!firstName || !email || !message) {
        return res.status(400).json({ success: false, message: "All required fields must be filled." });
    }

    try {
        // Gmail SMTP Transporter
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'ra580jan@gmail.com', //  your Gmail address
                pass: 'thtiatzbynbudnta',   //  Gmail App Password (NOT your login password)
            },
        });

        // Mail content
        const mailOptions = {
            from: `"${firstName}" <${email}>`,
            to: 'ra580jan@gmail.com', // receiver email (can be same as sender)
            subject: `New Contact Query from ${firstName}`,
            html: `
        <h3>New Contact Query</h3>
        <p><strong>Name:</strong> ${firstName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Contact No:</strong> ${contactNo || 'N/A'}</p>
        <p><strong>Company Name:</strong> ${companyName || 'N/A'}</p>
        <p><strong>Message:</strong><br>${message}</p>
      `,
        };

        // Send email
        await transporter.sendMail(mailOptions);

        res.json({ success: true, message: 'Mail sent successfully!' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ success: false, message: 'Failed to send mail', error: error.message });
    }
});

module.exports = router;
