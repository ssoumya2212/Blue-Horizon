import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";

// @ts-ignore
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || (typeof process !== "undefined" ? process.env.VITE_SUPABASE_URL : "");
// @ts-ignore
const supabaseServiceRoleKey = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY || import.meta.env.SUPABASE_SERVICE_ROLE_KEY || (typeof process !== "undefined" ? process.env.SUPABASE_SERVICE_ROLE_KEY : "");
// @ts-ignore
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || (typeof process !== "undefined" ? process.env.VITE_SUPABASE_ANON_KEY : "");

const getSupabaseAdmin = () => {
  console.log("DEBUG: supabaseServiceRoleKey =", supabaseServiceRoleKey ? "EXISTS" : "UNDEFINED");
  if (!supabaseServiceRoleKey || supabaseServiceRoleKey === "your_supabase_service_role_key") {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is not configured in environment variables.");
  }
  return createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
};

async function verifyAuth(token: string, requireAdmin: boolean = true) {
  if (!token) throw new Error("Unauthorized: No token provided");
  if (!supabaseUrl || !supabaseAnonKey) throw new Error("Supabase config missing");
  
  const supabase = createClient(supabaseUrl, supabaseAnonKey);
  const { data: { user }, error } = await supabase.auth.getUser(token);
  
  if (error || !user) throw new Error("Unauthorized: Invalid token");
  
  if (requireAdmin) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();
      
    if (!profile || profile.role !== "admin") {
      throw new Error("Forbidden: Admin access required");
    }
  }
  return user;
}

export const adminCreateUser = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      token: z.string(),
      email: z.string().email(),
      password: z.string().optional(),
      fullName: z.string(),
      role: z.enum(["parent", "driver", "admin"]),
      phone: z.string().optional(),
      metadata: z.any().optional(),
    })
  )
  .handler(
    async ({ data: { token, email, password, fullName, role, phone, metadata } }) => {
      try {
        await verifyAuth(token, true);
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
    z.object({
      token: z.string(),
      id: z.string(),
      email: z.string().email().optional(),
      password: z.string().min(6).optional(),
      fullName: z.string().optional(),
      phone: z.string().optional(),
      metadata: z.any().optional(),
    })
  )
  .handler(
    async ({ data: { token, id, email, password, fullName, phone, metadata } }) => {
      try {
        await verifyAuth(token, true);
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
  .inputValidator(z.object({ token: z.string(), id: z.string() }))
  .handler(async ({ data: { token, id } }) => {
    try {
      await verifyAuth(token, true);
      const supabaseAdmin = getSupabaseAdmin();

      const { error } = await supabaseAdmin.auth.admin.deleteUser(id);
      if (error) throw error;

      return { success: true };
    } catch (error: any) {
      console.error("adminDeleteUser error:", error);
      return { success: false, error: error.message };
    }
  });

export const adminDisableUser = createServerFn({ method: "POST" })
  .inputValidator(z.object({ token: z.string(), id: z.string(), disable: z.boolean() }))
  .handler(async ({ data: { token, id, disable } }) => {
    try {
      await verifyAuth(token, true);
      const supabaseAdmin = getSupabaseAdmin();
      const status = disable ? "disabled" : "approved";

      const { error: profileError } = await supabaseAdmin
        .from("profiles")
        .update({ status })
        .eq("id", id);

      if (profileError) throw profileError;

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
  .inputValidator(z.object({ token: z.string(), id: z.string(), password: z.string().optional() }))
  .handler(async ({ data: { token, id, password } }) => {
    try {
      await verifyAuth(token, true);
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
    z.object({
      token: z.string(),
      parentName: z.string(),
      fatherName: z.string().optional(),
      motherName: z.string().optional(),
      email: z.string().email(),
      phone: z.string().optional(),
      address: z.string().optional(),
      password: z.string().optional(),
      studentName: z.string(),
      registerNo: z.string(),
      dob: z.string().optional(),
      gender: z.enum(["male", "female", "other"]).optional(),
      class: z.string().optional(),
      section: z.string().optional(),
      pickupAddress: z.string().optional(),
      dropAddress: z.string().optional(),
      busId: z.string().optional(),
      routeId: z.string().optional(),
    })
  )
  .handler(
    async ({
      data: {
        token,
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
      let authUser: any = null;

      try {
        await verifyAuth(token, true);
        const supabaseAdmin = getSupabaseAdmin();

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
        if (!authData.user) throw new Error("Failed to create parent auth user.");
        authUser = authData.user;

        const { error: profileError } = await supabaseAdmin
          .from("profiles")
          .insert({
            id: authUser.id,
            full_name: parentName,
            parent_name: parentName,
            email,
            phone: phone || null,
            role: "parent",
            status: "approved",
            password_changed: false,
            created_by_admin: true,
            student_name: studentName,
            student_roll_no: registerNo,
          });

        if (profileError) throw profileError;

        try {
          const { error: parentError } = await supabaseAdmin
            .from("parents")
            .insert({
              id: authUser.id,
              auth_user_id: authUser.id,
              parent_name: parentName,
              email: email,
              phone: phone || null,
              father_name: fatherName || null,
              mother_name: motherName || null,
              address: address || null,
            });
          if (parentError) console.error("Ignoring parents table insert error:", parentError.message);
        } catch (e) {
           console.error("Parents insert failed", e);
        }

        const dbStudent = {
          name: studentName,
          student_name: studentName,
          student_roll_no: registerNo,
          roll_number: registerNo,
          class: className || "",
          section: section || "",
          pickup_address: pickupAddress || address || "N/A",
          drop_address: dropAddress || address || "N/A",
          parent_phone: phone || "",
          parent_id: authUser.id,
          assigned_parent_id: authUser.id,
          bus_id: busId || null,
          assigned_bus: busId || null,
          route_id: routeId || null,
          assigned_driver: driverName || null,
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
          try {
             const supabaseAdmin = getSupabaseAdmin();
             await supabaseAdmin.auth.admin.deleteUser(authUser.id);
          } catch(e) {}
        }
        console.error("adminAddParent explicitly caught error:", error);
        return { success: false, error: error.message || "Unknown error" };
      }
    },
  );

export const adminAddDriver = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      token: z.string(),
      fullName: z.string(),
      email: z.string().email(),
      phone: z.string().optional(),
      password: z.string().optional(),
      licenseNumber: z.string(),
      licenseExpiry: z.string().optional(),
      experience: z.number().optional(),
      address: z.string().optional(),
      emergencyContact: z.string().optional(),
      busId: z.string().optional(),
      routeId: z.string().optional(),
      bloodGroup: z.string().optional(),
      medicalCertificateUrl: z.string().optional(),
    })
  )
  .handler(
    async ({
      data: {
        token,
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
        bloodGroup,
        medicalCertificateUrl,
      },
    }) => {
      let authUser: any = null;

      try {
        await verifyAuth(token, true);
        const supabaseAdmin = getSupabaseAdmin();

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
        if (!authData.user) throw new Error("Failed to create driver auth user.");
        authUser = authData.user;

        const { error: profileError } = await supabaseAdmin
          .from("profiles")
          .insert({
            id: authUser.id,
            full_name: fullName,
            email,
            phone: phone || null,
            role: "driver",
            status: "approved",
            licence: licenseNumber,
            bus_id: busId || null,
          });

        if (profileError) throw profileError;

        try {
          const { error: driverError } = await supabaseAdmin
            .from("drivers")
            .insert({
              id: authUser.id,
              license_number: licenseNumber,
              license_expiry: licenseExpiry || null,
              experience: experience || null,
              address: address || null,
              emergency_contact: emergencyContact || null,
              blood_group: bloodGroup || null,
              medical_certificate_url: medicalCertificateUrl || null,
            });
          if (driverError) console.error("Ignoring drivers table insert error:", driverError.message);
        } catch (e) {
           console.error("Drivers insert failed", e);
        }

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
          try {
            const supabaseAdmin = getSupabaseAdmin();
            await supabaseAdmin.auth.admin.deleteUser(authUser.id);
          } catch(e) {}
        }
        console.error("adminAddDriver explicitly caught error:", error);
        return { success: false, error: error.message || "Unknown error" };
      }
    },
  );

export const completeFirstLogin = createServerFn({ method: "POST" })
  .inputValidator(z.object({ token: z.string(), userId: z.string(), password: z.string().optional() }))
  .handler(async ({ data: { token, userId, password } }) => {
    try {
      const user = await verifyAuth(token, false);
      // Ensure the user can only change their own password
      if (user.id !== userId) {
        throw new Error("Forbidden: You can only complete first login for your own account.");
      }
      
      const supabaseAdmin = getSupabaseAdmin();

      if (password) {
        const { error: authError } = await supabaseAdmin.auth.admin.updateUserById(userId, {
          password: password,
        });
        if (authError) throw authError;
      }

      const { error: profileError } = await supabaseAdmin
        .from("profiles")
        .update({ password_changed: true })
        .eq("id", userId);

      if (profileError) throw profileError;

      return { success: true };
    } catch (error: any) {
      console.error("completeFirstLogin error:", error);
      return { success: false, error: error.message };
    }
  });
