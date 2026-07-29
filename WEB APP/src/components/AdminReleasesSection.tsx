import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Package, Upload, Trash2, CheckCircle, Plus } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

export function AdminReleasesSection() {
  const [releases, setReleases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchReleases();
  }, []);

  const fetchReleases = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("app_releases")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error && data) {
      setReleases(data);
    }
    setLoading(false);
  };

  const handleMarkLatest = async (id: string, platform: string) => {
    // First, unmark all for this platform
    await supabase
      .from("app_releases")
      .update({ is_latest: false })
      .eq("platform", platform);

    // Then mark this one
    const { error } = await supabase
      .from("app_releases")
      .update({ is_latest: true })
      .eq("id", id);

    if (error) {
      toast.error("Failed to update latest release");
    } else {
      toast.success("Updated latest release successfully");
      fetchReleases();
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this release record?"))
      return;
    const { error } = await supabase.from("app_releases").delete().eq("id", id);
    if (error) toast.error("Failed to delete release");
    else {
      toast.success("Release deleted");
      fetchReleases();
    }
  };

  return (
    <Card className="overflow-hidden">
      <div className="flex items-center justify-between border-b bg-muted/40 px-5 py-3">
        <div className="flex items-center gap-2">
          <Package className="h-4 w-4 text-primary" />
          <h2 className="font-semibold">Release Management (Admin Only)</h2>
        </div>
        <Button size="sm" onClick={() => setOpenDialog(true)}>
          <Plus className="mr-2 h-4 w-4" /> New Release
        </Button>
      </div>

      <div className="p-5">
        {loading ? (
          <p className="text-sm text-muted-foreground">Loading releases...</p>
        ) : releases.length === 0 ? (
          <p className="text-sm text-muted-foreground">No releases found.</p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Version</TableHead>
                  <TableHead>Platform</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {releases.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell className="font-medium">{r.version}</TableCell>
                    <TableCell className="capitalize">{r.platform}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {r.file_size || "—"}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(r.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {r.is_latest ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-success/15 px-2 py-0.5 text-xs font-medium text-success">
                          <CheckCircle className="h-3 w-3" /> Latest
                        </span>
                      ) : (
                        <span className="text-xs text-muted-foreground">
                          Archived
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        {!r.is_latest && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-7 text-xs"
                            onClick={() => handleMarkLatest(r.id, r.platform)}
                          >
                            Mark Latest
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0 text-destructive hover:bg-destructive/10 hover:text-destructive"
                          onClick={() => handleDelete(r.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      <NewReleaseDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onSuccess={fetchReleases}
      />
    </Card>
  );
}

function NewReleaseDialog({
  open,
  onClose,
  onSuccess,
}: {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) return toast.error("Please select a file to upload");

    const data = new FormData(e.currentTarget);
    const version = String(data.get("version"));
    const platform = String(data.get("platform"));
    const release_notes = String(data.get("release_notes"));
    const is_latest = data.get("is_latest") === "on";

    setUploading(true);

    try {
      // Upload to Supabase Storage
      const fileExt = file.name.split(".").pop();
      const fileName = `${platform}-v${version}-${Date.now()}.${fileExt}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("releases")
        .upload(fileName, file, { cacheControl: "3600", upsert: false });

      if (uploadError) {
        throw new Error(`Upload failed: ${uploadError.message}`);
      }

      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from("releases")
        .getPublicUrl(fileName);
      const fileUrl = publicUrlData.publicUrl;

      // File size formatting
      const fileSize = (file.size / (1024 * 1024)).toFixed(2) + " MB";

      // If marking as latest, unmark others first
      if (is_latest) {
        await supabase
          .from("app_releases")
          .update({ is_latest: false })
          .eq("platform", platform);
      }

      // Insert record
      const { error: dbError } = await supabase.from("app_releases").insert({
        version,
        platform,
        file_url: fileUrl,
        file_size: fileSize,
        release_notes,
        is_latest,
      });

      if (dbError)
        throw new Error(`Database insert failed: ${dbError.message}`);

      toast.success("Release uploaded successfully!");
      onSuccess();
      onClose();
    } catch (err: any) {
      toast.error(err.message || "Failed to upload release");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Upload New Release</DialogTitle>
            <DialogDescription>
              Upload a new APK or EXE file to the download center.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="platform">Platform</Label>
              <select
                name="platform"
                id="platform"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                required
              >
                <option value="android">Android (.apk)</option>
                <option value="windows">Windows (.exe)</option>
              </select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="version">Version</Label>
              <Input
                id="version"
                name="version"
                placeholder="e.g. 1.0.0"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="file">Application File</Label>
              <Input
                id="file"
                type="file"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                required
                accept=".apk,.exe"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="release_notes">Release Notes</Label>
              <textarea
                id="release_notes"
                name="release_notes"
                className="flex min-h-[60px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                placeholder="What's new in this release?"
              />
            </div>

            <div className="flex items-center gap-2 mt-2">
              <input
                type="checkbox"
                id="is_latest"
                name="is_latest"
                defaultChecked
                className="h-4 w-4"
              />
              <Label htmlFor="is_latest" className="cursor-pointer">
                Set as the latest release for this platform
              </Label>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={uploading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={uploading}>
              {uploading ? (
                <>
                  <Upload className="mr-2 h-4 w-4 animate-bounce" />{" "}
                  Uploading...
                </>
              ) : (
                "Upload Release"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
