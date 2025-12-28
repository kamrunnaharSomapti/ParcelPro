import { Link } from "react-router-dom";
import RegisterForm from "../../components/auth/RegisterForm";

export default function RegisterPage() {
    return (
        <main className="container mx-auto px-4 py-8">
            <div className="max-w-md mx-auto">
                <h1 className="text-3xl font-bold mb-2">Create account</h1>
                <p className="text-muted-foreground mb-6">Register as a customer</p>

                <div className="card p-8">
                    <RegisterForm />

                    <div className="mt-6 text-center text-sm text-muted-foreground">
                        Already have an account?{" "}
                        <Link to="/login" className="text-primary hover:underline font-medium">
                            Login
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    );
}
