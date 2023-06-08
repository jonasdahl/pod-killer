import {
  autoDetectClient,
  CoreV1Api,
  serve,
  Status,
  STATUS_TEXT,
} from "./deps.ts";

const port = Number(Deno.env.get("PORT") ?? 8080);
const key = Deno.env.get("KEY");
const namespace = Deno.env.get("NAMESPACE");
const labelSelector = Deno.env.get("LABEL_SELECTOR");

if (!key) {
  throw new Error("No KEY env var set");
}

if (!namespace) {
  throw new Error("No NAMESPACE env var set");
}

if (!labelSelector) {
  throw new Error("No LABEL_SELECTOR env var set");
}

console.log("Config:", { port, key, namespace, labelSelector });

const kubernetes = await autoDetectClient();
const coreApi = new CoreV1Api(kubernetes);

// Set up HTTP handler
const handler = async (request: Request) => {
  const headerKey = request.headers
    .get("authorization")
    ?.replace(/bearer\s*/i, "");

  if (request.method !== "POST") {
    return response(Status.MethodNotAllowed);
  }
  if (!headerKey) {
    return response(Status.Unauthorized);
  }
  if (headerKey !== key) {
    return response(Status.Forbidden);
  }

  const res = await coreApi
    .namespace(namespace)
    .deletePodList({ labelSelector });

  console.log(
    "Deleted",
    res.items.length,
    "pods:",
    res.items.map((i) => i.metadata?.name)
  );

  return new Response("Ok: " + res.items.length, {
    status: 200,
    statusText: "Ok",
  });
};

await serve(handler, { port });

function response(status: Status) {
  return new Response(STATUS_TEXT[status], {
    status,
    statusText: STATUS_TEXT[status],
  });
}
