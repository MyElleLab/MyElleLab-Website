"use client";

import { Agentation } from "agentation";

/* Visual feedback toolbar for coding agents. Annotations sync to the
   agentation MCP server (.mcp.json) on its default port. Dev only, so
   nothing of it reaches the production site. */
export function AgentationToolbar() {
  if (process.env.NODE_ENV !== "development") return null;
  return <Agentation endpoint="http://localhost:4747" appName="MyElleLab" />;
}
