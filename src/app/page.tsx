import Link from "next/link"

export default function HomePage() {
  return (
    <main style={{ padding: '2rem' }}>
      <h1>SSR + React Query Product List</h1>
      <Link href={"/products"}>
        <button style={{ cursor: 'pointer',marginRight: '10px',backgroundColor: 'red', color: 'white', padding: '7px' }}>Products page</button>
      </Link>

      <Link href={"/login"}>
      <button style={{ cursor: 'pointer',marginRight: '10px', backgroundColor: 'blue', color: 'white', padding: '7px' }}>Login Page</button>
      </Link>  
    </main>
  );
}