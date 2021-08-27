const responseCode = require('../../core/responseCode');
const responseJson = require('../../core/responseJson');
const responseError = require('../../core/responseError');
const mysqlExecutor = require('../../model/mysqlExeutor');
const mysqlStatement = require('./statement');
exports.test = async(req, res) => {
    try{
        const { userCd } = req.query;

        const test = await mysqlExecutor(
            await mysqlStatement.test(), [userCd]
        );

        return res.send(responseJson.success(responseCode.OK, "success", test))
    } catch (e) {
        console.error(e.message);
        return responseError(req, res, e.message);
    }
}