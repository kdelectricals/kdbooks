import { useSession, signOut } from "next-auth/react";

export default function Dashboard() {
  const { data: session } = useSession();

  if (!session) return <p>Loading...</p>;

  return (
    <div>
      <h1>Welcome, {session.user?.email}</h1>
      {session.user?.role === "admin" ? <p>Invoice Section (Only for Admins)</p> : <p>Invoice Hidden</p>}
      <button onClick={() => signOut()}>Logout</button>
    </div>
  );
}
