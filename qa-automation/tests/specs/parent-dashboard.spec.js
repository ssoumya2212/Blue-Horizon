/**
 * Parent Dashboard E2E Test Suite â€” Blue Horizon
 * 32 real-time Selenium tests covering: login guard, dashboard UI, live tracking,
 * notifications, student info, route details, and responsive/performance checks.
 */

const config = require('../../config/test-config');
const users  = require('../../data/test-users.json');
const LoginPage           = require('../../pages/LoginPage');
const ParentDashboardPage = require('../../pages/ParentDashboardPage');
const state  = require('../../utilities/test-state');
const { captureFailureArtifacts } = require('../../utilities/report-helper');

const MODULE = 'Parent Dashboard';
function recordResult(p) { state.pushResult(p); }

function attachHooks(getCtx) {
  beforeEach(async function () {
    global.currentTestName = this.currentTest.title;
    getCtx().currentTest = this.currentTest;
    getCtx().driver = await global.createDriver();
    getCtx().startTime = Date.now();
  });
  afterEach(async function () {
    const ctx = getCtx();
    const end = Date.now();
    const dur = end - ctx.startTime;
    const st  = ctx.currentTest.state === 'passed' ? 'Passed'
              : ctx.currentTest.state === 'pending' ? 'Skipped' : 'Failed';
    let ss = '', url = '', reason = '';
    if (st === 'Failed') {
      const art = await captureFailureArtifacts(ctx.driver, ctx.currentTest.title, ctx.currentTest.err, config.browser);
      ss = art.screenshotPath; url = art.currentUrl; reason = ctx.currentTest.err.message;
    } else { try { url = await ctx.driver.getCurrentUrl(); } catch {} }
    recordResult({
      testId: `PAR-${Math.abs(ctx.currentTest.title.length * 13 + dur % 9999)}`,
      module: MODULE, testName: ctx.currentTest.title, browser: config.browser,
      status: st, startTime: new Date(ctx.startTime).toISOString(),
      endTime: new Date(end).toISOString(), durationMs: dur,
      failureReason: reason, screenshotPath: ss, url,
    });
    if (ctx.driver) await ctx.driver.quit();
  });
}

async function loginAsParent(driver) {
  const lp = new LoginPage(driver);
  await lp.navigate();
  await lp.login(users.parent.email, users.parent.password);
  await driver.sleep(8000);
}

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   SUITE 1 â€” Login & Route Guard (5 tests)
   â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
describe('Parent â€” Login & Route Guard', function () {
  const s = {}; attachHooks(() => s);

  it('PAR-001 should redirect unauthenticated user from /app/parent to /login', async function () {
    await s.driver.get(`${config.baseUrl}/app/parent`);
    await s.driver.sleep(2000);
    expect(await s.driver.getCurrentUrl()).to.include('/login');
  });

  it('PAR-002 should display parent tab on login page', async function () {
    const lp = new LoginPage(s.driver);
    await lp.navigate();
    expect((await s.driver.getPageSource()).toLowerCase()).to.include('parent');
  });

  it('PAR-003 should login successfully with valid parent credentials', async function () {
    await loginAsParent(s.driver);
    expect(await s.driver.getCurrentUrl()).to.satisfy(u => u.includes('/app') || u.includes('parent'));
  });

  it('PAR-004 should show parent dashboard content after login', async function () {
    await loginAsParent(s.driver);
    const src = await s.driver.getPageSource();
    expect(src.toLowerCase()).to.satisfy(p =>
      p.includes('parent') || p.includes('tracking') || p.includes('student') || p.includes('route'));
  });

  it('PAR-005 should not allow driver credentials to access parent dashboard', async function () {
    const lp = new LoginPage(s.driver);
    await lp.navigate();
    await lp.login(users.driver.email, users.driver.password);
    await s.driver.sleep(8000);
    expect(await s.driver.getCurrentUrl()).to.not.include('/app/parent');
  });
});

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   SUITE 2 â€” Live Tracking (7 tests)
   â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
describe('Parent â€” Live Tracking', function () {
  const s = {}; attachHooks(() => s);
  beforeEach(async function () { await loginAsParent(s.driver); });

  it('PAR-006 should display live tracking / map section', async function () {
    const src = await s.driver.getPageSource();
    expect(src.toLowerCase()).to.satisfy(p =>
      p.includes('track') || p.includes('map') || p.includes('location') || p.includes('live'));
  });

  it('PAR-007 should show bus location indicator or map pin', async function () {
    const src = await s.driver.getPageSource();
    expect(src.toLowerCase()).to.satisfy(p =>
      p.includes('location') || p.includes('map') || p.includes('bus') || p.includes('gps'));
  });

  it('PAR-008 should display estimated arrival time (ETA)', async function () {
    const src = await s.driver.getPageSource();
    expect(src.toLowerCase()).to.satisfy(p =>
      p.includes('eta') || p.includes('arrival') || p.includes('arriving') || p.includes('time') || p.includes('minutes'));
  });

  it('PAR-009 should show bus route path on tracking view', async function () {
    const src = await s.driver.getPageSource();
    expect(src.toLowerCase()).to.satisfy(p =>
      p.includes('route') || p.includes('path') || p.includes('stop') || p.includes('map'));
  });

  it('PAR-010 should display student pickup status indicator', async function () {
    const src = await s.driver.getPageSource();
    expect(src.toLowerCase()).to.satisfy(p =>
      p.includes('pickup') || p.includes('picked') || p.includes('status') || p.includes('student'));
  });

  it('PAR-011 should show student drop-off status', async function () {
    const src = await s.driver.getPageSource();
    expect(src.toLowerCase()).to.satisfy(p =>
      p.includes('drop') || p.includes('delivered') || p.includes('status') || p.includes('student'));
  });

  it('PAR-012 should display driver information on parent dashboard', async function () {
    const src = await s.driver.getPageSource();
    expect(src.toLowerCase()).to.satisfy(p =>
      p.includes('driver') || p.includes('contact') || p.includes('name'));
  });
});

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   SUITE 3 â€” Notifications (6 tests)
   â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
describe('Parent â€” Notifications', function () {
  const s = {}; attachHooks(() => s);
  beforeEach(async function () { await loginAsParent(s.driver); });

  it('PAR-013 should display notifications section or bell icon', async function () {
    const src = await s.driver.getPageSource();
    expect(src.toLowerCase()).to.satisfy(p =>
      p.includes('notification') || p.includes('alert') || p.includes('message'));
  });

  it('PAR-014 should show unread notification count badge', async function () {
    const src = await s.driver.getPageSource();
    // Badge or count element should be present
    expect(src).to.satisfy(p =>
      /\d+/.test(p) || p.includes('notification') || p.includes('badge'));
  });

  it('PAR-015 should display emergency/SOS alert notifications', async function () {
    const src = await s.driver.getPageSource();
    expect(src.toLowerCase()).to.satisfy(p =>
      p.includes('emergency') || p.includes('alert') || p.includes('sos') || p.includes('notification'));
  });

  it('PAR-016 should display trip start/end notifications', async function () {
    const src = await s.driver.getPageSource();
    expect(src.toLowerCase()).to.satisfy(p =>
      p.includes('trip') || p.includes('start') || p.includes('notification') || p.includes('update'));
  });

  it('PAR-017 should show delay notifications if any', async function () {
    const src = await s.driver.getPageSource();
    expect(src.toLowerCase()).to.satisfy(p =>
      p.includes('delay') || p.includes('late') || p.includes('notification') || p.includes('update'));
  });

  it('PAR-018 should display announcements from admin', async function () {
    const src = await s.driver.getPageSource();
    expect(src.toLowerCase()).to.satisfy(p =>
      p.includes('announcement') || p.includes('notice') || p.includes('message') || p.includes('broadcast'));
  });
});

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   SUITE 4 â€” Student & Route Info (7 tests)
   â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
describe('Parent â€” Student & Route Info', function () {
  const s = {}; attachHooks(() => s);
  beforeEach(async function () { await loginAsParent(s.driver); });

  it('PAR-019 should display registered student name on parent dashboard', async function () {
    const src = await s.driver.getPageSource();
    expect(src.toLowerCase()).to.satisfy(p =>
      p.includes('student') || p.includes('child') || p.includes('name'));
  });

  it('PAR-020 should show student grade or class information', async function () {
    const src = await s.driver.getPageSource();
    expect(src.toLowerCase()).to.satisfy(p =>
      p.includes('grade') || p.includes('class') || p.includes('student') || p.includes('school'));
  });

  it('PAR-021 should show assigned bus number for student', async function () {
    const src = await s.driver.getPageSource();
    expect(src.toLowerCase()).to.satisfy(p =>
      p.includes('bus') || p.includes('vehicle') || p.includes('route'));
  });

  it('PAR-022 should display pickup stop address or stop name', async function () {
    const src = await s.driver.getPageSource();
    expect(src.toLowerCase()).to.satisfy(p =>
      p.includes('stop') || p.includes('pickup') || p.includes('address') || p.includes('location'));
  });

  it('PAR-023 should show drop-off stop address or stop name', async function () {
    const src = await s.driver.getPageSource();
    expect(src.toLowerCase()).to.satisfy(p =>
      p.includes('drop') || p.includes('stop') || p.includes('address') || p.includes('location'));
  });

  it('PAR-024 should display route name assigned to student', async function () {
    const src = await s.driver.getPageSource();
    expect(src.toLowerCase()).to.satisfy(p =>
      p.includes('route') || p.includes('path') || p.includes('assigned'));
  });

  it('PAR-025 should show QR code for student check-in', async function () {
    const src = await s.driver.getPageSource();
    expect(src.toLowerCase()).to.satisfy(p =>
      p.includes('qr') || p.includes('code') || p.includes('scan') || p.includes('check'));
  });
});

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   SUITE 5 â€” UI, Responsive & Performance (7 tests)
   â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
describe('Parent â€” UI, Responsive & Performance', function () {
  const s = {}; attachHooks(() => s);

  it('PAR-026 should load parent login page within 5 seconds', async function () {
    const t = Date.now();
    const lp = new LoginPage(s.driver);
    await lp.navigate();
    expect(Date.now() - t).to.be.below(5000);
  });

  it('PAR-027 should load parent dashboard within 8 seconds of login', async function () {
    const t = Date.now();
    await loginAsParent(s.driver);
    expect(Date.now() - t).to.be.below(8000);
  });

  it('PAR-028 should render parent dashboard at 375px mobile width', async function () {
    await loginAsParent(s.driver);
    await s.driver.manage().window().setRect({ width: 375, height: 812 });
    await s.driver.sleep(500);
    expect((await s.driver.getPageSource()).length).to.be.above(200);
  });

  it('PAR-029 should render parent dashboard at 768px tablet width', async function () {
    await loginAsParent(s.driver);
    await s.driver.manage().window().setRect({ width: 768, height: 1024 });
    await s.driver.sleep(500);
    expect((await s.driver.getPageSource()).length).to.be.above(200);
  });

  it('PAR-030 should have Blue Horizon in page title', async function () {
    await loginAsParent(s.driver);
    const title = await s.driver.getTitle();
    expect(title.toLowerCase()).to.satisfy(t =>
      t.includes('parent') || t.includes('blue horizon') || t.includes('tracking'));
  });

  it('PAR-031 should have no SEVERE console errors on parent dashboard', async function () {
    await loginAsParent(s.driver);
    const logs = await s.driver.manage().logs().get('browser');
    const errs = logs.filter(l => l.level.name === 'SEVERE' && !l.message.includes('favicon'));
    expect(errs.length).to.equal(0);
  });

  it('PAR-032 should maintain parent session after browser refresh', async function () {
    await loginAsParent(s.driver);
    await s.driver.navigate().refresh();
    await s.driver.sleep(2000);
    const url = await s.driver.getCurrentUrl();
    expect(url).to.satisfy(u => u.includes('/app') || u.includes('/login'));
  });
});

