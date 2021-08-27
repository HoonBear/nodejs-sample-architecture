const multer = require('multer');
const multerS3 = require('multer-s3');
const AWS = require('aws-sdk');
const path = require("path");                                     //file upload path module
AWS.config.loadFromPath(__dirname + "../awsconfig.json");
const s3 = new AWS.S3({
    params: { Bucket: "bucket" }
});
const validateFileType = fileType => {
    const fileTypeNormalize = fileType.toLowerCase();
    switch (fileTypeNormalize) {
        case 'document':
        case 'img':
            break;
        default:
            throw new Error('The value of \'fileType\' is not valid.');
    }
    return fileTypeNormalize + 's';
}

exports.commonFileUpload = (fileType = 'document') => {
    const filePath = validateFileType(fileType);
    return multer({
        storage: multerS3({
            s3: s3,
            bucket: `bluepet/${filePath}/tmp`,
            key: (req, file, cb) => {
                let extension = path.extname(file.originalname);
                cb(null, Date.now().toString() + extension)
            },
            acl: 'public-read-write',
        })
    });
}

exports.tmpCommonFileMove = (tmpImgName, fileType = 'document') => {
    const filePath = validateFileType(fileType);
    return new Promise((resolve, reject) => {
        s3.copyObject({
            Bucket: `bluepet/${filePath}/origin`,
            CopySource: `bluepet/${filePath}/tmp/` + tmpImgName,
            Key: tmpImgName
        }, (err, data) => {
            if (err) reject(err);
            else resolve(data);
        });
    });
}

exports.tmpCommonFileDelete = (tmpImgName, fileType = 'document') => {
    const filePath = validateFileType(fileType);
    return new Promise((resolve, reject) => {
        s3.deleteObject({
            Bucket: `bluepet/${filePath}/tmp`,
            Key: tmpImgName
        }, (err, data) => {
            if (err) reject(err);
            else resolve(data);
        });
    });
}