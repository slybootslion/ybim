export const typeOf = target => Object.prototype.toString.call(target).split(' ')[1].slice(0, -1).toLocaleLowerCase()

export const debounce = (fn, delay = 500) => {
  let timer = null
  return (...args) => {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      fn.call(this, ...args)
      timer = null
    }, delay)
  }
}

export function formatFloat(x,pos){   
  let f = parseFloat(x);
  if(isNaN(f)){
      return false;
  }   
  f = Math.round(x*Math.pow(10, pos))/Math.pow(10, pos); // pow 幂   
  let s = f.toString();
  let rs = s.indexOf('.');
  if(rs < 0){
      rs = s.length;
      s += '.'; 
  }
  while(s.length <= rs + pos){
      s += '0';
  }
  return s;
}  