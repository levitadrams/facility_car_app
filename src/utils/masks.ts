/**
 * Utilitários de máscara para formatação de campos
 */

/**
 * Formata número de telefone celular para (XX) XXXXX-XXXX
 */
export const maskPhone = (value: string): string => {
  // Remove todos os caracteres não numéricos
  const cleaned = value.replace(/\D/g, '');

  // Se estiver vazio, retorna string vazia
  if (cleaned.length === 0) {
    return '';
  }

  // Aplica a máscara
  if (cleaned.length <= 2) {
    return `(${cleaned}`;
  }
  if (cleaned.length <= 7) {
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2)}`;
  }
  return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7, 11)}`;
};

/**
 * Remove máscara do telefone, retornando apenas números
 */
export const unmaskPhone = (value: string): string => {
  return value.replace(/\D/g, '');
};

/**
 * Formata CPF para XXX.XXX.XXX-XX
 */
export const maskCPF = (value: string): string => {
  // Remove todos os caracteres não numéricos
  const cleaned = value.replace(/\D/g, '');

  // Aplica a máscara
  if (cleaned.length <= 3) {
    return cleaned;
  }
  if (cleaned.length <= 6) {
    return `${cleaned.slice(0, 3)}.${cleaned.slice(3)}`;
  }
  if (cleaned.length <= 9) {
    return `${cleaned.slice(0, 3)}.${cleaned.slice(3, 6)}.${cleaned.slice(6)}`;
  }
  return `${cleaned.slice(0, 3)}.${cleaned.slice(3, 6)}.${cleaned.slice(6, 9)}-${cleaned.slice(9, 11)}`;
};

/**
 * Remove máscara do CPF, retornando apenas números
 */
export const unmaskCPF = (value: string): string => {
  return value.replace(/\D/g, '');
};
