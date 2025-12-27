import React from 'react'
import { useFormAction, useNavigate } from 'react-router-dom';

const Register = () => {
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useFormAction({
        defaultValues: { role: "customer" },
    });

    const onSubmit = async (data) => {
        await registerUser(data);
        navigate("/login");
    };
    return (
        <div style={{ maxWidth: 420, margin: "40px auto" }}>
            <h2>Register</h2>

            <form onSubmit={handleSubmit(onSubmit)}>
                <div>
                    <label>Name</label>
                    <input {...register("name", { required: "Name is required" })} />
                    <p>{errors.name?.message}</p>
                </div>

                <div>
                    <label>Email</label>
                    <input {...register("email", { required: "Email is required" })} />
                    <p>{errors.email?.message}</p>
                </div>

                <div>
                    <label>Password</label>
                    <input type="password" {...register("password", { required: "Password is required" })} />
                    <p>{errors.password?.message}</p>
                </div>

                <div>
                    <label>Role</label>
                    <select {...register("role")}>
                        <option value="customer">Customer</option>
                        <option value="agent">Agent</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>

                <button disabled={isSubmitting} type="submit">
                    {isSubmitting ? "Creating..." : "Register"}
                </button>
            </form>
        </div>
    )
}

export default Register