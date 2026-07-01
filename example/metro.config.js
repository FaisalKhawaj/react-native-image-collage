const path = require("path");
const { getDefaultConfig } = require("expo/metro-config");

const projectRoot = __dirname;
const packageRoot = path.resolve(projectRoot, "..");
const exampleNodeModules = path.resolve(projectRoot, "node_modules");

const config = getDefaultConfig(projectRoot);

config.watchFolders = [packageRoot];
config.resolver.nodeModulesPaths = [exampleNodeModules];

// Never use the library package's devDependency tree.
const parentNodeModules = path.join(packageRoot, "node_modules");
config.resolver.blockList = [
  ...(Array.isArray(config.resolver.blockList)
    ? config.resolver.blockList
    : [config.resolver.blockList].filter(Boolean)),
  new RegExp(`${escapeRegExp(parentNodeModules)}[\\/].*`),
];

// Prevents Hermes runtime errors from Metro resolving untranspiled ESM builds.
config.resolver.unstable_enablePackageExports = false;

// Subpath exports are disabled when unstable_enablePackageExports is false.
// Resolve built library entry points explicitly (run `npm run build` in package root).
const libraryEntries = {
  "react-native-image-collage": path.join(packageRoot, "dist/index.js"),
  "react-native-image-collage/viewer": path.join(
    packageRoot,
    "dist/viewer/index.js",
  ),
  "react-native-image-collage/expo": path.join(packageRoot, "dist/expo/index.js"),
};

const defaultResolveRequest = config.resolver.resolveRequest;

config.resolver.resolveRequest = (context, moduleName, platform) => {
  const libraryEntry = libraryEntries[moduleName];
  if (libraryEntry) {
    return {
      type: "sourceFile",
      filePath: libraryEntry,
    };
  }

  if (defaultResolveRequest) {
    return defaultResolveRequest(context, moduleName, platform);
  }

  return context.resolveRequest(context, moduleName, platform);
};

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

module.exports = config;
