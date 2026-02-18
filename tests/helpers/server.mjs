import { once } from "node:events";
import { spawn } from "node:child_process";
import { setTimeout as sleep } from "node:timers/promises";

function randomPort() {
  return Math.floor(Math.random() * 1000) + 5600;
}

export async function startServer() {
  const port = randomPort();
  const child = spawn(
    process.execPath,
    ["--env-file=.env", "--import", "tsx", "server/index.ts"],
    {
      cwd: process.cwd(),
      env: {
        ...process.env,
        NODE_ENV: "development",
        PORT: String(port),
      },
      stdio: ["ignore", "pipe", "pipe"],
    },
  );

  let output = "";
  child.stdout.on("data", (chunk) => {
    output += chunk.toString();
  });
  child.stderr.on("data", (chunk) => {
    output += chunk.toString();
  });

  const baseUrl = `http://127.0.0.1:${port}`;
  const deadline = Date.now() + 45_000;

  while (Date.now() < deadline) {
    if (child.exitCode !== null) {
      throw new Error(`Server exited early with code ${child.exitCode}\n${output}`);
    }

    try {
      const response = await fetch(`${baseUrl}/health`);
      if (response.ok) {
        return { child, baseUrl, getOutput: () => output };
      }
    } catch {
      // Ignore until server becomes reachable.
    }

    await sleep(500);
  }

  await stopServer({ child });
  throw new Error(`Server failed to start within timeout\n${output}`);
}

export async function stopServer(server) {
  if (!server?.child || server.child.exitCode !== null) {
    return;
  }

  server.child.kill();

  try {
    await Promise.race([once(server.child, "exit"), sleep(5_000)]);
  } catch {
    // Ignore and force-kill below if still running.
  }

  if (server.child.exitCode === null) {
    server.child.kill("SIGKILL");
    await once(server.child, "exit");
  }
}
