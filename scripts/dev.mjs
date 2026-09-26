import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");

function run(command, args, label, env = {}) {
  const child = spawn(command, args, {
    cwd: projectRoot,
    stdio: "inherit",
    shell: true,
    env: { ...process.env, ...env, FORCE_COLOR: "1" },
  });

  child.on("exit", (code, signal) => {
    if (signal) {
      console.error(`${label} exited with signal ${signal}`);
      process.exit(1);
    }

    if (code !== 0) {
      console.error(`${label} exited with code ${code}`);
      process.exit(code ?? 1);
    }
  });

  return child;
}

const vite = run("npx", ["vite", "--host"], "vite");
const api = run("npx", ["tsx", "watch", "server/index.ts"], "api", { PORT: "3001" });

const shutdown = () => {
  vite.kill("SIGTERM");
  api.kill("SIGTERM");
  process.exit(0);
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
