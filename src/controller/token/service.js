const jwt = require('jsonwebtoken');
const mysqlExecutor = require('../../model/mysqlExeutor');
const mysqlStatement = require('./statement');
const responseError = require('../../core/responseError');

exports.reissuanceToken = async (req, res, next) => {
    try {
        const { isApp, socialId } = req.query;
        const refreshToken = req.cookies.REFRESH_TOKEN;
        await this.refreshTokenVerify(refreshToken);

        const loginInfo = await mysqlExecutor(
            await mysqlStatement.readLoginInfo(), socialId
        );

        const tokenObject = await this.issueAccessAndRefreshTokens(isApp, loginInfo)

        return res.status(statusCode.OK)
                    .cookie('REFRESH_TOKEN', tokenObject.refreshToken, {
                        expires: new Date( Date.now() + 60 * 60 * 1000 * 24 * 7),
                        httpOnly: true,
                        secure: true,
                        sameSite: 'None',
                        domain: '.peting.co.kr'
                    })
                    .send(responseJson.success(statusCode.OK, "success", {
                        ACCESS_TOKEN: tokenObject.accessToken,
                        ACCESS_EXPIRATION: tokenObject.accessTokenExpirationDate,
                        SOCIAL_ID : socialId == '' ? '' : loginInfo[0].SOCIAL_ID
                    }));
    } catch (e) {
        console.error(e.message);
        return responseError(req, res, e.message);
    }
}
exports.accessTokenVerify = async (req, res, next) => {
    try {
        if(req.body.userCd || req.query.userCd == 'NONE_MEMBER') return next();

        const accessToken = req.headers['authorization'];
        const verifyTime = new Date(Date.now());
        const verifyAccessToken = jwt.verify(accessToken, process.env.JWT_SECRET, (error, decoded) => {
            return { ERROR : error, DECODED : decoded }
        });
    
        if(!accessToken) 
            throw new Error(-1)
        if(verifyAccessToken.ERORR) 
            throw new Error(-2)
        if(verifyAccessToken.DECODED.exp < verifyTime)
            throw new Error(-3)

        next();
    } catch (e) {
        console.error(e.message);
        return responseError(req, res, e.message);
    }
}

exports.refreshTokenVerify = async (refreshToken) => {
    const verifyRefreshToken = jwt.verify(refreshToken, process.env.JWT_SECRET, (error, decoded) => {
        return { ERROR : error, DECODED : decoded }
    });
    const verifyTime = new Date(Date.now());
    const isValidToken = verifyTime > verifyRefreshToken.DECODED.exp;

    if (!refreshToken)
        return new Error(-1)    
    if (!isValidToken) 
        return new Error(-3)
    
    return true;
}

exports.issueAccessAndRefreshTokens = async(isApp, loginInfo) => {
    const second = 1000;
    const minute = 60 * second;
    const hour = 60 * minute;
    const day = 24 * hour;
    
    const webTokenExpirationDate = new Date(Date.now() + (30 * minute));
    const webTokenExpirationSecond = Math.floor(webTokenExpirationDate / second);
    
    const appTokenExpirationDate = new Date(Date.now() + (365 * day));
    const appTokenExpirationSecond = Math.floor(appTokenExpirationDate / second);

    const refreshTokenExpirationDate = new Date(Date.now() + (2 * day));
    const refreshTokenExpirationSecond = Math.floor(refreshTokenExpirationDate / second);

    const accessToken = jwt.sign({
        userDiv: "USER",
        userInfo: loginInfo, 
        iat: Date.now(),
        exp: isApp != 1 ? webTokenExpirationDate : appTokenExpirationDate
    }, process.env.JWT_SECRET);

    const refreshToken = jwt.sign({
        iat: Date.now(),
        exp: refreshTokenExpirationSecond
    }, process.env.JWT_SECRET);

    return {
        accessToken: accessToken,
        accessTokenExpirationDate: isApp != 1 ? webTokenExpirationDate : appTokenExpirationDate,
        accessTokenExpirationSecond: isApp != 1 ? webTokenExpirationSecond : appTokenExpirationSecond,
        refreshToken: refreshToken,
        refreshTokenExpirationDate: refreshTokenExpirationDate,
        refreshTokenExpirationSecond: refreshTokenExpirationSecond
    }
}