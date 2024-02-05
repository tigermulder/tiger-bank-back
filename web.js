const express = require('express')
const cors = require('cors')
const { createNewAccount, deposit, withdraw, balance, transfer } = require('./db')
const app = express()
app.use(cors())

const port = 3100

app.get('/', (req, res) => {
    res.send('Welcome to Tiger Bank!');
});

app.post('/create', express.json(), (req, res) => {
    createNewAccount(req.body, (msg) => {
        if (msg.includes('❌')) {
            // 실패한 경우
            res.status(400).json({ 'sts': 'fail', 'msg': msg });
        } else {
            // 성공한 경우
            res.status(201).json({ 'sts': 'success', 'msg': msg });
        }
    });
});


app.put('/transfer', express.json(), (req, res) => {
    transfer(req.body, msg => {
        if (msg.includes('❌')) {
            res.status(400).json({ 'sts': 'fail', msg });
        } else {
            res.json({ 'sts': 'success', msg });
        }
    });
});

app.put('/withdraw', express.json(), (req, res) => {
    withdraw(req.body, msg => {
        if (msg.includes('❌')) {
            res.status(400).json({ 'sts': 'fail', msg });
        } else {
            res.json({ 'sts': 'success', msg });
        }
    });
});

app.put('/deposit', express.json(), (req, res) => {
    deposit(req.body, msg => {
        if (msg.includes('❌')) {
            res.status(400).json({ 'sts': 'fail', msg });
        } else {
            res.json({ 'sts': 'success', msg });
        }
    });
});

app.get('/balance/:acId', (req, res) => {
    const acId = req.params.acId;
    balance(acId, (bal) => {
        if (bal.includes('❌')) {
            res.status(404).json({ 'sts': 'fail', msg: bal });
        } else {
            res.json({ 'sts': 'success', bal });
        }
    });
});

app.listen(port, () => {
    console.log(`tiger-bank 실행되었습니다. ${port}`)
})