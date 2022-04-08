const prompt = require('prompt')
const AWS = require('aws-sdk')
const dotenv = require('dotenv')

dotenv.config();
prompt.start();

AWS.config.update({
    region: process.env.AWS_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

const cognito = new AWS.CognitoIdentityServiceProvider()

prompt.get(['email', 'username'], async function (err, result) {
    if (err) {
        return onErr(err);
    }

    const email = result.email
    const username = result.username

    await createUser(email, username)
});


async function createUser(email, username) {
    const cognitoParams = {
        UserPoolId: process.env.AWS_COGNITO_USER_POOL_ID,
        Username: username,
        TemporaryPassword: 'T&ste123',
        UserAttributes: [{
            Name: 'email',
            Value: email
        }
        ]
    }

    try {
        const response = await cognito.adminCreateUser(cognitoParams).promise();
        console.log(response)
    } catch (err) {
        console.log({ err })
    }
}


