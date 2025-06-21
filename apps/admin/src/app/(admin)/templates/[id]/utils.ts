// 숫자 검증 함수
export const validateNumber = (value: any): boolean => {
  if (value === "" || value === null || value === undefined) return true;
  return !isNaN(value) && !isNaN(parseFloat(String(value)));
};

// 문자열을 숫자로 변환하는 함수
export const parseToNumber = (value: any): number | null => {
  if (value === "" || value === null || value === undefined) return null;
  const num = parseFloat(String(value));
  return isNaN(num) ? null : num;
};
