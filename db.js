const mysql = require('mysql');

const client = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'qkrgustjd12',
    database: 'tiger_bank',
    port: 3306,
});

// MySQL 연결
client.connect(err => {
    if (err) {
        console.error('❌ MySQL 연결 중 오류 발생:', err);
    } else {
        console.log('✅ MySQL 연결 성공');
    }
});

const createNewAccount = ({ acId, acNm, balance }, onCreate = undefined) => {
    client.query('insert into account (ac_id, ac_name, balance) values (?, ?, ?)', [acId, acNm, balance], (err, res) => {
        if (err) {
            console.error('\n ❌ 고객 생성 중 문제 발생:', err);
        } else {
            console.log('\n ✅ 새로운 고객 성공적으로 생성됨');
            if (onCreate) onCreate('✅ 새로운 고객 성공적으로 생성됨');
        }
    });
}

const withdraw = ({ acId, amount }, onWithdraw = undefined) => {
    client.query('select balance from account where ac_id = ?', [acId], (err, res) => {
        if (err) {
            console.log('\n ❌ 출금 중 문제 발생');
        } else {
            const balance = parseFloat(res[0].balance).toLocaleString('en-US');
            const newBalance = parseFloat(balance.replace(/,/g, '')) - amount;
            client.query('update account set balance = ? where ac_id = ?', [newBalance, acId], (err, res) => {
                if (err) {
                    console.log('\n ❌ 출금 중 문제 발생');
                } else {
                    console.log(`\n ✅ 금액 ${amount.toLocaleString('en-US')} 출금 성공`);
                    if (onWithdraw) onWithdraw(`✅ 금액 ${amount.toLocaleString('en-US')} 출금 성공`);
                }
            });
        }
    });
}

const deposit = ({ acId, amount }, onDeposit = undefined) => {
    client.query('select balance from account where ac_id = ?', [acId], (err, res) => {
        if (err) {
            console.log('\n ❌ 입금 중 문제 발생');
        } else {
            const balance = parseFloat(res[0].balance).toLocaleString('en-US');
            const newBalance = parseFloat(balance.replace(/,/g, '')) + amount;
            client.query('update account set balance = ? where ac_id = ?', [newBalance, acId], (err, res) => {
                if (err) {
                    console.log('\n ❌ 입금 중 문제 발생');
                } else {
                    console.log(`\n ✅ 금액 ${amount.toLocaleString('en-US')} 입금 성공`);
                    if (onDeposit) onDeposit(`✅ 금액 ${amount.toLocaleString('en-US')} 입금 성공`);
                }
            });
        }
    });
}

const transfer = ( {srcId, destId, amount }, onTransfer = undefined) => {
    withdraw({ acId : srcId, amount }, msgWd => {
        deposit({ acId : destId, amount }, msgDp => {
            if(onTransfer) onTransfer( `✅ 금액 ${amount} 이체 성공` )
        })
    })
}

const balance  = (acId, onBalance = undefined) => {
    console.log(acId)
    client.query(`select balance from account where ac_id = ?`, [acId], (err, res) => {
        if (err) {
            console.log(`\n ❌ 잔액 조회 중 문제 발생`)
            console.log(err);
        } else {
            const balance = parseFloat(res[0].balance).toLocaleString('en-US');
            console.log(`\n 💸 계좌 잔액은 : ${balance} 원`);
            if (onBalance) onBalance(balance);
        }
    })
}

module.exports = {
    createNewAccount,
    deposit,
    withdraw,
    transfer,
    balance
};
