type ToolType = "대바늘" | "코바늘";
export type PatternType = "서술형" | "차트형" | "혼합형";
export type PublishStatus = "공개" | "비공개";

export type ConstructionMethod = "TOP_DOWN" | "BOTTOM_UP" | "PIECE" | "ROUND";
export type SleeveType =
  | "래글런형"
  | "셋인형"
  | "요크형"
  | "새들숄더형"
  | "드롭숄더형"
  | "베스트형";
export type NecklineType = "라운드넥" | "브이넥" | "스퀘어넥";

// Update measurement item types
export type MeasurementItemData = {
  id: string;
  name: string;
  category: string; // 항목 분류 (예: 상의, 하의, 소매 등 중분류 카테고리 기준)
  section: string; // 세부 섹션 (몸통, 소매 등)
  unit: string; // 단위 (cm, mm 등)
  description: string; // 측정 방법 설명
};

// 하드코딩된 array 대신 API에서 가져올 측정 항목들
export const measurementItems: MeasurementItemData[] = [
  // 상의 관련 측정 항목
  {
    id: "shoulder_slope",
    name: "어깨처짐",
    category: "상의",
    section: "몸통",
    unit: "cm",
    description: "어깨 기울기 측정",
  },
  {
    id: "shoulder_width",
    name: "어깨너비",
    category: "상의",
    section: "몸통",
    unit: "cm",
    description: "어깨 끝점 간 거리",
  },
  {
    id: "back_neck_depth",
    name: "뒷목깊이",
    category: "상의",
    section: "몸통",
    unit: "cm",
    description: "뒷목 깊이 측정",
  },
  {
    id: "front_neck_depth",
    name: "앞목깊이",
    category: "상의",
    section: "몸통",
    unit: "cm",
    description: "앞목 깊이 측정",
  },
  {
    id: "neck_width",
    name: "목너비",
    category: "상의",
    section: "몸통",
    unit: "cm",
    description: "목 둘레 측정",
  },
  {
    id: "chest_width",
    name: "가슴너비",
    category: "상의",
    section: "몸통",
    unit: "cm",
    description: "가슴 둘레 측정",
  },
  {
    id: "waist_width",
    name: "허리 너비",
    category: "상의",
    section: "몸통",
    unit: "cm",
    description: "허리 둘레 측정",
  },
  {
    id: "hip_width",
    name: "엉덩이 너비",
    category: "상의",
    section: "몸통",
    unit: "cm",
    description: "엉덩이 둘레 측정",
  },
  {
    id: "total_length",
    name: "총장",
    category: "상의",
    section: "몸통",
    unit: "cm",
    description: "어깨부터 아랫단까지 길이",
  },
  {
    id: "arm_hole_length",
    name: "진동길이",
    category: "상의",
    section: "몸통",
    unit: "cm",
    description: "어깨부터 겨드랑이까지 길이",
  },
  {
    id: "side_length",
    name: "옆길이",
    category: "상의",
    section: "몸통",
    unit: "cm",
    description: "겨드랑이부터 밑단까지 길이",
  },

  {
    id: "sleeve_length",
    name: "소매 길이",
    category: "상의",
    section: "소매",
    unit: "cm",
    description: "어깨부터 소매 끝까지 길이",
  },
  {
    id: "sleeve_width",
    name: "소매 너비",
    category: "상의",
    section: "소매",
    unit: "cm",
    description: "소매 통 둘레",
  },
  {
    id: "wrist_width",
    name: "손목 너비",
    category: "상의",
    section: "소매",
    unit: "cm",
    description: "손목 둘레 측정",
  },

  // 하의 관련 측정 항목
  {
    id: "waist_circumference",
    name: "허리둘레",
    category: "하의",
    section: "허리/엉덩이",
    unit: "cm",
    description: "허리 둘레 측정",
  },
  {
    id: "hip_circumference",
    name: "엉덩이둘레",
    category: "하의",
    section: "허리/엉덩이",
    unit: "cm",
    description: "엉덩이 둘레 측정",
  },
  {
    id: "rise",
    name: "밑위",
    category: "하의",
    section: "허리/엉덩이",
    unit: "cm",
    description: "허리선에서 가랑이까지 길이",
  },

  {
    id: "thigh_width",
    name: "허벅지 너비",
    category: "하의",
    section: "다리",
    unit: "cm",
    description: "허벅지 둘레 측정",
  },
  {
    id: "knee_width",
    name: "무릎 너비",
    category: "하의",
    section: "다리",
    unit: "cm",
    description: "무릎 둘레 측정",
  },
  {
    id: "hem_width",
    name: "밑단 너비",
    category: "하의",
    section: "다리",
    unit: "cm",
    description: "바지 밑단 너비 측정",
  },
  {
    id: "inseam",
    name: "인심",
    category: "하의",
    section: "다리",
    unit: "cm",
    description: "가랑이에서 발목까지 길이",
  },
  {
    id: "outseam",
    name: "아웃심",
    category: "하의",
    section: "다리",
    unit: "cm",
    description: "허리에서 발목까지 바깥쪽 길이",
  },

  // 마감재 관련 측정 항목
  {
    id: "sleeve_ribbing_length",
    name: "소매 고무단 길이",
    category: "마감",
    section: "고무단/밴드",
    unit: "cm",
    description: "소매 고무단 길이",
  },
  {
    id: "neck_ribbing_length",
    name: "목 고무단 길이",
    category: "마감",
    section: "고무단/밴드",
    unit: "cm",
    description: "목 고무단 길이",
  },
  {
    id: "bottom_ribbing_length",
    name: "아랫단 고무단 길이",
    category: "마감",
    section: "고무단/밴드",
    unit: "cm",
    description: "아랫단 고무단 길이",
  },
  {
    id: "waistband_width",
    name: "허리밴드 너비",
    category: "마감",
    section: "고무단/밴드",
    unit: "cm",
    description: "허리밴드 너비 측정",
  },

  // 액세서리 관련 측정 항목
  {
    id: "head_circumference",
    name: "머리둘레",
    category: "액세서리",
    section: "모자",
    unit: "cm",
    description: "머리 둘레 측정",
  },
  {
    id: "hood_height",
    name: "후드 높이",
    category: "액세서리",
    section: "후드",
    unit: "cm",
    description: "후드 높이 측정",
  },
  {
    id: "hood_width",
    name: "후드 너비",
    category: "액세서리",
    section: "후드",
    unit: "cm",
    description: "후드 너비 측정",
  },
  {
    id: "pocket_width",
    name: "주머니 너비",
    category: "액세서리",
    section: "주머니",
    unit: "cm",
    description: "주머니 너비 측정",
  },
  {
    id: "pocket_height",
    name: "주머니 높이",
    category: "액세서리",
    section: "주머니",
    unit: "cm",
    description: "주머니 높이 측정",
  },
];

// 측정 항목 카테고리별 그룹핑 (프론트엔드에서 사용)
export const measurementItemsByCategory = () => {
  const grouped: Record<string, MeasurementItemData[]> = {};

  measurementItems.forEach((item) => {
    const category = item.category;
    if (!grouped[category]) {
      grouped[category] = [];
    }
    grouped[category].push(item);
  });

  return grouped;
};

// 기존 측정 항목 배열 (하위 호환성 유지)
export const MEASUREMENT_ITEMS = measurementItems.map((item) => item.name);
export type MeasurementItem = (typeof MEASUREMENT_ITEMS)[number];

// Size Range Types
type SizeRange =
  | "50-53"
  | "54-57"
  | "58-61"
  | "62-65"
  | "66-69"
  | "70-73"
  | "74-79"
  | "80-84"
  | "85-89"
  | "90-94"
  | "95-99"
  | "100-104"
  | "105-109"
  | "110-114"
  | "115-120"
  | "121-129"
  | "min"
  | "max";

// Define size detail types
type SizeDetail = {
  sizeRange: SizeRange;
  measurements: Record<MeasurementItem, number>;
};

export type Template = {
  id: string;
  name: string;
  toolType: ToolType;
  patternType: PatternType;
  thumbnail: string;
  publishStatus: PublishStatus;
  lastModified: string;
  categoryIds: number[];
  constructionMethods?: ConstructionMethod[];
  sleeveType?: SleeveType;
  necklineType?: NecklineType;
  measurementItems?: string[];
  chartTypeIds?: string[]; // 차트 유형 ID 배열로 변경
  measurementRuleId?: string; // Updated Template interface to include link to measurement rule
  sizeDetails?: SizeDetail[]; // 각 사이즈별 세부 치수 정보
};

export type ChartType = {
  id: string;
  name: string;
};

export const chartTypes: ChartType[] = [
  { id: "chart1", name: "앞 몸판" },
  { id: "chart2", name: "뒤 몸판" },
  { id: "chart3", name: "소매" },
  { id: "chart4", name: "카라" },
  { id: "chart5", name: "포켓" },
  { id: "chart6", name: "후드" },
];

// Updated measurement rule type to use both id and name for compatibility
export type MeasurementRule = {
  id: string;
  categoryId: string;
  sleeveType?: SleeveType;
  name: string;
  items: string[]; // 측정 항목 ID 배열로 변경
};

export type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  lastLogin: string;
};

export const users: User[] = [
  {
    id: "1",
    name: "김수지",
    email: "admin@example.com",
    role: "관리자",
    status: "활성",
    lastLogin: "2024-04-10",
  },
  {
    id: "2",
    name: "변수미",
    email: "user@example.com",
    role: "일반",
    status: "활성",
    lastLogin: "2024-04-08",
  },
];
