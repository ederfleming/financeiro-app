module.exports = {
  root: true,
  extends: ["expo"],
  plugins: ["simple-import-sort"],
  rules: {
    "simple-import-sort/imports": [
      "error",
      {
        groups: [
          // React / RN
          ["^react", "^react-native"],

          // Expo
          ["^expo", "^@expo"],

          // Navigation
          ["^@react-navigation"],

          // Libs externas
          ["^@?\\w"],

          // --- ALIASES (1 linha por pasta) ---
          ["^@/components"],
          ["^@/hooks"],
          ["^@/navigation"],
          ["^@/screens"],
          ["^@/service"],
          ["^@/theme"],
          ["^@/types"],
          ["^@/utils"],

          // Outros aliases genéricos
          ["^@/"],

          // Relativos
          ["^\\.\\.(?!/?$)", "^\\.\\./?$"],
          ["^\\./(?=.*/)", "^\\.(?!/?$)", "^\\./?$"],
        ],
      },
    ],
    "simple-import-sort/exports": "error",
  },
};
