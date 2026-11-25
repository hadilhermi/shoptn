const { test } = require('node:test');
const assert = require('node:assert/strict');
const { spawn } = require('node:child_process');

async function waitForServer(url, child) {
  for (let attempt = 0; attempt < 80; attempt += 1) {
    if (child.exitCode !== null) throw new Error(`API server exited with ${child.exitCode}`);
    try {
      const response = await fetch(`${url}/api/health`);
      if (response.ok) return response;
    } catch {}
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  throw new Error('API server did not start in time');
}

test('health endpoint reports database and registration/login work', async (t) => {
  assert.ok(process.env.MONGO_URI, 'MONGO_URI must point to the CI MongoDB service');
  const port = 15000 + Math.floor(Math.random() * 20000);
  const baseUrl = `http://127.0.0.1:${port}`;
  const server = spawn(process.execPath, ['server.js'], {
    cwd: process.cwd(),
    env: {
      ...process.env,
      NODE_ENV: 'test',
      PORT: String(port),
      JWT_SECRET: 'test-only-secret-not-for-production',
    },
    stdio: 'ignore',
  });
  t.after(() => { if (server.exitCode === null) server.kill(); });

  const health = await waitForServer(baseUrl, server);
  assert.deepEqual(await health.json().then(({ status, database }) => ({ status, database })), {
    status: 'ok',
    database: 'connected',
  });

  const email = `ci-${Date.now()}@example.invalid`;
  const registration = await fetch(`${baseUrl}/api/auth/register`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ name: 'CI Test User', email, password: 'test-password-123' }),
  });
  assert.equal(registration.status, 201);
  const registered = await registration.json();
  assert.ok(registered.token);
  assert.equal(registered.user.email, email);
  assert.equal(Object.hasOwn(registered.user, 'password'), false);

  const login = await fetch(`${baseUrl}/api/auth/login`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ email, password: 'test-password-123' }),
  });
  assert.equal(login.status, 200);
  assert.ok((await login.json()).token);
});
