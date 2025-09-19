import { useEffect, useMemo, useRef, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { ImageIcon, PlaySquare, Upload, X } from "lucide-react";

// Allowed post types
export type PostType = "normal" | "reel";

// Simple pan + zoom cropper for images and videos (preview-only). Outputs canvas for images; for videos it previews positioning only.
function PanZoomCropper({
  fileUrl,
  mediaType,
  targetRatio = 1,
  onConfirm,
  onCancel,
}: {
  fileUrl: string;
  mediaType: "image" | "video";
  targetRatio?: number; // width/height
  onConfirm: (data: { previewUrl: string; meta: { scale: number; offsetX: number; offsetY: number; ratio: number } }) => void;
  onCancel: () => void;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mediaRef = useRef<HTMLImageElement | HTMLVideoElement | null>(null);
  const [scale, setScale] = useState(1);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const dragRef = useRef<{ dx: number; dy: number; startX: number; startY: number } | null>(null);

  // Setup drag handlers
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onPointerDown = (e: PointerEvent) => {
      (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
      dragRef.current = { dx: pos.x, dy: pos.y, startX: e.clientX, startY: e.clientY };
    };
    const onPointerMove = (e: PointerEvent) => {
      if (!dragRef.current) return;
      const { dx, dy, startX, startY } = dragRef.current;
      setPos({ x: dx + (e.clientX - startX), y: dy + (e.clientY - startY) });
    };
    const onPointerUp = () => {
      dragRef.current = null;
    };
    el.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    return () => {
      el.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
    };
  }, [pos.x, pos.y]);

  const doConfirm = async () => {
    // For images, render to canvas at required ratio; for videos, just return current transform as metadata and snapshot a poster frame
    const ratio = targetRatio;
    const size = 1080; // export size for square; height will be size/ratio
    const outW = Math.round(size);
    const outH = Math.round(size / ratio);

    if (mediaType === "image") {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = fileUrl;
      await new Promise((res, rej) => {
        img.onload = () => res(null);
        img.onerror = rej;
      });
      const canvas = document.createElement("canvas");
      canvas.width = outW;
      canvas.height = outH;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Compute how the image is currently transformed inside the container: scale and offset
      const naturalW = img.naturalWidth;
      const naturalH = img.naturalHeight;
      const container = containerRef.current;
      if (!container) return;
      // Assume the media was initially sized to cover the container's smaller dimension, then scaled by `scale` and translated by pos
      const containerRect = container.getBoundingClientRect();
      const containerW = containerRect.width;
      const containerH = containerRect.height;
      // Determine base scale to cover container
      const coverScale = Math.max(containerW / naturalW, containerH / naturalH);
      const totalScale = coverScale * scale;

      // Map output canvas pixels to image pixels by inverting transform
      // For each output pixel, find corresponding source pixel coordinate
      // Equivalent to drawing image at transformed position on a virtual container of size containerW x containerH, then sampling the crop area equal to container
      // We can compute the top-left of the image in container space, then the crop area is container itself
      const imgDisplayW = naturalW * totalScale;
      const imgDisplayH = naturalH * totalScale;
      const imgLeft = (containerW - imgDisplayW) / 2 + pos.x;
      const imgTop = (containerH - imgDisplayH) / 2 + pos.y;

      // The output canvas corresponds to the entire container area scaled to outW x outH. So compute source rect in image pixels for that area.
      const scaleToCanvasX = naturalW * totalScale / imgDisplayW; // equals naturalW/imgDisplayW
      const scaleToCanvasY = naturalH * totalScale / imgDisplayH; // equals naturalH/imgDisplayH

      // Source rect top-left in image pixels corresponding to container's top-left
      const srcX = Math.max(0, (0 - imgLeft) * (naturalW / imgDisplayW));
      const srcY = Math.max(0, (0 - imgTop) * (naturalH / imgDisplayH));
      const srcW = Math.min(naturalW - srcX, containerW * (naturalW / imgDisplayW));
      const srcH = Math.min(naturalH - srcY, containerH * (naturalH / imgDisplayH));

      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(img, srcX, srcY, srcW, srcH, 0, 0, outW, outH);
      const url = canvas.toDataURL("image/jpeg", 0.92);
      onConfirm({ previewUrl: url, meta: { scale, offsetX: pos.x, offsetY: pos.y, ratio } });
      return;
    }

    // video: try to capture a frame for preview
    const video = document.createElement("video");
    video.src = fileUrl;
    await new Promise((res) => {
      video.onloadeddata = () => res(null);
      // fallback timeout
      setTimeout(res, 800);
    });
    const canvas = document.createElement("canvas");
    canvas.width = outW;
    canvas.height = outH;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      // Draw a black background first
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, outW, outH);
    }
    const container = containerRef.current;
    if (!ctx || !container) {
      onConfirm({ previewUrl: fileUrl, meta: { scale, offsetX: pos.x, offsetY: pos.y, ratio } });
      return;
    }
    const containerRect = container.getBoundingClientRect();
    const containerW = containerRect.width;
    const containerH = containerRect.height;

    // Assume cover behavior similar to image path
    const videoW = video.videoWidth || containerW;
    const videoH = video.videoHeight || containerH;
    const coverScale = Math.max(containerW / videoW, containerH / videoH);
    const totalScale = coverScale * scale;
    const dispW = videoW * totalScale;
    const dispH = videoH * totalScale;
    const imgLeft = (containerW - dispW) / 2 + pos.x;
    const imgTop = (containerH - dispH) / 2 + pos.y;
    const srcX = Math.max(0, (0 - imgLeft) * (videoW / dispW));
    const srcY = Math.max(0, (0 - imgTop) * (videoH / dispH));
    const srcW = Math.min(videoW - srcX, containerW * (videoW / dispW));
    const srcH = Math.min(videoH - srcY, containerH * (videoH / dispH));

    try {
      ctx.drawImage(video, srcX, srcY, srcW, srcH, 0, 0, outW, outH);
      const url = canvas.toDataURL("image/jpeg", 0.9);
      onConfirm({ previewUrl: url, meta: { scale, offsetX: pos.x, offsetY: pos.y, ratio } });
    } catch {
      onConfirm({ previewUrl: fileUrl, meta: { scale, offsetX: pos.x, offsetY: pos.y, ratio } });
    }
  };

  return (
    <div className="space-y-3">
      <div className="rounded-md overflow-hidden border border-border bg-black" ref={containerRef}>
        <AspectRatio ratio={targetRatio}>
          <div className="relative w-full h-full touch-pan-y select-none cursor-grab active:cursor-grabbing">
            {mediaType === "image" ? (
              <img
                ref={mediaRef as any}
                src={fileUrl}
                alt="To crop"
                className="absolute left-1/2 top-1/2 will-change-transform"
                style={{
                  transform: `translate(-50%, -50%) translate(${pos.x}px, ${pos.y}px) scale(${scale})`,
                  transformOrigin: "center center",
                  maxWidth: "none",
                  maxHeight: "none",
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            ) : (
              <video
                ref={mediaRef as any}
                src={fileUrl}
                className="absolute left-1/2 top-1/2 will-change-transform"
                style={{
                  transform: `translate(-50%, -50%) translate(${pos.x}px, ${pos.y}px) scale(${scale})`,
                  transformOrigin: "center center",
                  maxWidth: "none",
                  maxHeight: "none",
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
                controls
              />
            )}
          </div>
        </AspectRatio>
      </div>
      <div className="px-1">
        <Label className="text-xs text-muted-foreground">Zoom</Label>
        <Slider value={[scale]} min={1} max={3} step={0.01} onValueChange={(v) => setScale(v[0] ?? 1)} />
      </div>
      <div className="flex gap-2 justify-end">
        <Button variant="ghost" onClick={onCancel}>Back</Button>
        <Button onClick={doConfirm}>Apply</Button>
      </div>
    </div>
  );
}

function ReelAutoFitPreview({ fileUrl, mediaType }: { fileUrl: string; mediaType: "image" | "video" }) {
  return (
    <div className="space-y-3">
      <div className="rounded-md overflow-hidden border border-border bg-black">
        <AspectRatio ratio={9 / 16}>
          <div className="relative w-full h-full bg-black">
            {mediaType === "image" ? (
              <img src={fileUrl} alt="Reel preview" className="absolute inset-0 w-full h-full object-contain bg-black" />
            ) : (
              <video src={fileUrl} className="absolute inset-0 w-full h-full object-contain bg-black" controls />
            )}
          </div>
        </AspectRatio>
      </div>
      <p className="text-xs text-muted-foreground">Content is automatically fitted into a 9:16 frame with black bars as needed.</p>
    </div>
  );
}

export default function CreatePostDialog({ children }: { children?: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [postType, setPostType] = useState<PostType>("normal");
  const [file, setFile] = useState<File | null>(null);
  const [fileUrl, setFileUrl] = useState<string>("");
  const [mediaType, setMediaType] = useState<"image" | "video" | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string>("");

  useEffect(() => {
    if (!file) {
      setFileUrl("");
      setMediaType(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setFileUrl(url);
    const type = file.type.startsWith("video/") ? "video" : "image";
    setMediaType(type);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const reset = () => {
    setStep(1);
    setPostType("normal");
    setFile(null);
    setFileUrl("");
    setMediaType(null);
    setTitle("");
    setDescription("");
    setPreviewUrl("");
  };

  const onOpenChange = (v: boolean) => {
    setOpen(v);
    if (!v) {
      reset();
    }
  };

  const canContinueStep2 = Boolean(file && mediaType);

  const trigger = children ? (
    children
  ) : (
    <Button className="w-full justify-center" variant="default">
      <Upload className="w-4 h-4 mr-2" /> Create Post
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[560px]">
        <DialogHeader>
          <DialogTitle>Create Post</DialogTitle>
        </DialogHeader>

        {step === 1 && (
          <div className="space-y-4">
            <div>
              <Label className="text-sm mb-2 block">Choose post type</Label>
              <RadioGroup value={postType} onValueChange={(v) => setPostType(v as PostType)} className="grid grid-cols-2 gap-3">
                <div className={`border rounded-md p-3 flex items-center gap-2 ${postType === "normal" ? "border-accent" : "border-border"}`}>
                  <RadioGroupItem id="type-normal" value="normal" />
                  <Label htmlFor="type-normal" className="flex items-center gap-2 cursor-pointer">
                    <ImageIcon className="w-4 h-4" /> Normal Post
                  </Label>
                </div>
                <div className={`border rounded-md p-3 flex items-center gap-2 ${postType === "reel" ? "border-accent" : "border-border"}`}>
                  <RadioGroupItem id="type-reel" value="reel" />
                  <Label htmlFor="type-reel" className="flex items-center gap-2 cursor-pointer">
                    <PlaySquare className="w-4 h-4" /> Reel
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="media" className="text-sm">Upload image or video</Label>
              <Input id="media" type="file" accept="image/*,video/*" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
            </div>

            {fileUrl && (
              <div className="rounded-md overflow-hidden border border-border">
                <AspectRatio ratio={postType === "reel" ? 9 / 16 : 1}>
                  <div className="relative w-full h-full bg-black">
                    {mediaType === "image" ? (
                      <img src={fileUrl} alt="Preview" className={`absolute inset-0 w-full h-full ${postType === "reel" ? "object-contain" : "object-cover"}`} />
                    ) : (
                      <video src={fileUrl} className={`absolute inset-0 w-full h-full ${postType === "reel" ? "object-contain" : "object-cover"}`} controls />
                    )}
                  </div>
                </AspectRatio>
              </div>
            )}

            <div className="flex justify-end gap-2">
              <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
              <Button disabled={!canContinueStep2} onClick={() => setStep(2)}>Next</Button>
            </div>
          </div>
        )}

        {step === 2 && mediaType && fileUrl && (
          <div className="space-y-4">
            {postType === "normal" ? (
              <PanZoomCropper
                fileUrl={fileUrl}
                mediaType={mediaType}
                targetRatio={1}
                onCancel={() => setStep(1)}
                onConfirm={({ previewUrl }) => {
                  setPreviewUrl(previewUrl);
                  setStep(3);
                }}
              />
            ) : (
              <div className="space-y-3">
                <ReelAutoFitPreview fileUrl={fileUrl} mediaType={mediaType} />
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" onClick={() => setStep(1)}>Back</Button>
                  <Button onClick={() => {
                    setPreviewUrl(""); // we use original url for reel preview
                    setStep(3);
                  }}>Next</Button>
                </div>
              </div>
            )}
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <div className="rounded-md overflow-hidden border border-border bg-black">
              <AspectRatio ratio={postType === "reel" ? 9 / 16 : 1}>
                <div className="relative w-full h-full bg-black">
                  {postType === "reel" ? (
                    mediaType === "video" ? (
                      <video src={fileUrl} className="absolute inset-0 w-full h-full object-contain bg-black" controls />
                    ) : (
                      <img src={fileUrl} alt="Reel" className="absolute inset-0 w-full h-full object-contain bg-black" />
                    )
                  ) : (
                    <img src={previewUrl || fileUrl} alt="Cropped" className="absolute inset-0 w-full h-full object-cover" />
                  )}
                </div>
              </AspectRatio>
            </div>

            <div className="grid gap-3">
              <div className="grid gap-1">
                <Label htmlFor="title">Title</Label>
                <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Enter a title" />
              </div>
              <div className="grid gap-1">
                <Label htmlFor="desc">Description</Label>
                <Textarea id="desc" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Write a description" rows={4} />
              </div>
            </div>

            <div className="flex justify-between gap-2">
              <Button variant="ghost" onClick={() => setStep(2)}>Back</Button>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => { reset(); setOpen(false); }}>Cancel</Button>
                <Button onClick={() => setStep(4)}>Continue</Button>
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4">
            <div className="rounded-md overflow-hidden border border-border bg-black">
              <AspectRatio ratio={postType === "reel" ? 9 / 16 : 1}>
                <div className="relative w-full h-full bg-black">
                  {postType === "reel" ? (
                    mediaType === "video" ? (
                      <video src={fileUrl} className="absolute inset-0 w-full h-full object-contain bg-black" controls />
                    ) : (
                      <img src={fileUrl} alt="Reel" className="absolute inset-0 w-full h-full object-contain bg-black" />
                    )
                  ) : (
                    <img src={previewUrl || fileUrl} alt="Cropped" className="absolute inset-0 w-full h-full object-cover" />
                  )}
                </div>
              </AspectRatio>
            </div>
            <div className="grid gap-1">
              <Label>Title</Label>
              <div className="text-sm text-foreground break-words">{title || "(No title)"}</div>
            </div>
            <div className="grid gap-1">
              <Label>Description</Label>
              <div className="text-sm text-muted-foreground whitespace-pre-wrap break-words">{description || "(No description)"}</div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setStep(3)}>Back</Button>
              <Button onClick={() => { reset(); setOpen(false); }}>Done</Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
