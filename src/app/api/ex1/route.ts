import { LangChainAdapter } from "ai";
import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";

// Allow streaming responses up to 60 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  // Get the last user message
  const message = messages.at(-1).content;

  // Create a prompt template
  const prompt = PromptTemplate.fromTemplate("{message}");

  // Initialize the OpenAI model
  const model = new ChatOpenAI({
    model: "gpt-4o-mini",
    temperature: 0.8,
    streaming: true,
  });

  // Generate the full prompt to send to the model
  const formattedPrompt = await prompt.format({ message });

  // Stream response directly from the model
  const stream = await model.stream(formattedPrompt);

  // Return the stream as a response
  return LangChainAdapter.toDataStreamResponse(stream);
}
