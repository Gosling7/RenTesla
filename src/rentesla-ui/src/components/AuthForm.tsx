import { LabeledInput } from "./LabeledInput";
import { Button } from "./Button";

interface AuthFormProps {
    mode: "login" | "register";
    email: string;
    password: string;
    emailError?: string;
    passwordError?: string;
    onEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSubmit: (e: React.FormEvent) => void;
}

export const AuthForm = ({
    mode,
    email,
    password,
    emailError,
    passwordError,
    onEmailChange,
    onPasswordChange,
    onSubmit,
}: AuthFormProps) => {
    return (
        <form onSubmit={onSubmit} className="space-y-4">
            <LabeledInput
                label="Email"
                type="email"
                value={email}
                onChange={onEmailChange}
                placeholder="Enter your email"
                required
                error={emailError}
            />
        
            <LabeledInput
                label="Password"
                type="password"
                value={password}
                onChange={onPasswordChange}
                placeholder="Enter your password"
                required
                error={passwordError}
            />
            
            <Button type="submit">
                {mode === "login" ? "Login" : "Register"}
            </Button>
        </form>
    );
};