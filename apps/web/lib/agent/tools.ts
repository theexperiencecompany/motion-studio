import { tool } from "ai";
import { z } from "zod";

export const tools = {
  getWeather: tool({
    description: "Get the current weather for a location",
    inputSchema: z.object({
      location: z.string().describe("City and country, e.g. 'London, UK'"),
    }),
    execute: async ({ location }) => {
      return { location, temperature: 22, condition: "sunny" };
    },
  }),

  calculator: tool({
    description: "Evaluate a basic math expression",
    inputSchema: z.object({
      expression: z
        .string()
        .describe("Math expression to evaluate, e.g. '2 + 2'"),
    }),
    execute: async ({ expression }) => {
      const result = Function(`"use strict"; return (${expression})`)();
      return { expression, result: result as number };
    },
  }),
};
