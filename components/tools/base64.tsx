"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type Mode = "encode" | "decode";
type Result = { output: string; error: string | null };

// btoa/atob only handle Latin1, so round-trip through UTF-8 bytes to support
// the full Unicode range (accents, emoji, etc.).
function encodeBase64(text: string): string {
  const bytes = new TextEncoder().encode(text);
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary);
}

function decodeBase64(base64: string): string {
  const binary = atob(base64);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

function convert(input: string, mode: Mode): Result {
  if (!input) return { output: "", error: null };
  try {
    const output = mode === "encode" ? encodeBase64(input) : decodeBase64(input);
    return { output, error: null };
  } catch {
    return {
      output: "",
      error:
        mode === "encode"
          ? "Unable to encode this input."
          : "Invalid Base64 input.",
    };
  }
}

export function Base64Tool() {
  const [mode, setMode] = useState<Mode>("encode");
  const [input, setInput] = useState("");
  const [copied, setCopied] = useState(false);

  const { output, error } = convert(input, mode);

  async function handleCopy() {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <Card>
      <CardContent className="flex flex-col gap-4">
        <div className="flex gap-2">
          <Button
            variant={mode === "encode" ? "default" : "outline"}
            onClick={() => setMode("encode")}
          >
            Encode
          </Button>
          <Button
            variant={mode === "decode" ? "default" : "outline"}
            onClick={() => setMode("decode")}
          >
            Decode
          </Button>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="b64-input">
            {mode === "encode" ? "Text" : "Base64"}
          </Label>
          <Textarea
            id="b64-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              mode === "encode"
                ? "Enter text to encode..."
                : "Enter Base64 to decode..."
            }
            className="min-h-28 font-mono"
            aria-invalid={error ? true : undefined}
          />
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="b64-output">
              {mode === "encode" ? "Base64" : "Text"}
            </Label>
            <Button
              size="sm"
              variant="ghost"
              onClick={handleCopy}
              disabled={!output}
            >
              {copied ? (
                <Check className="size-4" />
              ) : (
                <Copy className="size-4" />
              )}
              {copied ? "Copied" : "Copy"}
            </Button>
          </div>
          <Textarea
            id="b64-output"
            value={output}
            readOnly
            placeholder="Result..."
            className="min-h-28 font-mono"
          />
          {error ? (
            <p className="text-destructive text-sm" role="alert">
              {error}
            </p>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}
