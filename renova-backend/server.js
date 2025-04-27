// server.js
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';

const app = express();
const PORT = process.env.PORT ?? 3001;

app.use(cors());                // permite que Angular en :4200 llame a :3001
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Sólo POST /contact
app.post('/contact', async (req, res) => {
  const { name, email, number, comments } = req.body;
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
  });
  const mailOptions = {
    from: `"Web" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_TO,
    subject: `Nuevo mensaje de ${name}`,
    text: `Nombre: ${name}\nEmail: ${email}\n\n${comments}`,
    html: `<p><strong>Nombre:</strong> ${name}</p>
           <p><strong>Email:</strong> ${email}</p>
           <p><strong>Email:</strong> ${number}</p>
           <p><strong>Mensaje:</strong><br>${comments.replace(/\n/g,'<br>')}</p>`
  };
  try {
    await transporter.sendMail(mailOptions);
    res.json({ success: true, message: 'Correo enviado.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Error enviando correo.' });
  }
});

app.listen(PORT, () => console.log(`API escuchando en http://localhost:${PORT}`));
