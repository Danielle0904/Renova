// server.js
require('dotenv').config();
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';

const app = express();
const PORT = process.env.PORT ?? 3001;
app.listen(PORT, () => console.log(`API escuchando en http://localhost:${PORT}`));

app.use(cors());                // permite que Angular en :4200 llame a :3001
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Sólo POST /contact
app.post('/contact', async (req, res) => {
  const { name, email, number, comments, html } = req.body;
  if (!name || !email || !number || !comments || !html) {
    return res.status(400).json({ success: false, message: 'Faltan datos.' });
  }

  const transporter = nodemailer.createTransport({ /* config Gmail */ });

  const mailOptions = {
    from: `"Web" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_TO,
    subject: `Nuevo mensaje de ${name}`,
    text: `Nombre: ${name}\nEmail: ${email}\nTel: ${number}\n\n${comments}`,
    html   // ¡aquí usamos directamente el HTML generado en Angular!
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ success: true, message: 'Correo enviado.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Error enviando correo.' });
  }
});