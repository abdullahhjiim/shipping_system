export function removePlus(str) {
    if (str) {
      return str.split('+').join(' ');
    }
  }
