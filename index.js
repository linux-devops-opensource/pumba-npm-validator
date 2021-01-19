const func = require('./functions')
const genfunc = require('./genericfunctions')
const process = require('process')
const SessionID = process.env.SID || "packages"
const StorageManagerURL = `http://pumba-storage-manager:3000/${SessionID}/`
const PKGValidatorURL = `http://pumba-validator:3000/sessions/${SessionID}`
const targetDir = './npms4test'

async function Start() {
    const npms = await func.filterPKG(StorageManagerURL)
    await genfunc.downloadPackages(npms, StorageManagerURL, targetDir)
    const workingPkgs = await func.validation(targetDir)
    genfunc.sendDataToPKGVal(workingPkgs, PKGValidatorURL, SessionID)
}
Start()