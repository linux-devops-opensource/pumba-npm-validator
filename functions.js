const errDebug = require('debug')('debug:err')
const superDebug = require('debug')('debug:stdout')
const { execSync } = require('child_process')
const fs = require('fs')
const { stderr } = require('process')
const genfunc = require('./genericfunctions')
var loopbacktoken = false

// functions block and export and use of funxtions. in this file is so that we can use nested stubs in our tests.
// if we don't call the functions from this block they will be imported to the test module and use the nested local functions and not as a global function
// that we can stub
const functions = {
    filterPKG,
    validateNPMs,
    testinstallNPM,
    validation
}
module.exports = functions;

async function filterPKG(StorageManagerURL) {
    const npms = await genfunc.getPackages(StorageManagerURL)
    return npms.filter(s=>~s.indexOf(".tgz"));
}

async function validation(npmdir) {
    do {
        loopbacktoken = false
        superDebug(`start while loop, loopbacktoken: ${loopbacktoken}`)
        try {
            await validateNPMs(npmdir)
        } catch (err) {
            errDebug(err)
        }
        superDebug(`end of while loop, loopbacktoken: ${loopbacktoken}`)
    } while (loopbacktoken)
    console.log('NPM package validator has finished')
}

function validateNPMs(npmdir) {
    return new Promise((res, rej) => {
        if (fs.readdirSync(npmdir).length != 0) {
            fs.readdirSync(npmdir).forEach(async (file) => {
                let stdout = execSync(`file ${npmdir}/${file}`).toString()
                if (stdout.includes("gzip")) {
                    try {
                        await testinstallNPM(npmdir, file)
                    } catch (err) {
                        rej(err)
                    }
                    res(true)
                } else {
                    const err = `File "${file}" is not an NPM package`
                    fs.unlinkSync(`${npmdir}/${file}`)
                    errDebug(err)
                    rej(err)
                }
            })
        } else {
            res(`There are no files in the validate directory: ${npmdir}`)
        }
    })
}

function testinstallNPM(dir, npm) {
    return new Promise((res, rej) => {
        console.log(`Validating Package ${npm}`)
        superDebug(`Stage testinstallNPM:start loopbacktoken: ${loopbacktoken}`)
        try {
            const stdout = execSync(`npm i --dry-run ${dir}/${npm}`, {stdio: [stderr]}).toString()
            superDebug(stdout)
            console.log(`Package ${npm} installed successfully`)
            loopbacktoken = true
            genfunc.deletePackagefile(`${dir}/${npm}`)
            genfunc.genPkgArray(npm,0,"success")
            res(true)
        } catch (err) {
            const stderr = err.stderr
            if (stderr.includes("Requires") || stderr.includes("nothing provides")) {
                console.log(`Package ${npm} has missing dependencies...`)
                genfunc.genPkgArray(npm,1,"missing_deps")
                errDebug(err)
            } else {
                console.log(`Unable to install package ${npm}, run debug mode to view error`)
                genfunc.genPkgArray(npm,666,"unknown_err")
                errDebug(err)
            }
            rej(err)
        }
    })
}