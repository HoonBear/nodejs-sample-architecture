module.exports = async(req, errorCode) => {
    await axios.request(
        {
            method: 'POST',
            baseURL: 'Slack WEBHOOK BaseUrl',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            },
            data: {
                "channel": "#slack-channel",
                "username": `send name`,
                "text": `[${req.method}] ${req.baseUrl}${req.path} has been Error`,
                "icon_emoji": "🥺",
                "attachments": [
                    {
                        "color": "danger",
                        "text": 
                        `error-code : ${errorCode}
                        request-query : ${JSON.stringify(req.query)}
                        request-body : ${JSON.stringify(req.body)}
                        request-params : ${JSON.stringify(req.params)}
                        request-ip : ${JSON.stringify(req.headers['x-forwarded-for']) || JSON.stringify(req.connection.remoteAddress)}`
                    }
                ]
            }
        }
    );
}