import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { getPassengers, addPassenger } from "@/services/passengers";

export const Route = createFileRoute("/app/students")({
  head: () => ({
    meta: [{ title: "Students — Blue Horizon" }],
  }),
  component: Students,
});

type Student = {
  id?: number;
  name: string;
  student_roll_no?: string;
  class: string;
  stop: string;
};

function Students() {
  const [students, setStudents] = useState<Student[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // FETCH DATA FROM SUPABASE
  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    setLoading(true);

    const data = await getPassengers();

    if (data && data.length > 0) {
      setStudents(data);
    } else {
      setStudents([]);
    }

    setLoading(false);
  };

  // ADD STUDENT
  const handleAdd = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const newStudent = {
      name: String(formData.get("name")),
      student_roll_no: String(formData.get("student_roll_no")),
      class: String(formData.get("class")),
      stop: String(formData.get("stop")),
    };

    await addPassenger(newStudent);

    toast.success("Student added successfully");

    setOpen(false);

    fetchStudents();
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

        <Button onClick={() => setOpen(true)}>
          <Plus className="mr-1 h-4 w-4" />
          Add Student
        </Button>
      </div>

      {/* TABLE */}
      <Card className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Roll No</TableHead>
              <TableHead>Class</TableHead>
              <TableHead>Stop</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8">
                  Loading...
                </TableCell>
              </TableRow>
            ) : students.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8">
                  No students found.
                </TableCell>
              </TableRow>
            ) : (
              students.map((student) => (
                <TableRow key={student.id}>
                  <TableCell>{student.id}</TableCell>
                  <TableCell className="font-medium">{student.name}</TableCell>
                  <TableCell>{student.student_roll_no || "N/A"}</TableCell>
                  <TableCell>{student.class}</TableCell>
                  <TableCell>{student.stop}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      {/* ADD STUDENT DIALOG */}
      <Dialog open={open} onOpenChange={setOpen}>
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

                <Input id="name" name="name" placeholder="Soumya" required />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="student_roll_no">Roll No</Label>
                <Input id="student_roll_no" name="student_roll_no" placeholder="2026123" required />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="class">Class</Label>

                <Input id="class" name="class" placeholder="10A" required />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="stop">Stop</Label>

                <Input id="stop" name="stop" placeholder="Main Road" required />
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>

              <Button type="submit">Save</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
