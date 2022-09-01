export default {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
  testEnvironment: "jsdom",
  moduleNameMapper: {
    "\\.(css|less)$": "identity-obj-proxy"
  }
};
