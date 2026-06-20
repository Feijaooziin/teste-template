#!/usr/bin/env node

const prompts = require("prompts");
const degit = require("degit").default;
const fs = require("fs-extra");
const path = require("path");
const { default: ora } = require("ora");
const { execSync } = require("child_process");
const { installPackages } = require("./helpers/installDependencies");
const { setupNativeWind } = require("./helpers/setupNativeWind");
const {
  createDrawer,
  createTabs,
  createUtils,
} = require("./helpers/createDirectories");

async function main() {
  console.log("\n🚀 Create Leo App\n");

  const response = await prompts([
    {
      type: "text",
      name: "appName",
      message: "Nome do aplicativo:",
    },
    {
      type: "confirm",
      name: "useAsyncStorage",
      message: "Usar Async Storage?",
      initial: true,
    },
    {
      type: "confirm",
      name: "useZod",
      message: "Usar Zod?",
      initial: true,
    },
    {
      type: "confirm",
      name: "useNativeWind",
      message: "Usar NativeWind?",
      initial: true,
    },
    {
      type: "confirm",
      name: "useDrawer",
      message: "Usar Drawer?",
      initial: true,
    },
    {
      type: "confirm",
      name: "useTabs",
      message: "Usar Tabs?",
      initial: true,
    },
  ]);

  if (!response.appName) {
    console.log("❌ Nome inválido");
    process.exit(1);
  }

  const appName = response.appName;

  const spinner = ora("Baixando template...").start();

  const dependencies = [];

  if (response.useZod) {
    dependencies.push("zod");
  }

  if (response.useAsyncStorage) {
    dependencies.push("@react-native-async-storage/async-storage");
  }

  if (response.useNativeWind) {
    dependencies.push("nativewind", "tailwindcss");
  }

  try {
    const emitter = degit("Feijaooziin/teste-template", {
      cache: false,
      force: true,
      verbose: false,
    });

    await emitter.clone(appName);

    spinner.succeed("Template copiado");
  } catch (error) {
    spinner.fail("Erro ao baixar template");

    console.error(error);

    process.exit(1);
  }

  await replacePlaceholders(appName);

  await createConfigFile(appName, response);

  await createUtils(appName);

  if (response.useDrawer) {
    await createDrawer(appName);
  }

  if (response.useTabs) {
    await createTabs(appName);
  }

  if (response.useNativeWind) {
    await setupNativeWind(appName);
  }

  if (response.useZod) {
    dependencies.push("zod");
  }

  if (response.useAsyncStorage) {
    dependencies.push("@react-native-async-storage/async-storage");
  }

  if (response.useNativeWind) {
    dependencies.push("nativewind", "tailwindcss");
  }

  if (dependencies.length) {
    installPackages(appName, dependencies);
  }

  const installSpinner = ora("Instalando dependências...").start();

  try {
    if (dependencies.length) {
      installPackages(appName, dependencies);
    }

    installSpinner.succeed("Dependências instaladas");
  } catch (error) {
    installSpinner.fail("Erro ao instalar dependências");

    console.error(error);

    process.exit(1);
  }

  console.log(`
🎉 Projeto criado com sucesso!

📁 Projeto: ${appName}

cd ${appName}
npx expo start
`);
}

async function replacePlaceholders(appName) {
  const slug = createSlug(appName);

  const files = ["app.json", "package.json", "README.md"];

  for (const file of files) {
    const filePath = path.join(appName, file);

    if (!(await fs.pathExists(filePath))) {
      continue;
    }

    let content = await fs.readFile(filePath, "utf8");

    content = content.replace(/__APP_NAME__/g, appName);

    content = content.replace(/__APP_SLUG__/g, slug);

    await fs.writeFile(filePath, content);
  }
}

async function createConfigFile(appName, config) {
  const settings = {
    appName: config.appName,
    slug: createSlug(config.appName),
    asyncStorage: config.useAsyncStorage,
    zod: config.useZod,
    nativeWind: config.useNativeWind,
    drawer: config.useDrawer,
    tabs: config.useTabs,
  };

  await fs.writeJson(path.join(appName, "leo.config.json"), settings, {
    spaces: 2,
  });
}

function createSlug(text) {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, "")
    .replace(/\s+/g, "-");
}

main();
