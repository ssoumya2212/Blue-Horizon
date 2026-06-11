import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  process.env.VITE_SUPABASE_URL || "https://unrzzlidycgtptvsdmck.supabase.co";
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

const getSupabaseAdmin = () => {
  if (
    !supabaseServiceRoleKey ||
    supabaseServiceRoleKey === "your_supabase_service_role_key"
  ) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY is not configured in environment variables. Admin tasks require the service role key.",
    );
  }
  return createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
};

export const adminCreateUser = createServerFn({ method: "POST" })
  .inputValidator(
    (d: any) =>
      d as {
        email: string;
        password?: string;
        fullName: string;
        role: "parent" | "driver" | "admin";
        phone?: string;
        metadata?: any;
      },
  )
  .handler(
    async ({ data: { email, password, fullName, role, phone, metadata } }) => {
      try {
        const supabaseAdmin = getSupabaseAdmin();

        // 1. Create auth user
        const { data: authData, error: authError } =
          await supabaseAdmin.auth.admin.createUser({
            email,
            password: password || "123456",
            email_confirm: true,
            user_metadata: { full_name: fullName, role },
            phone: phone || undefined,
            phone_confirm: !!phone,
          });

        if (authError) throw authError;
        if (!authData.user) throw new Error("Failed to create auth user.");

        // 2. Save profile
        const { error: profileError } = await supabaseAdmin
          .from("profiles")
          .insert({
            id: authData.user.id,
            full_name: fullName,
            email,
            phone: phone || null,
            role,
            status: "approved",
            ...metadata,
          });

        if (profileError) {
          // Rollback auth user creation if profile insert fails
          await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
          throw profileError;
        }

        return { success: true, user: authData.user };
      } catch (error: any) {
        console.error("adminCreateUser error:", error);
        return { success: false, error: error.message };
      }
    },
  );

export const adminUpdateUser = createServerFn({ method: "POST" })
  .inputValidator(
    (d: any) =>
      d as {
        id: string;
        email?: string;
        password?: string;
        fullName?: string;
        phone?: string;
        metadata?: any;
      },
  )
  .handler(
    async ({ data: { id, email, password, fullName, phone, metadata } }) => {
      try {
        const supabaseAdmin = getSupabaseAdmin();

        // 1. Update Auth settings (email/password/metadata) if provided
        const updateData: any = {};
        if (email) updateData.email = email;
        if (password) updateData.password = password;
        if (fullName) {
          updateData.user_metadata = updateData.user_metadata || {};
          updateData.user_metadata.full_name = fullName;
        }

        if (Object.keys(updateData).length > 0) {
          const { error: authError } =
            await supabaseAdmin.auth.admin.updateUserById(id, updateData);
          if (authError) throw authError;
        }

        // 2. Update profiles table
        const profileUpdates: any = {};
        if (fullName) profileUpdates.full_name = fullName;
        if (email) profileUpdates.email = email;
        if (phone !== undefined) profileUpdates.phone = phone || null;
        if (metadata) {
          Object.assign(profileUpdates, metadata);
        }

        if (Object.keys(profileUpdates).length > 0) {
          const { error: profileError } = await supabaseAdmin
            .from("profiles")
            .update(profileUpdates)
            .eq("id", id);
          if (profileError) throw profileError;
        }

        return { success: true };
      } catch (error: any) {
        console.error("adminUpdateUser error:", error);
        return { success: false, error: error.message };
      }
    },
  );

export const adminDeleteUser = createServerFn({ method: "POST" })
  .inputValidator((d: any) => d as { id: string })
  .handler(async ({ data: { id } }) => {
    try {
      const supabaseAdmin = getSupabaseAdmin();

      // Profiles has cascade delete constraint, so deleting auth user removes profile
      const { error } = await supabaseAdmin.auth.admin.deleteUser(id);
      if (error) throw error;

      return { success: true };
    } catch (error: any) {
      console.error("adminDeleteUser error:", error);
      return { success: false, error: error.message };
    }
  });

export const adminDisableUser = createServerFn({ method: "POST" })
  .inputValidator((d: any) => d as { id: string; disable: boolean })
  .handler(async ({ data: { id, disable } }) => {
    try {
      const supabaseAdmin = getSupabaseAdmin();
      const status = disable ? "disabled" : "approved";

      // Update profile status
      const { error: profileError } = await supabaseAdmin
        .from("profiles")
        .update({ status })
        .eq("id", id);

      if (profileError) throw profileError;

      // Update Auth ban duration (infinite to disable, none to enable)
      const { error: authError } =
        await supabaseAdmin.auth.admin.updateUserById(id, {
          ban_duration: disable ? "infinite" : "none",
        });

      if (authError) throw authError;

      return { success: true };
    } catch (error: any) {
      console.error("adminDisableUser error:", error);
      return { success: false, error: error.message };
    }
  });

export const adminResetPassword = createServerFn({ method: "POST" })
  .inputValidator((d: any) => d as { id: string; password?: string })
  .handler(async ({ data: { id, password } }) => {
    try {
      const supabaseAdmin = getSupabaseAdmin();
      const newPassword = password || "123456";

      const { error } = await supabaseAdmin.auth.admin.updateUserById(id, {
        password: newPassword,
      });

      if (error) throw error;
      return { success: true };
    } catch (error: any) {
      console.error("adminResetPassword error:", error);
      return { success: false, error: error.message };
    }
  });

export const adminAddParentWithStudent = createServerFn({ method: "POST" })
  .inputValidator(
    (d: any) =>
      d as {
        parentName: string;
        fatherName?: string;
        motherName?: string;
        email: string;
        phone?: string;
        address?: string;
        password?: string;
        studentName: string;
        registerNo: string;
        dob?: string;
        gender?: "male" | "female" | "other";
        class?: string;
        section?: string;
        pickupAddress?: string;
        dropAddress?: string;
        busId?: string;
        routeId?: string;
      },
  )
  .handler(
    async ({
      data: {
        parentName,
        fatherName,
        motherName,
        email,
        phone,
        address,
        password,
        studentName,
        registerNo,
        dob,
        gender,
        class: className,
        section,
        pickupAddress,
        dropAddress,
        busId,
        routeId,
      },
    }) => {
      const supabaseAdmin = getSupabaseAdmin();
      let authUser: any = null;

      try {
        // Fetch driver's name for assigned_driver if a bus is assigned
        let driverName = "";
        if (busId) {
          try {
            const { data: busData } = await supabaseAdmin
              .from("buses")
              .select("driver_name")
              .eq("id", busId)
              .single();
            if (busData?.driver_name) {
              driverName = busData.driver_name;
            }
          } catch (e) {
            console.error("Error fetching driver name for bus:", e);
          }
        }

        // 1. Create Auth User for parent
        const { data: authData, error: authError } =
          await supabaseAdmin.auth.admin.createUser({
            email,
            password: password || "123456",
            email_confirm: true,
            user_metadata: { full_name: parentName, role: "parent" },
            phone: phone || undefined,
            phone_confirm: !!phone,
          });

        if (authError) throw authError;
        if (!authData.user)
          throw new Error("Failed to create parent auth user.");
        authUser = authData.user;

        // 2. Create Profile for parent
        const { error: profileError } = await supabaseAdmin
          .from("profiles")
          .insert({
            id: authUser.id,
            full_name: parentName,
            parent_name: parentName, // workflow field
            email,
            phone: phone || null,
            role: "parent",
            status: "approved",
            first_login: true,
            password_changed: false, // workflow field
            created_by_admin: true, // workflow field
            student_name: studentName,
            student_roll_no: registerNo,
          });

        if (profileError) throw profileError;

        // 3. Create Parent entry
        const { error: parentError } = await supabaseAdmin
          .from("parents")
          .insert({
            id: authUser.id,
            auth_user_id: authUser.id, // workflow field
            parent_name: parentName, // workflow field
            email: email, // workflow field
            phone: phone || null, // workflow field
            father_name: fatherName || null,
            mother_name: motherName || null,
            address: address || null,
          });

        if (parentError) throw parentError;

        // 4. Create Student entry
        const dbStudent = {
          name: studentName,
          student_name: studentName, // workflow field
          student_roll_no: registerNo,
          roll_number: registerNo, // workflow field
          register_no: registerNo,
          class: className || "",
          section: section || "",
          pickup_address: pickupAddress || address || "",
          drop_address: dropAddress || address || "",
          parent_phone: phone || "",
          parent_id: authUser.id,
          assigned_parent_id: authUser.id, // workflow field
          bus_id: busId || null,
          assigned_bus: busId || null, // workflow field
          route_id: routeId || null,
          assigned_driver: driverName || null, // workflow field
          gender: gender || null,
          date_of_birth: dob || null,
          status: "pending",
          last_updated: new Date().toISOString(),
        };

        const { data: studentData, error: studentError } = await supabaseAdmin
          .from("students")
          .insert([dbStudent])
          .select();

        if (studentError) throw studentError;

        return { success: true, user: authUser, student: studentData?.[0] };
      } catch (error: any) {
        console.error("adminAddParentWithStudent error:", error);
        if (authUser?.id) {
          await supabaseAdmin.auth.admin.deleteUser(authUser.id);
        }
        return { success: false, error: error.message };
      }
    },
  );

export const adminAddDriver = createServerFn({ method: "POST" })
  .inputValidator(
    (d: any) =>
      d as {
        fullName: string;
        email: string;
        phone?: string;
        password?: string;
        licenseNumber: string;
        licenseExpiry?: string;
        experience?: number;
        address?: string;
        emergencyContact?: string;
        busId?: string;
        routeId?: string;
      },
  )
  .handler(
    async ({
      data: {
        fullName,
        email,
        phone,
        password,
        licenseNumber,
        licenseExpiry,
        experience,
        address,
        emergencyContact,
        busId,
        routeId,
      },
    }) => {
      const supabaseAdmin = getSupabaseAdmin();
      let authUser: any = null;

      try {
        // 1. Create Auth User for driver
        const { data: authData, error: authError } =
          await supabaseAdmin.auth.admin.createUser({
            email,
            password: password || "123456",
            email_confirm: true,
            user_metadata: { full_name: fullName, role: "driver" },
            phone: phone || undefined,
            phone_confirm: !!phone,
          });

        if (authError) throw authError;
        if (!authData.user)
          throw new Error("Failed to create driver auth user.");
        authUser = authData.user;

        // 2. Create Profile for driver
        const { error: profileError } = await supabaseAdmin
          .from("profiles")
          .insert({
            id: authUser.id,
            full_name: fullName,
            email,
            phone: phone || null,
            role: "driver",
            status: "approved",
            first_login: false,
            licence: licenseNumber,
            bus_id: busId || null,
          });

        if (profileError) throw profileError;

        // 3. Insert into drivers table
        const { error: driverError } = await supabaseAdmin
          .from("drivers")
          .insert({
            id: authUser.id,
            license_number: licenseNumber,
            license_expiry: licenseExpiry || null,
            experience: experience || null,
            address: address || null,
            emergency_contact: emergencyContact || null,
          });

        if (driverError) throw driverError;

        // 4. Update the assigned bus driver_id and driver_name
        if (busId) {
          const { error: busError } = await supabaseAdmin
            .from("buses")
            .update({
              driver_id: authUser.id,
              driver_name: fullName,
              route_id: routeId || null,
            })
            .eq("id", busId);

          if (busError) throw busError;
        }

        return { success: true, user: authUser };
      } catch (error: any) {
        console.error("adminAddDriver error:", error);
        if (authUser?.id) {
          await supabaseAdmin.auth.admin.deleteUser(authUser.id);
        }
        return { success: false, error: error.message };
      }
    },
  );

export const completeFirstLogin = createServerFn({ method: "POST" })
  .inputValidator((d: any) => d as { userId: string; password?: string })
  .handler(async ({ data: { userId, password } }) => {
    try {
      const supabaseAdmin = getSupabaseAdmin();

      // 1. Update Auth settings (password) if provided
      if (password) {
        const { error: authError } =
          await supabaseAdmin.auth.admin.updateUserById(userId, {
            password: password,
          });
        if (authError) throw authError;
      }

      // 2. Set first_login = false and password_changed = true
      const { error: profileError } = await supabaseAdmin
        .from("profiles")
        .update({ first_login: false, password_changed: true })
        .eq("id", userId);

      if (profileError) throw profileError;

      return { success: true };
    } catch (error: any) {
      console.error("completeFirstLogin error:", error);
      return { success: false, error: error.message };
    }
  });
