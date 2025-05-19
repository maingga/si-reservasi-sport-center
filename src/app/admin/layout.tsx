import type { Metadata } from "next";
import React from "react";
import AdminLayout from "@/layout/AdminLayout"; // Client Component

export const metadata: Metadata = {
  title: "SI Sport Center - Admin Dashboard",
  description: "Dashboard admin untuk manajemen SI Sport Center",
};

export default function AdminLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminLayout>{children}</AdminLayout>;
}
