// server.js
import 'dotenv/config';          // carga tus variables de entorno
import express     from 'express';
import cors        from 'cors';
import nodemailer  from 'nodemailer';
import path from 'path';

const app  = express();
const PORT = process.env.PORT ?? 3001;

app.use('/images', express.static(path.join(__dirname, 'public/images')));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/contact', async (req, res) => {
  const { name, email, number, comments, html } = req.body;
  if (!name || !email || !number || !comments || !html) {
    return res.status(400).json({ success: false, message: 'Faltan datos.' });
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const mailOptions = {
    from: `"Web" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_TO,
    subject: `Nuevo mensaje de ${name}`,
    text: `Nombre: ${name}\nEmail: ${email}\nTel: ${number}\n\n${comments}`,
    html
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
