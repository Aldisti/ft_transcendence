import sha256 from "/scripts/crypto.js";

export function preparePasswordForm(form, dupThis) {
    console.log(form)
    let ret = {
        password: sha256(form[dupThis.language.update.oldPassword[1]].value),
        new_password: sha256(form[dupThis.language.update.newPassword[1]].value),
    }
    return (ret);
}

export function prepareEmailForm(form, dupThis) {
    let ret = {
        [dupThis.language.update.email[1]]: form[dupThis.language.update.email[1]].value,
        [dupThis.language.update.password[1]]: sha256(form[dupThis.language.update.password[1]].value),
    }
    return (ret);
}

export function prepareInfoForm(form) {
    let obj = {};
    for (let val of Object.keys(form)) {
        obj[val] = form[val].value;
    }
    return (obj);
}