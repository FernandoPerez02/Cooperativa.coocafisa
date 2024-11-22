"use client";
import { ProtectedRoute } from "../../components/middleware";
export default function Homepage() {
    return (
        <ProtectedRoute allowedRoles={["Administrador"]}/>
    );
}
