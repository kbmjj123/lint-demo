module.exports = {
  root: true,
  env: {
    node: true,
    es6: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:vue/essential',
    'plugin:prettier/recommended',
  ],
  plugins: ['prettier'],
  parserOptions: {
    parser: 'babel-eslint',
  },
  rules: {
    'no-unused-vars': 'warn',
    'vue/multi-word-component-names': 'warn',
    'vue/valid-v-for': 'warn',
    'no-useless-escape': 'warn',
  },
}
