import { useState } from "react";
import { useForm } from "react-hook-form";
import { Mail, Lock, Eye, LogIn } from "lucide-react";
import { useNavigate } from "react-router-dom";

import Field from "../shared/Field";
import { useAuth } from "../../hooks/useAuth";
import { authApi } from "../../services/auth/auth.api";

const ROLE_REDIRECT = {
    admin: "/admin",
    agent: "/agent",
    customer: "/customer",
};

export default function LoginForm() {
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const { setAuth } = useAuth();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        setError,
    } = useForm({
        defaultValues: { role: "customer" },
    });

    const submitForm = async (formData) => {
        try {
            const res = await authApi.login({
                email: formData.email,
                password: formData.password,
                role: formData.role,
            });
            // console.log(res);
            // redirect to role page


            const token = res.token || res.data.token;
            const user = res.user || res.data.user;

            if (!token || !user) {
                throw new Error("Invalid login response: token/user missing");
            }

            setAuth({ token, user });
            const role = user.role?.toLowerCase();
            const path = ROLE_REDIRECT[role] || "/customer";
            navigate(path, { replace: true });
        } catch (err) {
            const msg =
                err?.response?.data?.message ||
                err?.message ||
                "Login failed. Please check credentials.";

            setError("root.server", { type: "server", message: msg });
        }
    };

    return (
        <form className="space-y-5" onSubmit={handleSubmit(submitForm)}>
            {/* Email */}
            <Field label="Email Address" error={errors.email}>
                <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                        {...register("email", { required: "Email is required" })}
                        placeholder="you@example.com"
                        className={`input pl-10 ${errors.email ? "border-red-500" : ""}`}
                        type="email"
                    />
                </div>
            </Field>

            {/* Password */}
            <Field label="Password" error={errors.password}>
                <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                        {...register("password", {
                            required: "Password is required",
                            minLength: { value: 6, message: "Min 6 characters" },
                        })}
                        className={`input pl-10 pr-10 ${errors.password ? "border-red-500" : ""}`}
                        placeholder="Enter your password"
                        type={showPassword ? "text" : "password"}
                    />
                    <Eye
                        onClick={() => setShowPassword((p) => !p)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground cursor-pointer"
                    />
                </div>
            </Field>

            {/* Role */}
            <Field label="Login As" error={errors.role}>
                <select className="input" {...register("role", { required: "Role is required" })}>
                    <option value="customer">Customer</option>
                    <option value="agent">Delivery Agent</option>
                    <option value="admin">Admin</option>
                </select>
            </Field>

            {/* Server error */}
            {errors?.root?.server?.message ? (
                <p className="text-sm text-red-500">{errors.root.server.message}</p>
            ) : null}

            <Field>
                <button className="btn btn-primary w-full text-base h-11" type="submit" disabled={isSubmitting}>
                    <LogIn className="h-4 w-4 mr-2" />
                    {isSubmitting ? "Signing in..." : "Sign in"}
                </button>
            </Field>
        </form>
    );
}
