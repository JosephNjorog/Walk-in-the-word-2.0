"use client";

import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

interface GradientOption {
  css: string;
  stops: [number, string][];
}

const GRADIENTS: GradientOption[] = [
  { css: "var(--blue-gradient)", stops: [[0, "#1E40AF"], [0.5, "#3B82F6"], [1, "#60A5FA"]] },
  { css: "var(--purple-gradient)", stops: [[0, "#8B5CF6"], [0.5, "#A78BFA"], [1, "#C4B5FD"]] },
  { css: "var(--gold-gradient)", stops: [[0, "#F59E0B"], [0.5, "#D97706"], [1, "#B45309"]] },
  { css: "linear-gradient(135deg, #0F766E 0%, #14B8A6 50%, #5EEAD4 100%)", stops: [[0, "#0F766E"], [0.5, "#14B8A6"], [1, "#5EEAD4"]] },
];

interface VerseShareSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  text: string;
  reference: string;
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    const test = current ? `${current} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && current) {
      lines.push(current);
      current = word;
    } else {
      current = test;
    }
  }
  if (current) lines.push(current);
  return lines;
}

export function VerseShareSheet({ open, onOpenChange, text, reference }: VerseShareSheetProps) {
  const [gradientIndex, setGradientIndex] = useState(0);

  const shareToWhatsApp = () => {
    const message = `"${text}" — ${reference}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, "_blank");
  };

  const download = () => {
    const size = 1000;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const gradient = GRADIENTS[gradientIndex];
    const grad = ctx.createLinearGradient(0, 0, size, size);
    gradient.stops.forEach(([offset, color]) => grad.addColorStop(offset, color));
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, size, size);

    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";
    ctx.font = "italic 42px Georgia, serif";
    const lines = wrapText(ctx, `"${text}"`, size - 200);
    const lineHeight = 56;
    const startY = size / 2 - ((lines.length - 1) * lineHeight) / 2 - 20;
    lines.forEach((line, i) => ctx.fillText(line, size / 2, startY + i * lineHeight));

    ctx.font = "bold 28px system-ui, sans-serif";
    ctx.globalAlpha = 0.9;
    ctx.fillText(reference.toUpperCase(), size / 2, startY + lines.length * lineHeight + 30);

    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${reference.replace(/\s+/g, "-").toLowerCase()}.png`;
      a.click();
      URL.revokeObjectURL(url);
    });
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="max-h-[85vh]">
        <SheetHeader>
          <SheetTitle style={{ fontFamily: "var(--font-heading)" }}>Share this Verse</SheetTitle>
        </SheetHeader>

        <div className="mt-4">
          <div
            className="flex aspect-[1/1.1] w-full items-center justify-center rounded-[18px] p-8"
            style={{ background: GRADIENTS[gradientIndex].css }}
          >
            <div className="text-center">
              <p style={{ fontFamily: "var(--font-scripture)" }} className="mb-3.5 text-xl italic leading-relaxed text-white">
                &ldquo;{text}&rdquo;
              </p>
              <p className="text-[13px] font-bold tracking-wide text-white/90">{reference.toUpperCase()}</p>
            </div>
          </div>

          <div className="my-4 flex gap-2.5">
            {GRADIENTS.map((g, i) => (
              <button
                key={i}
                onClick={() => setGradientIndex(i)}
                className="h-[34px] w-[34px] rounded-full"
                style={{ background: g.css, border: `2.5px solid ${gradientIndex === i ? "hsl(var(--foreground))" : "transparent"}` }}
                aria-label={`Gradient option ${i + 1}`}
              />
            ))}
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <button onClick={shareToWhatsApp} className="rounded-2xl bg-primary py-3.5 text-[13.5px] font-bold text-primary-foreground">
              Share to WhatsApp
            </button>
            <button onClick={download} className="rounded-2xl border border-border py-3.5 text-[13.5px] font-bold text-foreground">
              Download
            </button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
