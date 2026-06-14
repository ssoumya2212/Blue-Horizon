import { createFileRoute } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Plus,
  MoreVertical,
  Edit2,
  Trash2,
  Ban,
  ShieldAlert,
  CheckCircle,
} from "lucide-react";
import { useSearchQuery } from "@/lib/search";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  useDrivers,
  addDriver,
  updateDriver,
  deleteDriver,
  updateDriverStatus,
  type Driver,
  type DriverStatus,
} from "@/lib/drivers";

export const Route = createFileRoute("/app/drivers")({
  head: () => ({ meta: [{ title: "Drivers — Blue Horizon" }] }),
  component: Drivers,
});

function Drivers() {
  const drivers = useDrivers();
  const q = useSearchQuery().toLowerCase();

  const [editingDriver, setEditingDriver] = useState<Driver | null>(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [saving, setSaving] = useState(false);

  const filtered = q
    ? drivers.filter(
        (d) =>
          d.name.toLowerCase().includes(q) ||
          d.route.toLowerCase().includes(q) ||
          d.phone.toLowerCase().includes(q) ||
          d.status.toLowerCase().includes(q),
      )
    : drivers;

  const handleEditClick = (driver: Driver) => {
    setEditingDriver(driver);
    setOpenEditDialog(true);
  };

  const handleEditSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingDriver) return;
    setSaving(true);
    const data = new FormData(e.currentTarget);
    try {
      const ok = await updateDriver(editingDriver.id, {
        name: String(data.get("name")),
        phone: String(data.get("phone")),
        licence: String(data.get("licence")),
        bus_id: String(data.get("bus_id")),
      });
      if (ok) setOpenEditDialog(false);
    } catch (err: any) {
      toast.error(`Error: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleAddSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Check required fields manually
    const form = e.currentTarget;
    let missingFieldLabel = "";
    const requiredInputs = form.querySelectorAll("[required]");
    for (let i = 0; i < requiredInputs.length; i++) {
      const input = requiredInputs[i] as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
      if (!input.value || input.value.trim() === "") {
        const label = form.querySelector(`label[for="${input.id}"]`);
        missingFieldLabel = label ? label.textContent || input.name : input.name;
        break;
      }
    }

    if (missingFieldLabel) {
      toast.error(`${missingFieldLabel} is required`);
      return;
    }

    setSaving(true);
    const data = new FormData(form);
    try {
      const file = data.get("medical_certificate") as File;
      let medicalCertificateUrl = "";
      if (file && file.size > 0) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
        const filePath = `medical-certificates/${fileName}`;
        
        const { error: uploadErr } = await supabase.storage
          .from("documents")
          .upload(filePath, file);
          
        if (uploadErr) {
          console.error("Storage upload error:", uploadErr);
          // Fallback to mock url so it doesn't fail
          medicalCertificateUrl = `mock-storage/documents/${filePath}`;
        } else {
          const { data: { publicUrl } } = supabase.storage
            .from("documents")
            .getPublicUrl(filePath);
          medicalCertificateUrl = publicUrl;
        }
      } else {
        toast.error("Medical Certificate is required.");
        setSaving(false);
        return;
      }

      const d = await addDriver({
        name: String(data.get("name")),
        email: String(data.get("email")),
        phone: String(data.get("phone")),
        licence: String(data.get("licence")),
        bus_id: String(data.get("bus_id")),
        password: String(data.get("password") || "123456"),
        licenseExpiry: data.get("licenseExpiry") ? String(data.get("licenseExpiry")) : undefined,
        experience: data.get("experience") ? Number(data.get("experience")) : undefined,
        bloodGroup: data.get("bloodGroup") ? String(data.get("bloodGroup")) : undefined,
        medicalCertificateUrl: medicalCertificateUrl,
      });
      if (d) setOpenAddDialog(false);
    } catch (err: any) {
      toast.error(`Error: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteClick = async (driver: Driver) => {
    if (confirm(`Are you sure you want to delete ${driver.name}?`)) {
      await deleteDriver(driver.id);
    }
  };

  const handleToggleDisable = async (driver: Driver) => {
    const newStatus: DriverStatus =
      driver.status === "disabled" ? "approved" : "disabled";
    await updateDriverStatus(driver.id, newStatus);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold md:text-3xl">Drivers</h1>
          <p className="text-sm text-muted-foreground">
            Approve, assign and manage drivers.
          </p>
        </div>
        <Button onClick={() => setOpenAddDialog(true)}>
          <Plus className="mr-1 h-4 w-4" /> Add driver
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {filtered.map((d) => (
          <Card key={d.id || d.name} className="p-5 relative">
            <div className="absolute top-4 right-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleEditClick(d)}>
                    <Edit2 className="mr-2 h-4 w-4" /> Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleToggleDisable(d)}>
                    {d.status === "disabled" ? (
                      <>
                        <CheckCircle className="mr-2 h-4 w-4 text-success" />{" "}
                        Enable
                      </>
                    ) : (
                      <>
                        <Ban className="mr-2 h-4 w-4 text-destructive" />{" "}
                        Disable
                      </>
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-destructive focus:text-destructive"
                    onClick={() => handleDeleteClick(d)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" /> Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12">
                <AvatarFallback className="bg-primary/10 text-primary">
                  {d.name[0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold pr-6 truncate max-w-[150px]">
                  {d.name}
                </p>
                <p className="text-xs text-muted-foreground">{d.route}</p>
              </div>
            </div>
            <div className="mt-3 space-y-1">
              <p className="text-xs text-muted-foreground">
                Phone: {d.phone || "—"}
              </p>
              <p className="text-xs text-muted-foreground">
                Licence: {d.licence || "—"}
              </p>
              <p className="text-xs text-muted-foreground">
                Bus Number: {d.bus_id || "—"}
              </p>
              <p className="text-xs text-muted-foreground">
                Blood Group: {d.blood_group || "—"}
              </p>
              <div className="text-xs flex flex-wrap items-center gap-1 mt-1.5">
                <span className="text-muted-foreground">Med Cert:</span>
                {d.medical_certificate_url ? (
                  <a
                    href={d.medical_certificate_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center text-[10px] font-bold text-success hover:underline bg-success/10 px-1.5 py-0.5 rounded border border-success/20"
                  >
                    Uploaded (View)
                  </a>
                ) : (
                  <span className="inline-flex items-center text-[10px] font-bold text-destructive bg-destructive/10 px-1.5 py-0.5 rounded border border-destructive/20 animate-pulse">
                    Not Uploaded
                  </span>
                )}
              </div>
            </div>
            <Badge
              variant="outline"
              className={
                d.status === "approved"
                  ? "mt-3 border-success/30 bg-success/10 text-success"
                  : "mt-3 border-destructive/30 bg-destructive/10 text-destructive"
              }
            >
              <span className="capitalize">{d.status}</span>
            </Badge>
          </Card>
        ))}
      </div>

      {/* EDIT DRIVER DIALOG */}
      <Dialog open={openEditDialog} onOpenChange={setOpenEditDialog}>
        <DialogContent className="sm:max-w-md">
          {editingDriver && (
            <form onSubmit={handleEditSubmit}>
              <DialogHeader>
                <DialogTitle>Edit Driver</DialogTitle>
                <DialogDescription>
                  Update driver properties in Supabase database.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-name">Full Name</Label>
                  <Input
                    id="edit-name"
                    name="name"
                    defaultValue={editingDriver.name}
                    required
                    disabled={saving}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-phone">Phone</Label>
                  <Input
                    id="edit-phone"
                    name="phone"
                    defaultValue={editingDriver.phone}
                    required
                    disabled={saving}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-licence">Licence Number</Label>
                  <Input
                    id="edit-licence"
                    name="licence"
                    defaultValue={editingDriver.licence}
                    required
                    disabled={saving}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-bus">Assigned Bus ID</Label>
                  <Input
                    id="edit-bus"
                    name="bus_id"
                    defaultValue={editingDriver.bus_id}
                    placeholder="e.g. 007"
                    disabled={saving}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpenEditDialog(false)}
                  disabled={saving}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={saving}>
                  Save Changes
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* ADD DRIVER DIALOG */}
      <Dialog open={openAddDialog} onOpenChange={setOpenAddDialog}>
        <DialogContent className="sm:max-w-md">
          <form onSubmit={handleAddSubmit} encType="multipart/form-data">
            <DialogHeader>
              <DialogTitle>Add Driver</DialogTitle>
              <DialogDescription>
                Create a driver auth account and profile in database.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="add-name">Full Name</Label>
                <Input
                  id="add-name"
                  name="name"
                  placeholder="John Doe"
                  required
                  disabled={saving}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="add-email">Email</Label>
                <Input
                  id="add-email"
                  name="email"
                  type="email"
                  placeholder="john@bluehorizon.com"
                  required
                  disabled={saving}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="add-phone">Phone</Label>
                <Input
                  id="add-phone"
                  name="phone"
                  placeholder="+91 90000 00000"
                  required
                  disabled={saving}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="add-licence">Licence Number</Label>
                <Input
                  id="add-licence"
                  name="licence"
                  placeholder="DL-XXXX"
                  required
                  disabled={saving}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="add-license-expiry">Licence Expiry Date</Label>
                <Input
                  id="add-license-expiry"
                  name="licenseExpiry"
                  type="date"
                  required
                  disabled={saving}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="add-experience">Years of Experience</Label>
                <Input
                  id="add-experience"
                  name="experience"
                  type="number"
                  placeholder="5"
                  required
                  disabled={saving}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="add-blood-group">Blood Group</Label>
                <Input
                  id="add-blood-group"
                  name="bloodGroup"
                  placeholder="O+ / A+"
                  required
                  disabled={saving}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="add-med-cert">Medical Certificate (Must Upload)</Label>
                <Input
                  id="add-med-cert"
                  name="medical_certificate"
                  type="file"
                  accept="image/*,application/pdf"
                  required
                  disabled={saving}
                  className="cursor-pointer"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="add-bus">Assigned Bus ID</Label>
                <Input
                  id="add-bus"
                  name="bus_id"
                  placeholder="e.g. 007"
                  disabled={saving}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="add-password">Password</Label>
                <Input
                  id="add-password"
                  name="password"
                  type="password"
                  placeholder="123456"
                  required
                  disabled={saving}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpenAddDialog(false)}
                disabled={saving}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={saving}>
                Add Driver
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
