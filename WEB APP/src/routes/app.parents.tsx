import { createFileRoute, redirect } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Search,
  MoreVertical,
  Edit2,
  RotateCcw,
  Ban,
  CheckCircle,
  Trash2,
} from "lucide-react";
import { getSession } from "@/lib/auth";
import {
  useParents,
  updateParent,
  resetParentPassword,
  updateParentStatus,
  deleteParent,
  type Parent,
} from "@/lib/parents";
import { toast } from "sonner";

export const Route = createFileRoute("/app/parents")({
  beforeLoad: async () => {
    const session = await getSession();
    if (!session || session.role !== "admin") {
      throw redirect({ to: "/login" });
    }
  },
  head: () => ({
    meta: [{ title: "Parents — Blue Horizon" }],
  }),
  component: ParentsPage,
});

function ParentsPage() {
  const parents = useParents();
  const [query, setQuery] = useState("");
  const [editingParent, setEditingParent] = useState<Parent | null>(null);
  const [openEdit, setOpenEdit] = useState(false);
  const [saving, setSaving] = useState(false);

  const filteredParents = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return parents;

    return parents.filter((parent) =>
      [
        parent.name,
        parent.email,
        parent.phone,
        parent.student_name,
        parent.student_roll_no,
      ].some((value) => value?.toLowerCase().includes(q)),
    );
  }, [parents, query]);

  const activeCount = parents.filter((parent) => parent.password_changed).length;

  const handleEdit = (parent: Parent) => {
    setEditingParent(parent);
    setOpenEdit(true);
  };

  const handleEditSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingParent) return;

    const formData = new FormData(e.currentTarget);
    setSaving(true);

    try {
      const ok = await updateParent(editingParent.id, {
        name: String(formData.get("name") || ""),
        email: String(formData.get("email") || ""),
        phone: String(formData.get("phone") || ""),
        student_name: String(formData.get("student_name") || ""),
        student_roll_no: String(formData.get("student_roll_no") || ""),
      });

      if (ok) {
        setOpenEdit(false);
        setEditingParent(null);
      }
    } finally {
      setSaving(false);
    }
  };

  const handleResetPassword = async (parent: Parent) => {
    await resetParentPassword(parent.id);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-bold md:text-3xl">Parents</h1>
          <p className="text-sm text-muted-foreground">
            View, edit, and manage parent accounts and activation status.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 md:w-auto">
          <Card className="px-4 py-3">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              Total Parents
            </p>
            <p className="text-2xl font-bold">{parents.length}</p>
          </Card>
          <Card className="px-4 py-3">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              Active Accounts
            </p>
            <p className="text-2xl font-bold">{activeCount}</p>
          </Card>
        </div>
      </div>

      <Card className="p-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search parents, email, phone, or student"
            className="pl-9"
          />
        </div>
      </Card>

      <Card className="overflow-x-auto p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Parent Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Student</TableHead>
              <TableHead>Roll No</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredParents.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="py-8 text-center text-muted-foreground">
                  No parent accounts found.
                </TableCell>
              </TableRow>
            ) : (
              filteredParents.map((parent) => {
                const isActive = Boolean(parent.password_changed);
                const isDisabled = parent.status === "disabled";

                return (
                  <TableRow key={parent.id}>
                    <TableCell className="font-medium">{parent.name || "—"}</TableCell>
                    <TableCell>{parent.email || "—"}</TableCell>
                    <TableCell>{parent.phone || "—"}</TableCell>
                    <TableCell>{parent.student_name || "—"}</TableCell>
                    <TableCell className="font-mono">{parent.student_roll_no || "—"}</TableCell>
                    <TableCell>
                      <Badge variant={isDisabled ? "destructive" : isActive ? "default" : "secondary"}>
                        {isDisabled ? "Disabled" : isActive ? "Active" : "Pending activation"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEdit(parent)}>
                            <Edit2 className="mr-2 h-4 w-4" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleResetPassword(parent)}>
                            <RotateCcw className="mr-2 h-4 w-4" /> Reset password
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => updateParentStatus(parent.id, !isDisabled)}
                          >
                            {isDisabled ? (
                              <>
                                <CheckCircle className="mr-2 h-4 w-4 text-success" /> Enable
                              </>
                            ) : (
                              <>
                                <Ban className="mr-2 h-4 w-4 text-destructive" /> Disable
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={async () => {
                              if (confirm(`Delete parent ${parent.name}?`)) {
                                await deleteParent(parent.id);
                              }
                            }}
                          >
                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </Card>

      <Dialog open={openEdit} onOpenChange={setOpenEdit}>
        <DialogContent className="sm:max-w-md">
          {editingParent && (
            <form onSubmit={handleEditSubmit}>
              <DialogHeader>
                <DialogTitle>Edit Parent</DialogTitle>
                <DialogDescription>
                  Update parent account details and linked student information.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Parent Name</label>
                  <Input name="name" defaultValue={editingParent.name} required disabled={saving} />
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Email</label>
                  <Input name="email" type="email" defaultValue={editingParent.email} required disabled={saving} />
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Phone</label>
                  <Input name="phone" defaultValue={editingParent.phone} disabled={saving} />
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Student Name</label>
                  <Input name="student_name" defaultValue={editingParent.student_name} disabled={saving} />
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Student Roll No</label>
                  <Input name="student_roll_no" defaultValue={editingParent.student_roll_no} required disabled={saving} />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setOpenEdit(false)} disabled={saving}>
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
    </div>
  );
}
