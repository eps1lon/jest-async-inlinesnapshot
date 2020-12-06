const { toMatchSnapshot, toMatchInlineSnapshot } = require("jest-snapshot");

expect.extend({
  async toMatchSpeechInlineSnapshotAsync(fn, ...rest) {
    // Jest uses the stacktraces to find the callsite.
    // For async stacktraces it'll point to the wrapped call
    // i.e. every `toMatchSpeechInlineSnapshotAsync` will point to the same call triggering "Jest: Multiple inline snapshots for the same call are not supported."
    this.error = new Error();
    const result = await fn();
    return toMatchInlineSnapshot.call(this, result, ...rest);
  },
  toMatchSpeechInlineSnapshot(fn, ...args) {
    const result = fn();
    return toMatchInlineSnapshot.call(this, result, ...args);
  },
  async toMatchSpeechSnapshotAsync(fn, ...args) {
    const result = await fn();
    return toMatchSnapshot.call(this, result, ...args);
  },
  toMatchSpeechSnapshot(fn, ...args) {
    const result = fn();
    return toMatchSnapshot.call(this, result, ...args);
  },
});

describe("custom snapshot matcher", () => {
  it("works if sync", () => {
    expect(() => {
      return "sync snapshot #1";
    }).toMatchSpeechSnapshot();

    expect(() => {
      return "sync snapshot #2";
    }).toMatchSpeechSnapshot();
  });

  it("works if async", async () => {
    await expect(async () => {
      return "async snapshot #1";
    }).toMatchSpeechSnapshotAsync();

    await expect(async () => {
      return "async snapshot #2";
    }).toMatchSpeechSnapshotAsync();
  });
});

describe("custom inline snapshot matcher", () => {
  it("works if sync", () => {
    expect(() => {
      return "sync snapshot #1";
    }).toMatchSpeechInlineSnapshot(`"sync snapshot #1"`);

    expect(() => {
      return "sync snapshot #2";
    }).toMatchSpeechInlineSnapshot(`"sync snapshot #2"`);
  });

  it("works if async", async () => {
    await expect(async () => {
      return "async inline snapshot #1";
    }).toMatchSpeechInlineSnapshotAsync(`"async inline snapshot #1"`);
    await expect(async () => {
      return "async inline snapshot #2";
    }).toMatchSpeechInlineSnapshotAsync(`"async inline snapshot #2"`);
  });
});
