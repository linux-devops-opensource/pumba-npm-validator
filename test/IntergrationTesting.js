const fs = require('fs')
const chai = require('chai')
const sinon = require('sinon')
const testNPM = 'browser-stdout-1.3.1.tgz'
const functions = require('../functions')
const genfunc = require('../genericfunctions')

//create sandbox
fs.mkdirSync("./test/testsandbox", { recursive: true })

describe('Test install NPM', function() {
    it('If the installation is successful we should get no errors', async function () {
        this.timeout(7000)
        fs.copyFileSync(`./test/testresources/${testNPM}`, `./test/testsandbox/${testNPM}`)
        sinon.stub(genfunc, "deletePackagefile").returns(true)
        const result = await functions.testinstallNPM('./test/testsandbox/', testNPM)
        chai.expect(result).to.be.true
    })
})