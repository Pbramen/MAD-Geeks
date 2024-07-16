const { SESClient, ListIdentitiesCommand, SendEmailCommand, GetSendQuotaCommand } = require("@aws-sdk/client-ses");
const path = require("path")
require('dotenv').config({path: path.resolve(__dirname, '../../.env')});


const client = new SESClient({
    region: process.env.REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_KEY_ID
    }
})

async function getData(client) {
    const params = {
        IdentityType: "EmailAddress",
        MaxItems: 1,
        NextToken: ""
    }
    const command = new ListIdentitiesCommand(params);    

    try {
        return await client.send(command)
    } catch (err) {
        console.log(err)
    }
}

async function getQuota(client) { 
    const input = {}
    const command = new GetSendQuotaCommand(input);
    try {
        return await client.send(command);
    } catch (err) {
        console.log("Failed to get quota")
        console.log(err.message)
    }
}

async function sendEmail(input, client) {
    try {
        return await client.send(input)
    } catch (err) {
        console.log("Failed to send email")
        console.log(err);
    }
}

getQuota(client).then(async (res) => {
    if (res.Max24HourSend - 1 > res.SentLast24Hours) {
        
        // can send emails!
        return getData(client);
    }
    return false;
}).then(async res => {
    if (res === false || res?.Identities === undefined) {
        return;
    }
    console.log(res.Identities);
    process.exit();
    const input = {
        "Destination": {
            "ToAddresses": [
                dest
            ]
        },
        "Message": {
            "Subject": {
                "Charset": "UTF-8",
                "Data": "Test Email"
            },
            "Body": {
                "Html": {
                    "Charset": "UTF-8",
                    "Data": "<h1>Testing email server!</h1>"
                }
            }
        },

        "Source": dest
    }
    const command = new SendEmailCommand(input);
    return client.send(command);
}).then(res => {
    console.log("message sent succesfully!")
    console.log(res);
    return getQuota(client);
}).then(res => { 
    console.log(res?.Max24HourSend - res?.SentLast24Hours - 1, "eamils can be sent ");
}).catch(err => {
    console.log(err);
});

