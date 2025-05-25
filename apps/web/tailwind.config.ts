import { colors } from "./style/color";
import { fontSize } from "./style/typo";

import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    colors: colors,

    extend: {
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontSize: fontSize,
      spacing: {
        // gap(4) - 기본 간격
        xs: "4px", // xs
        sm: "8px", // sm
        md: "16px", // md
        lg: "24px", // lg
        xl: "32px", // xl
        "2xl": "48px", // 2xl
        "3xl": "64px", // 3xl

        // gap(2) - 작은 간격
        xxs: "2px", // xxs
        s: "6px", // s
        "md-2": "12px", // md(2)
        mlg: "18px", // mlg

        // gap(10) - 큰 간격
        g10: "10px", // g10
        g20: "20px", // g20
        g30: "30px", // g30
        g40: "40px", // g40
        g50: "50px", // g50
        g60: "60px", // g60
        g70: "70px", // g70
        g80: "80px", // g80
        g90: "90px", // g90
        g100: "100px", // g100
        g110: "110px", // g110
        g120: "120px", // g120
        g130: "130px", // g130
        g140: "140px", // g140
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
