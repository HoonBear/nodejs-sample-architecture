const responseCode = require('./responseCode');
const responseJson = require('./responseJson');
const responseSlack = require('./responseSlack');

module.exports = async (req, res, errorCode) => {
    switch (errorCode) {
        default:
            await responseSlack(req, options)
            return res.status(responseCode.DB_ERROR).send(responseJson.fail(responseCode.DB_ERROR, "잠시 후에 시도해주세요."))
        case '0':
            await responseSlack(req, options)
            return res.status(responseCode.BAD_REQUEST).send(responseJson.fail(responseCode.BAD_REQUEST, "잘못된 요청입니다."))
        case '-1':
            return res.status(statusCode.UNAUTHORIZED).send(responseJson.fail(statusCode.UNAUTHORIZED, "NOT_EXIST"));    
        case '-2':
            return res.status(statusCode.UNAUTHORIZED).send(responseJson.fail(statusCode.UNAUTHORIZED, "UNAUTHORIZED"));
        case '-3':
            return res.status(statusCode.UNAUTHORIZED).send(responseJson.fail(statusCode.UNAUTHORIZED, "EXPIRED"));
    }
}