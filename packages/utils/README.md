# @dddorok/utils

공통 유틸리티 함수들을 제공하는 패키지입니다.

## 설치

```bash
npm install @dddorok/utils
```

## 사용법

### 날짜 유틸리티

```typescript
import { formatDate, isToday, getRelativeTime } from "@dddorok/utils/date";

// 날짜 포맷팅
formatDate(new Date(), "YYYY-MM-DD HH:mm:ss"); // "2024-01-01 12:00:00"

// 오늘인지 확인
isToday(new Date()); // true

// 상대적 시간
getRelativeTime("2024-01-01T10:00:00Z"); // "3일 전"
```

### 문자열 유틸리티

```typescript
import { toCamelCase, truncate, isValidEmail } from "@dddorok/utils/string";

// 카멜케이스 변환
toCamelCase("hello-world"); // "helloWorld"

// 문자열 자르기
truncate("Hello World", 8); // "Hello..."

// 이메일 검증
isValidEmail("test@example.com"); // true
```

### 배열 유틸리티

```typescript
import { removeDuplicates, chunk, groupBy } from "@dddorok/utils/array";

// 중복 제거
removeDuplicates([1, 2, 2, 3]); // [1, 2, 3]

// 청크로 나누기
chunk([1, 2, 3, 4, 5], 2); // [[1, 2], [3, 4], [5]]

// 그룹화
const users = [
  { name: "Alice", age: 25 },
  { name: "Bob", age: 30 },
  { name: "Charlie", age: 25 },
];
groupBy(users, (user) => user.age); // { 25: [...], 30: [...] }
```

### 객체 유틸리티

```typescript
import { deepClone, pick, omit } from "@dddorok/utils/object";

// 깊은 복사
const original = { a: 1, b: { c: 2 } };
const cloned = deepClone(original);

// 특정 키만 선택
pick({ a: 1, b: 2, c: 3 }, ["a", "b"]); // { a: 1, b: 2 }

// 특정 키 제거
omit({ a: 1, b: 2, c: 3 }, ["b"]); // { a: 1, c: 3 }
```

### 검증 유틸리티

```typescript
import {
  isNumber,
  isValidEmail,
  isLengthInRange,
} from "@dddorok/utils/validation";

// 숫자 검증
isNumber(42); // true
isNumber("42"); // false

// 이메일 검증
isValidEmail("test@example.com"); // true

// 길이 범위 검증
isLengthInRange("hello", 3, 10); // true
```

### 포맷팅 유틸리티

```typescript
import {
  formatNumber,
  formatCurrency,
  formatPhoneNumber,
} from "@dddorok/utils/format";

// 숫자 포맷팅
formatNumber(1234567); // "1,234,567"

// 통화 포맷팅
formatCurrency(1234567); // "₩1,234,567"

// 전화번호 포맷팅
formatPhoneNumber("01012345678"); // "010-1234-5678"
```

## API 문서

### 날짜 유틸리티 (`@dddorok/utils/date`)

- `formatDate(date, format?)` - 날짜를 포맷팅
- `isToday(date)` - 오늘인지 확인
- `isPast(date)` - 과거인지 확인
- `isFuture(date)` - 미래인지 확인
- `getDaysDifference(date1, date2)` - 두 날짜의 차이 계산
- `getRelativeTime(date)` - 상대적 시간 표시

### 문자열 유틸리티 (`@dddorok/utils/string`)

- `toCamelCase(str)` - 카멜케이스 변환
- `toPascalCase(str)` - 파스칼케이스 변환
- `toSnakeCase(str)` - 스네이크케이스 변환
- `toKebabCase(str)` - 케밥케이스 변환
- `truncate(str, maxLength)` - 문자열 자르기
- `stripHtml(str)` - HTML 태그 제거
- `isValidEmail(email)` - 이메일 검증
- `isValidUrl(url)` - URL 검증
- `capitalize(str)` - 첫 글자 대문자
- `capitalizeWords(str)` - 모든 단어 첫 글자 대문자

### 배열 유틸리티 (`@dddorok/utils/array`)

- `removeDuplicates(arr)` - 중복 제거
- `chunk(arr, size)` - 청크로 나누기
- `shuffle(arr)` - 배열 섞기
- `randomElement(arr)` - 랜덤 요소 선택
- `randomElements(arr, count)` - 랜덤 요소들 선택
- `groupBy(arr, keyFn)` - 그룹화
- `sortBy(arr, keyFn?, reverse?)` - 정렬
- `isEmpty(arr)` - 빈 배열 확인
- `first(arr)` - 첫 번째 요소
- `last(arr)` - 마지막 요소
- `find(arr, predicate)` - 조건에 맞는 첫 번째 요소
- `findAll(arr, predicate)` - 조건에 맞는 모든 요소

### 객체 유틸리티 (`@dddorok/utils/object`)

- `isEmpty(obj)` - 빈 객체 확인
- `deepClone(obj)` - 깊은 복사
- `omit(obj, keys)` - 특정 키 제거
- `pick(obj, keys)` - 특정 키만 선택
- `keys(obj)` - 키들 가져오기
- `values(obj)` - 값들 가져오기
- `entries(obj)` - 키-값 쌍들 가져오기
- `merge(target, ...sources)` - 객체 병합
- `get(obj, path, defaultValue?)` - 중첩 속성 안전 접근
- `set(obj, path, value)` - 중첩 속성 설정
- `has(obj, path)` - 속성 존재 확인

### 검증 유틸리티 (`@dddorok/utils/validation`)

- `isNullish(value)` - null/undefined 확인
- `isEmptyString(value)` - 빈 문자열 확인
- `isNumber(value)` - 숫자 확인
- `isInteger(value)` - 정수 확인
- `isPositive(value)` - 양수 확인
- `isNegative(value)` - 음수 확인
- `isArray(value)` - 배열 확인
- `isObject(value)` - 객체 확인
- `isFunction(value)` - 함수 확인
- `isString(value)` - 문자열 확인
- `isBoolean(value)` - 불린 확인
- `isDate(value)` - 날짜 확인
- `isValidEmail(value)` - 이메일 검증
- `isValidUrl(value)` - URL 검증
- `isValidPhoneNumber(value)` - 전화번호 검증
- `isLengthInRange(value, min, max)` - 길이 범위 확인
- `isNumberInRange(value, min, max)` - 숫자 범위 확인

### 포맷팅 유틸리티 (`@dddorok/utils/format`)

- `formatNumber(num)` - 숫자 포맷팅
- `formatCurrency(num)` - 통화 포맷팅
- `formatPercent(num, decimals?)` - 퍼센트 포맷팅
- `formatFileSize(bytes, decimals?)` - 파일 크기 포맷팅
- `formatPhoneNumber(phone)` - 전화번호 포맷팅
- `formatSSN(ssn)` - 주민등록번호 포맷팅
- `formatCardNumber(cardNumber)` - 카드번호 포맷팅
- `formatDuration(seconds)` - 시간 포맷팅
- `formatKoreanNumber(num)` - 한국어 숫자 변환
- `formatRomanNumeral(num)` - 로마 숫자 변환

## 라이센스

MIT
