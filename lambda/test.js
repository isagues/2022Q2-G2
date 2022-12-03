exports.handler = async (event) => {
    return {
        "isBase64Encoded": false,
        "statusCode": 200,
        "headers": { },
        "body": JSON.stringify({ Hola: "cloud", event: event })
    }
};