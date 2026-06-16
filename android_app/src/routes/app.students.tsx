import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Edit2, Trash2, MoreVertical } from "lucide-react";
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
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getBuses } from "@/services/bus";
import {
  getPassengers,
  addPassenger,
  updatePassenger,
  deletePassenger,
} from "@/services/passengers";

export const Route = createFileRoute("/app/students")({
  head: () => ({
    meta: [{ title: "Students — Blue Horizon" }],
  }),
  component: Students,
});

type Student = {
  id: string;
  name: string;
  student_roll_no: string;
  class: string;
  section: string;
  stop: string;
  pickup_address: string;
  drop_address: string;
  parent_phone: string;
  bus_id: string;
};

type Bus = {
  id: string;
  route_name: string;
};

function Students() {
  const [students, setStudents] = useState<Student[]>([]);
  const [buses, setBuses] = useState<Bus[]>([]);
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchStudents();
    fetchBuses();
  }, []);

  const fetchStudents = async () => {
    setLoading(true);
    const data = await getPassengers();
    setStudents(data as Student[]);
    setLoading(false);
  };

  const fetchBuses = async () => {
    const data = await getBuses();
    setBuses(data || []);
  };

  const handleAdd = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Check required fields manually
    const form = e.currentTarget;
    let missingFieldLabel = "";
    const requiredInputs = form.querySelectorAll("[required]");
    for (let i = 0; i < requiredInputs.length; i++) {
      const input = requiredInputs[i] as HTMLInputElement | HTMLSelectElement;
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
    const formData = new FormData(form);

    const newStudent = {
      name: String(formData.get("name")),
      student_roll_no: String(formData.get("student_roll_no")),
      class: String(formData.get("class")),
      section: String(formData.get("section")),
      pickup_address: String(formData.get("pickup_address")),
      drop_address: String(formData.get("drop_address")),
      bus_id: String(formData.get("bus_id") || ""),
      parent_phone: String(formData.get("parent_phone")),
    };

    const res = await addPassenger(newStudent);
    setSaving(false);
    if (res) {
      toast.success("Student added successfully");
      setOpenAdd(false);
      fetchStudents();
    } else {
      toast.error("Failed to add student");
    }
  };

  const handleEditClick = (student: Student) => {
    setEditingStudent(student);
    setOpenEdit(true);
  };

  const handleEdit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingStudent) return;
    // Check required fields manually
    const form = e.currentTarget;
    let missingFieldLabel = "";
    const requiredInputs = form.querySelectorAll("[required]");
    for (let i = 0; i < requiredInputs.length; i++) {
      const input = requiredInputs[i] as HTMLInputElement | HTMLSelectElement;
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
    const formData = new FormData(form);

    const updated = {
      name: String(formData.get("name")),
      student_roll_no: String(formData.get("student_roll_no")),
      class: String(formData.get("class")),
      section: String(formData.get("section")),
      pickup_address: String(formData.get("pickup_address")),
      drop_address: String(formData.get("drop_address")),
      bus_id: String(formData.get("bus_id") || ""),
      parent_phone: String(formData.get("parent_phone")),
    };

    const res = await updatePassenger(editingStudent.id, updated);
    setSaving(false);
    if (res) {
      toast.success("Student updated successfully");
      setOpenEdit(false);
      fetchStudents();
    } else {
      toast.error("Failed to update student");
    }
  };

  const handleDelete = async (student: Student) => {
    if (confirm(`Are you sure you want to delete student ${student.name}?`)) {
      const ok = await deletePassenger(student.id);
      if (ok) {
        toast.success("Student deleted successfully");
        fetchStudents();
      } else {
        toast.error("Failed to delete student");
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold md:text-3xl">Students</h1>
          <p className="text-sm text-muted-foreground">
            Manage student records from Supabase backend.
          </p>
        </div>

        <Button onClick={() => setOpenAdd(true)}>
          <Plus className="mr-1 h-4 w-4" />
          Add Student
        </Button>
      </div>

      {/* TABLE */}
      <Card className="p-0 overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Roll No</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Class & Sec</TableHead>
              <TableHead>Pickup Address</TableHead>
              <TableHead>Drop Address</TableHead>
              <TableHead>Bus ID</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center py-8 text-muted-foreground"
                >
                  Loading students...
                </TableCell>
              </TableRow>
            ) : students.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center py-8 text-muted-foreground"
                >
                  No students found.
                </TableCell>
              </TableRow>
            ) : (
              students.map((student) => (
                <TableRow key={student.id}>
                  <TableCell className="font-mono">
                    {student.student_roll_no || "—"}
                  </TableCell>
                  <TableCell className="font-medium">{student.name}</TableCell>
                  <TableCell>
                    {student.class} {student.section && `(${student.section})`}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-xs">
                    {student.pickup_address || "—"}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-xs">
                    {student.drop_address || "—"}
                  </TableCell>
                  <TableCell>
                    {student.bus_id ? (
                      <span className="font-bold text-xs">
                        Bus {student.bus_id}
                      </span>
                    ) : (
                      <span className="text-muted-foreground text-xs">
                        Unassigned
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 p-0"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => handleEditClick(student)}
                        >
                          <Edit2 className="mr-2 h-4 w-4" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={() => handleDelete(student)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      {/* ADD STUDENT DIALOG */}
      <Dialog open={openAdd} onOpenChange={setOpenAdd}>
        <DialogContent className="sm:max-w-md">
          <form onSubmit={handleAdd}>
            <DialogHeader>
              <DialogTitle>Add Student</DialogTitle>
              <DialogDescription>
                Save student data into Supabase database.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Student Name</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Aarav S"
                  required
                  disabled={saving}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="student_roll_no">Roll No</Label>
                <Input
                  id="student_roll_no"
                  name="student_roll_no"
                  placeholder="2026015"
                  required
                  disabled={saving}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="class">Class</Label>
                <Input
                  id="class"
                  name="class"
                  placeholder="6A"
                  required
                  disabled={saving}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="section">Section</Label>
                <Input
                  id="section"
                  name="section"
                  placeholder="A"
                  disabled={saving}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="parent_phone">Parent Phone</Label>
                <Input
                  id="parent_phone"
                  name="parent_phone"
                  placeholder="+91 98765 43210"
                  disabled={saving}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="pickup_address">Pickup Point</Label>
                <Input
                  id="pickup_address"
                  name="pickup_address"
                  placeholder="Adyar, Chennai"
                  required
                  disabled={saving}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="drop_address">Drop Point</Label>
                <Input
                  id="drop_address"
                  name="drop_address"
                  placeholder="Blue Horizon School"
                  required
                  disabled={saving}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="bus_id">Assigned Bus</Label>
                <select
                  id="bus_id"
                  name="bus_id"
                  disabled={saving}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="">Unassigned</option>
                  {buses.map((b) => (
                    <option key={b.id} value={b.id}>
                      Bus {b.id} ({b.route_name})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpenAdd(false)}
                disabled={saving}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={saving}>
                Save Student
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* EDIT STUDENT DIALOG */}
      <Dialog open={openEdit} onOpenChange={setOpenEdit}>
        <DialogContent className="sm:max-w-md">
          {editingStudent && (
            <form onSubmit={handleEdit}>
              <DialogHeader>
                <DialogTitle>Edit Student</DialogTitle>
                <DialogDescription>
                  Update student properties in Supabase database.
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-name">Student Name</Label>
                  <Input
                    id="edit-name"
                    name="name"
                    defaultValue={editingStudent.name}
                    required
                    disabled={saving}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="edit-student_roll_no">Roll No</Label>
                  <Input
                    id="edit-student_roll_no"
                    name="student_roll_no"
                    defaultValue={editingStudent.student_roll_no}
                    required
                    disabled={saving}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="edit-class">Class</Label>
                  <Input
                    id="edit-class"
                    name="class"
                    defaultValue={editingStudent.class}
                    required
                    disabled={saving}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="edit-section">Section</Label>
                  <Input
                    id="edit-section"
                    name="section"
                    defaultValue={editingStudent.section}
                    disabled={saving}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="edit-parent_phone">Parent Phone</Label>
                  <Input
                    id="edit-parent_phone"
                    name="parent_phone"
                    defaultValue={editingStudent.parent_phone}
                    disabled={saving}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="edit-pickup_address">Pickup Point</Label>
                  <Input
                    id="edit-pickup_address"
                    name="pickup_address"
                    defaultValue={editingStudent.pickup_address}
                    required
                    disabled={saving}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="edit-drop_address">Drop Point</Label>
                  <Input
                    id="edit-drop_address"
                    name="drop_address"
                    defaultValue={editingStudent.drop_address}
                    required
                    disabled={saving}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="edit-bus_id">Assigned Bus</Label>
                  <select
                    id="edit-bus_id"
                    name="bus_id"
                    defaultValue={editingStudent.bus_id}
                    disabled={saving}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="">Unassigned</option>
                    {buses.map((b) => (
                      <option key={b.id} value={b.id}>
                        Bus {b.id} ({b.route_name})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpenEdit(false)}
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
    </div>
  );
}
