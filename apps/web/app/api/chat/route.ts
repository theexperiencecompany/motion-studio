import { openai } from "@ai-sdk/openai"
import { streamText, stepCountIs, convertToModelMessages } from "ai"
import { tools } from "@/lib/agent/tools"
import { systemPrompt } from "@/lib/agent/system"

export const maxDuration = 30

export async function POST(req: Request) {
  const { messages } = await req.json()

  const result = streamText({
    model: openai("gpt-4o-mini"),
    system: systemPrompt,
    messages: await convertToModelMessages(messages, { tools }),
    tools,
    stopWhen: stepCountIs(5),
  })

  return result.toUIMessageStreamResponse()
}
