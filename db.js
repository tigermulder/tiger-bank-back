const mysql = require('mysql');
require('dotenv').config(); // .env 파일의 환경 변수를 로드

const client = mysql.createConnection({
    host: process.env.DB_HOST || 'mydb1.cxiookc0y4k6.ap-northeast-2.rds.amazonaws.com',
    user: process.env.DB_USER || 'insol',
    password: process.env.DB_PASSWORD || 'qkrgustjd12',
    database: process.env.DB_DATABASE || 'tiger_bank',
    port: process.env.DB_PORT || 3306,
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
    // 이미 존재하는 계좌번호인지 확인
    client.query('select * from account where ac_id = ?', [acId], (err, res) => {
        if (err) {
            console.error('\n ❌ 고객 생성 중 문제 발생:', err);
            if (onCreate) onCreate({ success: false, message: '❌ 고객 생성 중 문제 발생' });
        } else {
            if (res.length > 0) {
                // 이미 존재하는 계좌번호일 경우 알림
                console.log('\n ❌ 이미 존재하는 계좌번호입니다. 다른 계좌번호를 선택해주세요.');
                const errorMessage = '❌ 이미 존재하는 계좌번호입니다. 다른 계좌번호를 선택해주세요.';
                if (onCreate) onCreate({ success: false, message: errorMessage });
            } else {
                // 존재하지 않는 계좌번호일 경우 새로운 계좌 생성
                client.query('insert into account (ac_id, ac_name, balance) values (?, ?, ?)', [acId, acNm, balance], (err, res) => {
                    if (err) {
                        console.error('\n ❌ 고객 생성 중 문제 발생:', err);
                        if (onCreate) onCreate({ success: false, message: '❌ 고객 생성 중 문제 발생' });
                    } else {
                        console.log('\n ✅ 새로운 고객 성공적으로 생성됨');
                        const successMessage = '✅ 새로운 고객 성공적으로 생성됨';
                        if (onCreate) onCreate({ success: true, message: successMessage });
                    }
                });
            }
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

const balance = (acId, onBalance = undefined) => {
    client.query(`select balance from account where ac_id = ?`, [acId], (err, res) => {
        if (err) {
            console.log(`\n ❌ 잔액 조회 중 문제 발생`);
            console.log(err);
            if (onBalance) onBalance({ success: false, message: '❌ 잔액 조회 중 문제 발생' });
        } else {
            if (res.length === 0) {
                // 존재하지 않는 계좌번호일 경우 알림
                const errorMessage = '❌ 해당 계좌번호가 존재하지 않습니다.';
                console.log('\n', errorMessage);
                if (onBalance) onBalance({ success: false, message: errorMessage });
            } else {
                const balance = parseFloat(res[0].balance).toLocaleString('en-US');
                const successMessage = `💸 계좌 잔액은 : ${balance} 원`;
                console.log('\n', successMessage);
                if (onBalance) onBalance({ success: true, message: successMessage, balance });
            }
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
