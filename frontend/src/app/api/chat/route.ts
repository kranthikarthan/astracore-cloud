// Optional, but recommended: run on the edge runtime.
// See https://vercel.com/docs/concepts/functions/edge-functions
export const runtime = 'edge';

export async function POST(req: Request) {
    // Extract the `messages` from the body of the request
    const { messages } = await req.json();

    // Mocking a stream for demonstration purposes
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
        async start(controller) {
            const text = "I am the AstraCore Copilot. I can help you with billing, invoices, and anomaly detection. How can I assist you today?";
            const chunks = text.split(" ");

            for (const chunk of chunks) {
                const bytes = encoder.encode(chunk + " ");
                controller.enqueue(bytes);
                await new Promise((r) => setTimeout(r, 50)); // Simulate delay
            }
            controller.close();
        },
    });

    // Respond with the stream
    return new Response(stream, {
        headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
}
