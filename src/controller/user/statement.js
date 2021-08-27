exports.test = async() => {
    return`
    SELECT * FROM TB_USER_LIST WHERE USER_CD = ?
    `
}