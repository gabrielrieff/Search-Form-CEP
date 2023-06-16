/* eslint-disable prettier/prettier */
export const zipCodeMask = (cep: string) => {
  if(cep.length < 8){
    return cep.replace(/(\d{5})(\d)/, '$1-$2');
  };
  }
    
