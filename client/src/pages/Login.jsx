import { useSignIn } from "react-auth-kit"
import { Button, Card, Checkbox, Label, TextInput } from 'flowbite-react';
import { useState } from "react";
import { Navigate } from "react-router-dom";

export default function Login(){

    const signIn = useSignIn();

    const [redirect, setRedirect] = useState(false);

    const handleLogin = (ev) => {
        ev.preventDefault();
        signIn({
            token: "dont need",
            expiresIn: 3600,
            tokenType: "Bearer",
            authState: { data:"test" },
        });
        setRedirect(true);
        
    }

    if (redirect) {
        return <Navigate to={"/"}/>
    }

    return (
        <div className="flex flex-col items-center justify-center">
            <Card className="bg-vm-info-color-500">
                <form className="flex flex-col gap-4" onSubmit={handleLogin}>
                <div>
                    <div className="mb-2 block">
                    <Label htmlFor="email1" value="Username" />
                    </div>
                    <TextInput id="email1" type="text" placeholder="Username" required />
                </div>
                <div>
                    <div className="mb-2 block">
                    <Label htmlFor="password1" value="Password" />
                    </div>
                    <TextInput id="password1" type="password" required />
                </div>
                <Button type="submit" className="border-black text-black">Submit</Button>
                </form>
            </Card>
        </div>
    )
}
