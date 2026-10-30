export let getErrorMessage = (errCode, lang) => errors[errCode][lang]




let errors = {
    invalidEmail: {
        en: "this is invalid email , please enter email like this example@test.try",
        ar: "البريد الالكتروني غير صحيح"
    },
    fullName:{
        en:"full name must be like name1 name2",
        ar:"يجب ان يكون الاسم كما يلي name1 name2"
    },
    wrongPhone:{
        en:"this is invaild phone number, enter Egyptian number like this 01xxxxxxxxx",
        ar:"01xxxxxxxxx : الرقم غير صحيح، برجاء ادخل رقم مصري مثل"
    }
}