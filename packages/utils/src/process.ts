export const executeWithTimeout = async (p: Promise<void>, ms: number) => {
  const timeout = new Promise((resolve, reject) => {
    setTimeout(() => {
      reject(new Error("Timeout"));
    }, ms);
  });

  const result = await Promise.race([timeout, p]);
  return result;
};

export const wait = async (ms: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};

export const executeWithTimeoutAndRetry = async (
  p: Promise<void>,
  ms: number,
  maxRetries: number
) => {
  let retries = 0;
  while (retries < maxRetries) {
    try {
      await executeWithTimeout(p, ms);
      return;
    } catch (err) {
      console.error(err);
      retries++;
      console.log(`Retry ${retries}/${maxRetries} in 20 seconds`);
      await wait(20000);
    }
  }
  throw new Error("Max retries reached");
};
