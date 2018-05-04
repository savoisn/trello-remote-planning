export const removeChilds = (elem) => {
  while(elem.firstChild){
    elem.removeChild(elem.firstChild)
  }
}
