exports.readLoginInfo = async() => {
    return `
    SELECT * FROM TB_USER_LIST WHERE SOCIAL_ID = ? AND BUSE <> 0;
    `;
}