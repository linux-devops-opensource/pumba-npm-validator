const func = require('./functions')
const genfunc = require('./genericfunctions')
const process = require('process')
const SessionID = process.env.SID || "packages"
const StorageManagerURL = `http://pumba-storage-manager:3000/${SessionID}/`
const PKGValidatorURL = `http://pumba-validator:3000/session/${SessionID}`
const targetDir = './pkgs4test'
const pkgtype = "npm"

async function Start() {
    const pkgs = await func.filterPKG(StorageManagerURL)
    await genfunc.downloadPackages(pkgs, StorageManagerURL, targetDir)
    await func.validation(targetDir)
    genfunc.sendDataToPKGVal(PKGValidatorURL, pkgtype, SessionID)
}
Start()