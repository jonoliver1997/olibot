import { LangChainAdapter } from "ai";
import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

// Define the conversation template
const TEMPLATE = `You are a helpful assistant that can answer questions about anything.

Current conversation:
{chat_history}

user: {input}
assistant:`;

// Helper to format previous messages
const formatMessage = (message: { role: string; content: string }) => {
  return `${message.role}: ${message.content}`;
};

export async function POST(req: Request) {
  try {
    // Extract the `messages` from the request body
    const { messages } = await req.json();

    // Format chat history (excluding the latest message)
    const formattedChatHistory = messages
      .slice(0, -1)
      .map(formatMessage)
      .join("\n");

    // Extract the latest user message
    const currentMessageContent = messages.at(-1).content;

    // Create a prompt template
    const prompt = PromptTemplate.fromTemplate(TEMPLATE);

    // Initialize the OpenAI model
    const model = new ChatOpenAI({
      model: "gpt-4o-mini",
      temperature: 0.8,
      streaming: true,
      stop: ["?"], // Stops generation when a question mark is encountered
    });

    // Format the full prompt to include chat history and the latest input
    const formattedPrompt = await prompt.format({
      chat_history: formattedChatHistory,
      input: currentMessageContent,
    });

    // Stream the response directly from the model
    const stream = await model.stream(formattedPrompt);

    // Return the stream as a response
    return LangChainAdapter.toDataStreamResponse(stream);
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: error.status ?? 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
