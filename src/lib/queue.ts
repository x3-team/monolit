import { Queue, Worker } from "bullmq";
import IORedis from "ioredis";
import { processDocumentJob } from "@/lib/document-processor";

const QUEUE_NAME = "smartdoc-documents";

type QueueMode = "bullmq" | "inline";

let mode: QueueMode = "inline";
let connection: IORedis | null = null;
let queue: Queue | null = null;
let worker: Worker | null = null;
let bootstrapped = false;

async function tryConnectRedis() {
  const url = process.env.REDIS_URL;
  if (!url) return null;

  const redis = new IORedis(url, {
    maxRetriesPerRequest: null,
    enableReadyCheck: true,
    lazyConnect: true,
  });

  try {
    await redis.connect();
    await redis.ping();
    return redis;
  } catch {
    try {
      redis.disconnect();
    } catch {
      // ignore
    }
    return null;
  }
}

async function ensureQueue() {
  if (bootstrapped) return;
  bootstrapped = true;

  connection = await tryConnectRedis();
  if (!connection) {
    mode = "inline";
    console.warn("[SmartDoc] Redis unavailable — using inline processing queue");
    return;
  }

  mode = "bullmq";
  queue = new Queue(QUEUE_NAME, { connection });
  worker = new Worker(
    QUEUE_NAME,
    async (job) => {
      await processDocumentJob(String(job.data.documentId));
    },
    {
      connection,
      concurrency: 2,
      limiter: {
        max: 5,
        duration: 1000,
      },
    }
  );

  worker.on("failed", (job, err) => {
    console.error(`[SmartDoc] Job ${job?.id} failed:`, err.message);
  });
}

export async function enqueueDocumentProcessing(documentId: string) {
  await ensureQueue();

  if (mode === "inline" || !queue) {
    // Fire-and-forget with microtask so API can return quickly
    setTimeout(() => {
      processDocumentJob(documentId).catch((err) => {
        console.error("[SmartDoc] Inline processing failed:", err);
      });
    }, 0);
    return { mode: "inline" as const };
  }

  await queue.add(
    "process-document",
    { documentId },
    {
      attempts: 3,
      backoff: { type: "exponential", delay: 2000 },
      removeOnComplete: 100,
      removeOnFail: 200,
    }
  );

  return { mode: "bullmq" as const };
}
