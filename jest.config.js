module.exports = {
  moduleFileExtensions: [
    'js',
    'json'
  ],
  transform: {
    '^.+\\.js$': '<rootDir>/node_modules/babel-jest'
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1'
  },
  testResultsProcessor: process.env.CI ? 'jest-junit' : undefined
}
