export type Category = {
  id: string;
  parent_id: string | null;
  name: string;
  children?: Category[];
  needFields?: string[];
};

export enum CATEGORY_ID {
  의류 = "1",
  상의 = "10",
  하의 = "11",
  소품류 = "2",
  모자류 = "20",
  가방류 = "21",
  "손/발_ACC" = "22",
  "목/몸_ACC" = "23",
  기타 = "24",
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
        needFields: ["sleeveType"],
        children: [
          { id: "103", parent_id: CATEGORY_ID.상의, name: "스웨터" },
          { id: "104", parent_id: CATEGORY_ID.상의, name: "가디건" },
        ],
      },
      {
        id: CATEGORY_ID.하의,
        parent_id: CATEGORY_ID.의류,
        name: "하의",
        children: [
          { id: "201", parent_id: CATEGORY_ID.하의, name: "바지" },
          { id: "202", parent_id: CATEGORY_ID.하의, name: "스커트" },
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
          { id: "301", parent_id: CATEGORY_ID.모자류, name: "비니" },
          { id: "302", parent_id: CATEGORY_ID.모자류, name: "바라클라바" },
        ],
      },
      {
        id: CATEGORY_ID.가방류,
        parent_id: CATEGORY_ID.소품류,
        name: "가방류",
        children: [
          { id: "311", parent_id: CATEGORY_ID.가방류, name: "숄더백" },
          { id: "312", parent_id: CATEGORY_ID.가방류, name: "크로스백" },
          { id: "313", parent_id: CATEGORY_ID.가방류, name: "파우치" },
        ],
      },
      {
        id: CATEGORY_ID["손/발_ACC"],
        parent_id: CATEGORY_ID.소품류,
        name: "손/발 ACC",
        children: [
          { id: "321", parent_id: CATEGORY_ID["손/발_ACC"], name: "장갑" },
          { id: "322", parent_id: CATEGORY_ID["손/발_ACC"], name: "양말" },
        ],
      },
      {
        id: CATEGORY_ID["목/몸_ACC"],
        parent_id: CATEGORY_ID.소품류,
        name: "목/몸 ACC",
        children: [
          { id: "331", parent_id: CATEGORY_ID["목/몸_ACC"], name: "목도리" },
          { id: "332", parent_id: CATEGORY_ID["목/몸_ACC"], name: "숄" },
        ],
      },
      {
        id: CATEGORY_ID.기타,
        parent_id: CATEGORY_ID.소품류,
        name: "기타",
        children: [{ id: "341", parent_id: CATEGORY_ID.기타, name: "인형" }],
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
