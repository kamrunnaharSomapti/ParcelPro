import { Link } from "react-router-dom";
import { LogIn } from "lucide-react";
import LoginForm from "../../components/auth/LoginForm";

export default function LoginPage() {
    return (
        <main className="container mx-auto px-4 py-8">
            <div className="max-w-md mx-auto">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                        <LogIn className="h-8 w-8 text-primary" />
                    </div>
                    <h1 className="text-4xl font-bold tracking-tight mb-3">Welcome Back</h1>
                    <p className="text-lg text-muted-foreground">Sign in to access your account</p>
                </div>

                <div className="card p-8 md:p-10">
                    <LoginForm />

                    <div className="mt-8 text-center text-sm text-muted-foreground">
                        Don't have an account?{" "}
                        <Link to="/register" className="text-primary hover:underline font-medium">
                            Register
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    );
}
