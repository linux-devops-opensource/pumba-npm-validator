const func = require('./functions')
const genfunc = require('./genericfunctions')
const process = require('process')
const SessionID = process.env.SID || "packages"
const StorageManagerURL = `http://pumba-storage-manager:3000/${SessionID}/`
const PKGValidatorURL = `http://pumba-validator:3000/session/${SessionID}`
const targetDir = './npms4test'
const pkgtype = "npm"

async function Start() {
    const npms = await func.filterPKG(StorageManagerURL)
    await genfunc.downloadPackages(npms, StorageManagerURL, targetDir)
    await func.validation(targetDir)
    genfunc.sendDataToPKGVal(PKGValidatorURL, pkgtype, SessionID)
}
Start()