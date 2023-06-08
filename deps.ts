export {
  STATUS_TEXT,
  Status,
} from "https://deno.land/std@0.148.0/http/http_status.ts";
export { serve } from "https://deno.land/std@0.190.0/http/server.ts";
export { CoreV1Api } from "https://deno.land/x/kubernetes_apis/builtin/core@v1/mod.ts";
export { autoDetectClient } from "https://deno.land/x/kubernetes_client@v0.5.0/mod.ts";
