class FieldValidator {
  constructor(
    translationToPt,
    minFieldLength,
    maxFieldLength,
    fieldType,
    isUnique,
    insertAtLogin,
    returnValue,
  ) {
    this.translationToPt = translationToPt;
    this.minFieldLength = minFieldLength;
    this.maxFieldLength = maxFieldLength;
    this.fieldType = fieldType;
    this.isUnique = isUnique;
    this.insertAtLogin = insertAtLogin;
    this.returnValue = returnValue;
  }
}
module.exports = FieldValidator;