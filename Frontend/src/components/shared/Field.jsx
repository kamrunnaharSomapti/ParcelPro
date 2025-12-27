export default function Field({ label, error, children }) {
    return (
        <div className="space-y-1.5">
            {label ? <label className="text-sm font-medium">{label}</label> : null}
            {children}
            {error ? (
                <p className="text-sm text-red-500">{error.message}</p>
            ) : null}
        </div>
    );
}
