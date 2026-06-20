const fs = require("fs-extra");
const path = require("path");

async function createDrawer(appName) {
  await fs.ensureDir(path.join(appName, "app", "(drawer)"));
}

async function createTabs(appName) {
  await fs.ensureDir(path.join(appName, "app", "(tabs)"));
}

async function createUtils(appName) {
  const utilsPath = path.join(appName, "src", "utils");

  await fs.ensureDir(utilsPath);

  await fs.writeFile(path.join(utilsPath, "index.ts"), "");
}

module.exports = {
  createDrawer,
  createTabs,
  createUtils,
};
