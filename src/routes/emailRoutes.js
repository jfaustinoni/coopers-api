const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

router.post('/', async (req, res) => {
    const { name, email, telephone, message } = req.body;

    if (!name || !email || !telephone || !message) {
        return res.status(422).json({ msg: 'Todos os campos são obrigatórios!' });
    }

    let transporter = nodemailer.createTransport({
        host: 'smtp.mailtrap.io',
        port: 2525,
        auth: {
            user: '7c1019bb71ffbd',
            pass: '638e4422949727',
        },
    });

   
    let mailOptions = {
        from: 'jhonatanwesley.faustinoni@hotmail.com',
        to: email,
        subject: 'Novo contato do formulário de contato',
        text: `
          Nome: ${name}
          Email: ${email}
          Telefone: ${telephone}
          Mensagem: ${message}
        `,
      };

    
    try {
        let info = await transporter.sendMail(mailOptions);
        console.log('E-mail enviado:', info.response);
        res.status(200).json({ success: true, message: 'E-mail enviado com sucesso!' });
    } catch (error) {
        console.error('Erro ao enviar e-mail:', error);
        res.status(500).json({ success: false, error: 'Erro ao enviar e-mail' });
    }
});

module.exports = router;
