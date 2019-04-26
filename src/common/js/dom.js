export function addClassName (el, className) {
  if (hasClassName(el, className)) {
    return
  }
  let newClassName = el.className.split(' ')
  newClassName.push(className)
  el.className = newClassName.join(' ')
}

export function hasClassName (el, className) {
  let reg = new RegExp('(^|\\s)' + className + '(\\s|$)')
  return reg.test(el.className)
}

export function attr(el, attr, val) {
  let prefix = "data-";
  let name = prefix + attr;
  if (val) {
    return el.setAttribute(name, val);
  }
  else {
    return el.getAttribute(name);
  }
}