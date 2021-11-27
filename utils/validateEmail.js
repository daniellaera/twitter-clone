export function validateEmail(inputValue) {
  var regexEmail = /\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;
  if (regexEmail.test(inputValue)) {
    return true;
  }
  return;
}
