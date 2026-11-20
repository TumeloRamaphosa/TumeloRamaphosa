"""Minimal stand-in for Ollama's native /api/chat, for the Jarvis proxy e2e test.

Echoes the last user message so the test can check the round trip:
Jarvis AiService -> jarvis-llm-proxy (--upstream ollama) -> this server.
"""
import json
from http.server import BaseHTTPRequestHandler, HTTPServer


class Handler(BaseHTTPRequestHandler):
    def do_POST(self):
        body = json.loads(self.rfile.read(int(self.headers["Content-Length"])))
        if self.path != "/api/chat":
            self.send_error(404)
            return
        reply = {
            "model": body.get("model", ""),
            "message": {
                "role": "assistant",
                "content": "Hello from fake ollama: " + body["messages"][-1]["content"],
            },
            "done": True,
        }
        out = json.dumps(reply).encode()
        self.send_response(200)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(out)))
        self.end_headers()
        self.wfile.write(out)

    def log_message(self, *args):
        pass


if __name__ == "__main__":
    HTTPServer(("127.0.0.1", 11999), Handler).serve_forever()
