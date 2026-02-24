module.exports = {
  default: {
    requireModule: ['ts-node/register'],
    require: ['src/**/*.ts'],
    format: ['allure-cucumberjs/reporter'],
    parallel: 2,
    paths: ['features/**/*.feature']
  }
};