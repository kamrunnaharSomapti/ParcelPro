import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import Field from "../shared/Field";
import { authApi } from "../../services/auth/auth.api";
import { useAuth } from "../../hooks/useAuth";

const ROLE_REDIRECT = {
    admin: "/admin",
    agent: "/agent",
    customer: "/customer",
};

export default function RegisterForm() {
    const navigate = useNavigate();
    const { setAuth } = useAuth();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        setError,
    } = useForm({
        defaultValues: {
            role: "customer",
        },
    });

    const onSubmit = async (formData) => {
        try {
            const res = await authApi.register({
                name: formData.name,
                email: formData.email,
                password: formData.password,
                phone: formData.phone,
                role: "customer",
            });
            console.log("response of registration page", res);


            const token = res.token;
            const user = res?.data?.user;


            setAuth({ token, user });
            navigate(ROLE_REDIRECT[user.role] || "/customer", { replace: true });

        } catch (err) {
            const msg =
                err?.response?.data?.message || "Registration failed. Try again.";
            setError("root.server", { type: "server", message: msg });
        }
    };

    return (
        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
            <Field label="Full Name" error={errors.name}>
                <input
                    className={`input ${errors.name ? "border-red-500" : ""}`}
                    placeholder="Your name"
                    {...register("name", { required: "Name is required" })}
                />
            </Field>

            <Field label="Email" error={errors.email}>
                <input
                    className={`input ${errors.email ? "border-red-500" : ""}`}
                    placeholder="you@example.com"
                    {...register("email", { required: "Email is required" })}
                />
            </Field>

            <Field label="Phone" error={errors.phone}>
                <input
                    className={`input ${errors.phone ? "border-red-500" : ""}`}
                    placeholder="01XXXXXXXXX"
                    {...register("phone", { required: "Phone is required" })}
                />
            </Field>

            <Field label="Password" error={errors.password}>
                <input
                    type="password"
                    className={`input ${errors.password ? "border-red-500" : ""}`}
                    placeholder="At least 6 characters"
                    {...register("password", {
                        required: "Password is required",
                        minLength: { value: 6, message: "Minimum 6 characters" },
                    })}
                />
            </Field>

            {errors?.root?.server?.message ? (
                <p className="text-sm text-red-500">{errors.root.server.message}</p>
            ) : null}

            <button className="btn btn-primary w-full h-11" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create Account"}
            </button>
        </form>
    );
}
