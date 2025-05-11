// app/login/page.tsx
"use client";

import { useLogin } from "@/hook/useLogin";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { mutate, isPending, isSuccess, isError, error } = useLogin();
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate({ username, password });
  };

  return (
    <main style={{ padding: "2rem" }}>
      <h2 style={{ color: "red", padding: "4px" }}>username: emilys</h2>
      <h2 style={{ color: "red", padding: "4px" }}>password: emilyspass</h2>
      <form onSubmit={handleSubmit} style={{ marginTop: "20px" }}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          style={{
            padding: "7px",
            marginBottom: "10px",
            border: "2px solid grey",
          }}
        />
        <br />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{
            padding: "7px",
            marginBottom: "10px",
            border: "2px solid grey",
          }}
        />
        <br />
        <button
          type="submit"
          disabled={isPending}
          style={{
            cursor: "pointer",
            marginRight: "10px",
            backgroundColor: "blue",
            color: "yellow",
            padding: "7px",
          }}
        >
          {isPending ? "Logging in..." : "Login"}
        </button>
      </form>
      {isSuccess && <p>Login successful!</p>}
      {isError && <p>Error: {error.message}</p>}
    </main>
  );
}
