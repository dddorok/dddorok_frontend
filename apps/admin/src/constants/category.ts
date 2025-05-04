export type Category = {
  id: string;
  parent_id: string | null;
  name: string;
  children?: Category[];
  needFields?: string[];
};

export enum CATEGORY_ID {
  의류 = "의류",
  상의 = "상의",
  하의 = "하의",
  소품류 = "소품류",
  모자류 = "모자류",
  가방류 = "가방류",
  "손/발_ACC" = "손/발 ACC",
  "목/몸_ACC" = "목/몸 ACC",
  기타 = "기타",
  스웨터 = "스웨터",
  가디건 = "가디건",
  바지 = "바지",
  스커트 = "스커트",
  비니 = "비니",
  바라클라바 = "바라클라바",
  숄더백 = "숄더백",
  크로스백 = "크로스백",
  파우치 = "파우치",
  장갑 = "장갑",
  양말 = "양말",
  목도리 = "목도리",
  숄 = "숄",
  인형 = "인형",
}

export const categories: Category[] = [
  {
    id: CATEGORY_ID.의류,
    parent_id: null,
    name: "의류",
    children: [
      {
        id: CATEGORY_ID.상의,
        parent_id: CATEGORY_ID.의류,
        name: "상의",
        needFields: ["sleeveType", "necklineType"],
        children: [
          {
            id: CATEGORY_ID.스웨터,
            parent_id: CATEGORY_ID.상의,
            name: "스웨터",
          },
          {
            id: CATEGORY_ID.가디건,
            parent_id: CATEGORY_ID.상의,
            name: "가디건",
          },
        ],
      },
      {
        id: CATEGORY_ID.하의,
        parent_id: CATEGORY_ID.의류,
        name: "하의",
        children: [
          { id: CATEGORY_ID.바지, parent_id: CATEGORY_ID.하의, name: "바지" },
          {
            id: CATEGORY_ID.스커트,
            parent_id: CATEGORY_ID.하의,
            name: "스커트",
          },
        ],
      },
    ],
  },
  {
    id: CATEGORY_ID.소품류,
    parent_id: null,
    name: "소품류",
    children: [
      {
        id: CATEGORY_ID.모자류,
        parent_id: CATEGORY_ID.소품류,
        name: "모자류",
        children: [
          { id: CATEGORY_ID.비니, parent_id: CATEGORY_ID.모자류, name: "비니" },
          {
            id: CATEGORY_ID.바라클라바,
            parent_id: CATEGORY_ID.모자류,
            name: "바라클라바",
          },
        ],
      },
      {
        id: CATEGORY_ID.가방류,
        parent_id: CATEGORY_ID.소품류,
        name: "가방류",
        children: [
          { id: "311", parent_id: CATEGORY_ID.가방류, name: "숄더백" },
          {
            id: CATEGORY_ID.크로스백,
            parent_id: CATEGORY_ID.가방류,
            name: "크로스백",
          },
          {
            id: CATEGORY_ID.파우치,
            parent_id: CATEGORY_ID.가방류,
            name: "파우치",
          },
        ],
      },
      {
        id: CATEGORY_ID["손/발_ACC"],
        parent_id: CATEGORY_ID.소품류,
        name: "손/발 ACC",
        children: [
          {
            id: CATEGORY_ID.장갑,
            parent_id: CATEGORY_ID["손/발_ACC"],
            name: "장갑",
          },
          {
            id: CATEGORY_ID.양말,
            parent_id: CATEGORY_ID["손/발_ACC"],
            name: "양말",
          },
        ],
      },
      {
        id: CATEGORY_ID["목/몸_ACC"],
        parent_id: CATEGORY_ID.소품류,
        name: "목/몸 ACC",
        children: [
          {
            id: CATEGORY_ID.목도리,
            parent_id: CATEGORY_ID["목/몸_ACC"],
            name: "목도리",
          },
          {
            id: CATEGORY_ID.숄,
            parent_id: CATEGORY_ID["목/몸_ACC"],
            name: "숄",
          },
        ],
      },
      {
        id: CATEGORY_ID.기타,
        parent_id: CATEGORY_ID.소품류,
        name: "기타",
        children: [
          { id: CATEGORY_ID.인형, parent_id: CATEGORY_ID.기타, name: "인형" },
        ],
      },
    ],
  },
] as const;

export const flattenedCategories = (): Category[] => {
  const flattened: Category[] = [];

  const flatten = (cats: Category[]) => {
    for (const cat of cats) {
      flattened.push(cat);
      if (cat.children) {
        flatten(cat.children);
      }
    }
  };

  flatten(categories);
  return flattened;
};

export const getCategoryById = (id: string): Category | undefined => {
  return flattenedCategories().find((c) => c.id === id);
};

export const getParentCategories = (id: string): Category[] => {
  const result: Category[] = [];
  let category = getCategoryById(id);

  while (category?.parent_id) {
    const parent = getCategoryById(category.parent_id);
    if (parent) {
      result.unshift(parent);
      category = parent;
    } else {
      break;
    }
  }

  return result;
};
