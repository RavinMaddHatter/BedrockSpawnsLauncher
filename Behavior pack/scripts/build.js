require("esbuild").build({
    entryPoints: ["test.jsx"],
    external: ["mojang-minecraft", "mojang-net", "mojang-minecraft-server-admin"],
    target: "es2020",
    format: "esm",
    bundle: true,
    outfile: "test.js"
  });