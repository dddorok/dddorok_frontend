import { CATEGORY_ID } from "@/constants/category";
import { NECKLINE, NecklineType, SLEEVE, SleeveType } from "@/constants/top";

export const 치수규칙_이름_셍성 = (request: {
  categoryLevel2: string;
  category3Name: string;
  sleeveType: SleeveType;
  necklineType: NecklineType;
}) => {
  const { categoryLevel2, sleeveType, necklineType, category3Name } = request;
  switch (categoryLevel2) {
    // - 상의: `넥라인 + 소매 유형 + 소분류`
    case CATEGORY_ID.상의: {
      if (!necklineType || !sleeveType || !category3Name) {
        return null;
      }
      if (necklineType === "NONE" || sleeveType === "NONE") {
        return null;
      }

      const necklineLabel = NECKLINE[necklineType]?.label;
      const sleeveLabel = SLEEVE[sleeveType]?.label;

      return [necklineLabel, sleeveLabel, category3Name]
        .filter(Boolean)
        .join(" ");
    }
    // - 그 외: `소분류명`
    default:
      return category3Name;
  }
};
