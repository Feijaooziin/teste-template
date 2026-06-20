const fs = require("fs-extra");
const path = require("path");

async function setupNativeWind(appName) {
  const content = `
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
`;

  await fs.writeFile(path.join(appName, "tailwind.config.js"), content);
}

module.exports = {
  setupNativeWind,
};
