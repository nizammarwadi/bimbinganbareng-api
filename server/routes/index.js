const express = require('express')
const {GoogleSpreadsheet} = require('google-spreadsheet')
const { json } = require('body-parser')
const credentials = require('../bimbingan-bareng-credentials.json')
const doc = new GoogleSpreadsheet('1Mxw7_OFmy77AlwCaB-tdkFw3dNwsWVXamA-yOiRf9FY')

const router = express.Router()

router.get('/', async (req, res, next) => {
    let customers = []
    await doc.useServiceAccountAuth({
        client_email: credentials.client_email,
        private_key: credentials.private_key,
    });
    await doc.loadInfo()
    const sheet = doc.sheetsByIndex[0];
    const rows = await sheet.getRows()
    if (rows) {
        rows.forEach(row => {
            if (row._rawData[3] && row._rawData[3].toLowerCase() !== 'non-aktif' || !row._rawData[3]) {
                let customer = {
                    'id': row._rawData[0],
                    'fullname': row._rawData[1],
                    'email': row._rawData[2],
                    'whatsapp': 'netflix',
                    'project_title': row._rawData[3],
                    'project_description': row._rawData[4],
                }
                customers.push(customer)
            }
        })
    }
    res.send(customers)
})


router.post('/', async (req, res, next) => {
    let user = {
        fullname, email, whatsapp, project_title, project_description
    } = req.body
    await doc.useServiceAccountAuth({
        client_email: credentials.client_email,
        private_key: credentials.private_key,
    });
    await doc.loadInfo()
    const sheet = doc.sheetsByIndex[0];
    const rows = await sheet.getRows()
    let customer = {
        id: rows.length + 1,
        fullname: user.fullname,
        email: user.email,
        whatsapp: user.whatsapp,
        project_title: project_title,
        project_description: project_description
    }
    try {
        await sheet.addRows([customer])
        console.log('success insert user to spreadsheet')
        res.send(customer)
    } catch (error) {
        console.log(error)
    }
})


module.exports = router