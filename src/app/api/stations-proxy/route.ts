export async function GET() {
  return new Response(JSON.stringify({ message: "Test working!" }), {
    headers: { 'Content-Type': 'application/json' }
  });
}