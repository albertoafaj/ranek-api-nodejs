const ValidationError = require('../err/ValidationsError');

const getDataFields = (field, dataValidator) => {
  let fieldValue;
  Object.entries(dataValidator).filter(([key, value]) => {
    if (key === field) { fieldValue = value; }
    return value;
  });
  return fieldValue;
};

const validation = (
  data,
  name,
  validator,
  insertAtLogin,
  checkIsNull,
  checkIsUnique,
  checkTypeOf,
  checkFieldLength,
) => {
  let dataLength = 0;
  Object.entries(data).forEach(([key, value]) => {
    if (key) dataLength += 1;

    const dataFields = getDataFields(key, validator);
    if (checkIsNull && value === null) throw new ValidationError(`O campo ${dataFields.translationToPt} é um atributo obrigatório`);
    const fieldLength = value.toString().length;
    if (
      (value && checkIsUnique)
      && (dataFields.isUnique === true)
    ) throw new ValidationError(`O campo ${dataFields.translationToPt} não pode ser alterado`);
    if (insertAtLogin && dataFields.insertAtLogin === false) throw new ValidationError(`O campo ${dataFields.translationToPt} não deve ser inserido nessa etapa`);
    if (
      (value && checkTypeOf)
      && (typeof value !== dataFields.fieldType)
    ) throw new ValidationError(`O campo ${dataFields.translationToPt} deve ser um(a) ${dataFields.fieldType}`);
    if (
      (value && checkFieldLength)
      && (dataFields.minFieldLength === dataFields.maxFieldLength)
      && fieldLength !== dataFields.maxFieldLength
    ) throw new ValidationError(`O campo ${dataFields.translationToPt} deve ter ${dataFields.maxFieldLength} caracteres`);
    if (
      (value && checkFieldLength)
      && (fieldLength < dataFields.minFieldLength || fieldLength > dataFields.maxFieldLength)
    ) throw new ValidationError(`O campo ${dataFields.translationToPt} deve ter de ${dataFields.minFieldLength} a ${dataFields.maxFieldLength} caracteres`);
  });
  if (dataLength === 0) throw new ValidationError(`O objeto ${name} está vazio, favor preencher corretamente`);
};

module.exports = validation;
