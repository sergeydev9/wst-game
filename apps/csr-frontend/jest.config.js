module.exports = {
  displayName: 'csr-frontend',
  preset: '../../jest.preset.js',
  transform: {
    '^(?!.*\\.(js|jsx|ts|tsx|css|json)$)': '@nrwl/react/plugins/jest',
    '^.+\\.(ts|tsx)?$': 'ts-jest',
    "^.+\\.(js|jsx)$": "babel-jest",
    ".+\\.(styl|less|sass|scss|png|jpg|ttf|woff|woff2|svg)$": "jest-transform-stub"

  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'svg'],
  coverageDirectory: '../../coverage/apps/csr-frontend',
};
