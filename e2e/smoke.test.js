const { Builder, By, until } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");

const FRONTEND_URL = process.env.FRONTEND_URL;
const BACKEND_URL = process.env.BACKEND_URL;

const results = [];

// -----------------------------
// TEST CHECK FUNCTION
// -----------------------------

async function check(name, fn) {
  const start = Date.now();

  try {
    await fn();

    console.log(
      `✅ PASS (${Date.now() - start}ms) ${name}`
    );

    results.push({
      name,
      passed: true
    });

  } catch (err) {

    console.log(
      `❌ FAIL (${Date.now() - start}ms) ${name}`
    );

    console.log(`   → ${err.message}`);

    results.push({
      name,
      passed: false
    });
  }
}

// -----------------------------
// MAIN FUNCTION
// -----------------------------

async function main() {

  // -----------------------------
  // CHECK ENVIRONMENT VARIABLES
  // -----------------------------

  if (!FRONTEND_URL || !BACKEND_URL) {

    console.error(
      "Missing FRONTEND_URL or BACKEND_URL."
    );

    process.exit(1);
  }

  // -----------------------------
  // BACKEND TEST 1
  // -----------------------------

  await check(
    "Backend root endpoint responds",
    async () => {

      const res = await fetch(
        `${BACKEND_URL}/`
      );

      if (res.status !== 200) {

        throw new Error(
          `Expected 200, got ${res.status}`
        );
      }

      const body = await res.json();

      if (!body.message) {

        throw new Error(
          "No message field in response"
        );
      }
    }
  );

  // -----------------------------
  // BACKEND TEST 2
  // -----------------------------

  await check(
    "Backend products API returns a list",
    async () => {

      const res = await fetch(
        `${BACKEND_URL}/api/products`
      );

      if (res.status !== 200) {

        throw new Error(
          `Expected 200, got ${res.status}`
        );
      }

      const body = await res.json();

      if (!Array.isArray(body)) {

        throw new Error(
          "Expected products API to return an array"
        );
      }
    }
  );

  // -----------------------------
  // SELENIUM FRONTEND TESTS
  // -----------------------------

  let driver;

  try {

    // -----------------------------
    // CHROME OPTIONS
    // -----------------------------

   const options = new chrome.Options();

options.addArguments("--headless=new");
options.addArguments("--no-sandbox");
options.addArguments("--disable-dev-shm-usage");

options.addArguments("--disable-gpu");
options.addArguments("--disable-software-rasterizer");
options.addArguments("--disable-gpu-compositing");

options.addArguments("--disable-logging");
options.addArguments("--log-level=3");

options.addArguments("--disable-background-networking");
options.addArguments("--disable-component-update");
options.addArguments("--disable-sync");
options.addArguments("--disable-default-apps");
options.addArguments("--no-first-run");

    // -----------------------------
    // CHROME DRIVER SERVICE
    // -----------------------------

    const service = new chrome.ServiceBuilder()
  .setStdio("ignore");
    // -----------------------------
    // CREATE SELENIUM DRIVER
    // -----------------------------

    driver = await new Builder()
      .forBrowser("chrome")
      .setChromeOptions(options)
      .setChromeService(service)
      .build();

    // -----------------------------
    // FRONTEND TEST 1
    // -----------------------------

    await check(
      "Unauthenticated user is redirected to login",
      async () => {

        await driver.get(FRONTEND_URL);

        await driver.wait(
          until.urlContains("/login"),
          10000
        );

        const currentUrl =
          await driver.getCurrentUrl();

        if (!currentUrl.includes("/login")) {

          throw new Error(
            `Expected login page, but got ${currentUrl}`
          );
        }
      }
    );

    // -----------------------------
    // FRONTEND TEST 2
    // -----------------------------

    await check(
      "Login page renders email, password and submit",
      async () => {

        await driver.get(
          `${FRONTEND_URL}/login`
        );

        // Email field
        await driver.wait(
          until.elementLocated(
            By.name("email")
          ),
          10000
        );

        // Password field
        await driver.findElement(
          By.name("password")
        );

        // Submit button
        await driver.findElement(
          By.css("button[type='submit']")
        );
      }
    );

  } finally {

    // -----------------------------
    // CLOSE BROWSER
    // -----------------------------

    if (driver) {
      await driver.quit();
    }
  }

  // -----------------------------
  // FINAL RESULT
  // -----------------------------

  const failed = results.filter(
    (result) => !result.passed
  );

  const passed =
    results.length - failed.length;

  console.log(
    `\n${passed}/${results.length} checks passed`
  );

  // -----------------------------
  // FAIL IF ANY TEST FAILED
  // -----------------------------

  if (failed.length > 0) {
    process.exit(1);
  }
}

// -----------------------------
// HANDLE UNEXPECTED ERRORS
// -----------------------------

main().catch((err) => {

  console.error(
    "Smoke test runner crashed:",
    err
  );

  process.exit(1);
});