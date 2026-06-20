const { execSync } = require("child_process");

function installPackages(projectPath, packages) {
  if (!packages.length) return;

  execSync(`npm install ${packages.join(" ")}`, {
    cwd: projectPath,
    stdio: "inherit",
  });
}

module.exports = {
  installPackages,
};
