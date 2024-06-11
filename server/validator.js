const { body } = require('express-validator')

const isFieldEmpty = (field) => {
    return body(field)
            .not()
            .isEmpty() // not, isEmpty 순서 바꾸면 안됨
            .withMessage(`${field} is required`)
            .bail() // bail() 메서드 앞쪽 부분이 false 이면 더 이상 뒷쪽의 데이터검증을 안함
            .trim() // 공백 제거
}

const validateUserName = () => {
    return isFieldEmpty("name")
            .isLength({min: 2, max: 20})
            .withMessage("user name length must be between 2~20 characters")
}
const validateUserNickName = () => {
    return body("nickName")
            .not()
            .matches(/[!@#$%^&*]/)
            .withMessage("user nick name can not use special character")
}
const validateUserEmail = () => {
    return isFieldEmpty("email")
            .isEmail()
            .withMessage("user email is not valid")
}
const validateUserId = () => {
    return isFieldEmpty("userId")
            .isLength({min: 5, max: 10})
            .withMessage("user id length must be between 5~10 characters")
            .bail()
            .not()
            .matches(/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/)
            .withMessage("user id can not use korean")
            .not()
            .matches(/[!@#$%^&*]/)
            .withMessage("user id can not use special character")
}
const validateUserPassword = () => {
    return isFieldEmpty("password")
            .isLength({min: 7, max: 15})
            .withMessage("password length must be between 7~15 characters")
            .bail()
            .matches(/[A-Za-z]/)
            .withMessage("password must be at least 1 alphabet")
            .matches(/[0-9]/)
            .withMessage("password must be at least 1 number")
            .matches(/[!@#$%^&*]/)
            .withMessage("password must be at least 1 special character")
            .bail()
            .custom((value, {req}) => req.body.confirmPassword === value) // 입력한 비밀번호가 같은지 재확인
            .withMessage("passwords don't match")
}


module.exports = {
    validateUserName,
    validateUserNickName,
    validateUserPassword,
    validateUserEmail,
    validateUserId
}