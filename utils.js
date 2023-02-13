function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  
  function structure2string(element) {
    if (isArray(element)) {
      var tmp = [];
      element.forEach(function (row) {
        if (!isArray(row) && !isObject(row)) {
          if (row) {
            tmp.push(typeof (row) + '_' + row);
          } else {
            tmp.push('_undef_');
          }
        } else {
          tmp.push(structure2string(row));
        }
      });
  
      return '[' + tmp.join(',') + ']';
    } else if (isObject(element)) {
      var string = '{';
      Object.keys(element).sort().forEach(function (key) {
        if (!isArray(element[key]) && !isObject(element[key])) {
          if (element[key]) {
            string += key + ':' + typeof (element[key]) + '_' + element[key] + ',';
          } else {
            string += key + ':' + '_undef_' + ',';
          }
        } else {
          string += key + ':' + structure2string(element[key]) + ',';
        }
      });
      string += '}';
      return string;
    } else {
      return element;
    }
    return;
  }
  
  // --- Checking data types ---
  // https://webbjocke.com/javascript-check-data-types/
  
  function isString(value) {
    return typeof value === 'string' || value instanceof String;
  }
  
  function isNumber(value) {
    return typeof value === 'number' && isFinite(value);
  }
  
  function isArray(value) {
    return value && typeof value === 'object' && value.constructor === Array;
  }
  
  function isFunction(value) {
    return typeof value === 'function';
  }
  
  function isObject(value) {
    return value && typeof value === 'object' && value.constructor === Object;
  }
  
  function isNull(value) {
    return value === null;
  }
  
  function isUndefined(value) {
    return typeof value === 'undefined';
  }
  
  function isBoolean(value) {
    return typeof value === 'boolean';
  }
  
  function isRegExp(value) {
    return value && typeof value === 'object' && value.constructor === RegExp;
  }
  
  function isError(value) {
    return value instanceof Error && typeof value.message !== 'undefined';
  }
  
  function isDate(value) {
    return value instanceof Date;
  }
  
  function isSymbol(value) {
    return typeof value === 'symbol';
  }