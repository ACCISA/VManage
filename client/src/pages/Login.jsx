import { useSignIn } from "react-auth-kit"
import { Button, Card, Checkbox, Label, TextInput } from 'flowbite-react';
import { useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";

export default function Login(){

    const signIn = useSignIn();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [redirect, setRedirect] = useState(false);
    const [invalid, setInvalid] = useState(false);

    const handleLogin = (ev) => {
        ev.preventDefault();
        console.log("heee")
        axios.post("/login", {
            "username": username,
            "password": password
        },
        {
            headers: {
              'Content-Type': 'application/json',
            },
        })
        .then(res => {
            console.log("ht")
            console.log(res.data)
            if (res.data.status == "valid"){
                signIn({
                    token: "dont need",
                    expiresIn: 3600,
                    tokenType: "Bearer",
                    authState: { data:"test" },
                });
                setRedirect(true)
                return;
            }
            setInvalid(true);
        })
        .catch(res => {
            setInvalid(true);
        });
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
                    <TextInput id="email1" value={username} type="text" onChange={ev => setUsername(ev.target.value)} placeholder="Username" required />
                </div>
                <div>
                    <div className="mb-2 block">
                    <Label htmlFor="password1" value="Password" />
                    </div>
                    <TextInput id="password1" value={password} type="password" onChange={ev => setPassword(ev.target.value)} required />
                </div>
                {invalid && <div className="text-red-600 font-bold">Invalid Credentials</div>}
                <Button type="submit" className="border-black text-black">Submit</Button>
                </form>
            </Card>
        </div>
    )
}
