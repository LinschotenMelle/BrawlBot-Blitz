import { createClient } from "@hey-api/openapi-ts";

createClient({
  client: "@hey-api/client-axios",
  input: "http://localhost:3001/api/docs-json",
  output: "src/client",
});
