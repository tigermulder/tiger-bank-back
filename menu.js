const readline = require('readline')
const { createNewAccount, deposit, withdraw, balance, transfer } = require('./db')
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

console.log('tiger은행에 오신 것을 환영합니다');
console.log('\n 1. new 계좌 생성');
console.log('\n 2. 현금 입금');
console.log('\n 3. 현금 출금');
console.log('\n 4. 잔액 확인');
console.log('\n 5. 현금 이체');
console.log('\n 6. 종료');

const ip = (msg) => new Promise((resolve, reject) => {
    rl.question(`\n 👉 ${msg} : `, (ch) => {
        resolve(ch)
    })
})
const start = async () => {
    while (true) {
        const choice = await ip('원하는 작업을 입력하세요')

        if (choice == 1) {
            console.log(`\n ✅ 계좌 생성`)
            const acId = parseInt(await ip('계좌 번호를 입력하세요'))
            const acNm = await ip('계좌 이름을 입력하세요')
            const balance = 0
            createNewAccount({ acId, acNm, balance })
        }
        else if (choice == 2) {
            console.log(`\n ✅ 돈 입금`)
            const acId = parseInt(await ip('계좌 번호를 입력하세요'))
            const amount = parseFloat(await ip('Enter Amount'))
            deposit({ acId, amount })
        }
        else if (choice == 3) {
            console.log(`\n ✅ 돈 출금`)
            const acId = parseInt(await ip('계좌 번호를 입력하세요'))
            const amount = parseFloat(await ip('출금할 금액을 입력하세요'))
            withdraw({ acId, amount })
        }
        else if (choice == 4) {
            console.log(`\n ✅ 잔액 확인`)
            const acId = parseInt(await ip('계좌 번호를 입력하세요'))
            balance(acId)
        }
        else if (choice == 5) {
            console.log(`\n ✅ 현금 이체`)
            const srcId = parseInt(await ip('송신 계좌 번호를 입력하세요'))
            const destId = parseInt(await ip('수신 계좌 번호를 입력하세요'))
            const amount = parseFloat(await ip('이체할 금액을 입력하세요'))
            transfer({ srcId, destId, amount })
        }
        else {
            console.log(`안녕히 가세요`)
            process.exit()
        }
    }
}
start()



