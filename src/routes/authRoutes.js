const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/User')

router.post('/register', async(req, res) => {
    const { name, email, password, confirmpassword } = req.body

    if(!name || !email || !password || !confirmpassword) {
        return res.status(422).json({ msg: 'Todos os campos são obrigatórios!' })
    }

    if(password !== confirmpassword) {
        return res.status(422).json({ msg: 'As senhas não conferem!' })
    }

    try {
        const userExists = await User.findOne({ email: email })

        if(userExists) {
            return res.status(422).json({ msg: 'Usuário já existe!' })
        }

        const passwordHash = await bcrypt.hash(password.toString(), 12)

        const user = new User({
            name,
            email,
            password: passwordHash
        })

        await user.save()

        res.status(201).json({ msg: 'Usuário criado com sucesso!' })
    } catch (error) {
        console.error('Erro ao registrar usuário:', error)
        res.status(500).json({ msg: 'Aconteceu um erro no servidor, tente novamente.' })
    }
})

router.post('/login', async(req, res) => {
    const { email, password } = req.body

    if(!email) {
        return res.status(422).json({ msg : 'Email é obrigatório!' })
    }

    if(!password) {
        return res.status(422).json({ msg : 'Senha é obrigatório!' })
    }

    const user = await User.findOne({ email: email })

    if(!user) {
        return res.status(422).json({ msg : 'Usuário não existe!' })
    }

    const checkPassword = await bcrypt.compare(password, user.password)
    if(!checkPassword) {
        return res.status(422).json({ msg : 'Senha inválida!' })
    }

    try {
        const secret = process.env.SECRET

        const token = jwt.sign(
            {
                id: user._id,
            },
            secret,
        )


        res.status(200).json({ msg: 'Usuário logado com sucesso!', token })
    } catch (error) {
        res.status(500).json({ msg: 'Aconteceu um erro no servidor, tente novamente.' })
    }
})

module.exports = router
