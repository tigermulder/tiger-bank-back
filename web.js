const express = require('express')
const { response } = require('express')
const cors = require('cors')
const { createNewAccount, deposit, withdraw, balance, transfer } = require('./db')
const app = express()
app.use(cors())

const port = 80

app.post('/create', express.json(), (req, res) => {
    createNewAccount( req.body , (msg) => {
        res.json({ 'sts' : 'success', msg })
    })
})

app.put('/transfer', express.json() ,(req, res) => {
    transfer(req.body, msg => {
        res.json({ 'sts' : 'success', msg })
    })
})

app.put('/withdraw', express.json(), (req, res) => {
    withdraw(req.body, msg => {
        res.json({ 'sts' : 'success', msg })
    })
})

app.put( '/deposit', express.json() ,(req, res) => {
    deposit(req.body, msg => {
        res.json({ 'sts' : 'success', msg })
    })
} )

app.get('/balance/:acId', ( req, res ) => {
    console.log(req.params)
    const acId = req.params.acId
    balance(acId)
    balance(acId, bal => {
        res.json({ bal })
    })
})

app.listen(port, () => {
    console.log(`tiger-bank 실행되었습니다. ${port}`)
})