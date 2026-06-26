"use client";

import Link from "next/link";
import { useQuery } from "@apollo/client/react";
import { gql, TypedDocumentNode } from "@apollo/client";

type User = {
  id: string;
  fullName: string;
  email: string;
};

export const GET_USERS: TypedDocumentNode<{ users: User[] }> = gql`
  query GetUsers {
    users {
      id
      fullName
      email
    }
  }
`;

export default function UsersPage() {
  const { data, loading, error } = useQuery(GET_USERS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">Users</h1>
        <Link href="/users/new" className="bg-black text-white rounded px-4 py-2 text-sm">
          Create User
        </Link>
      </div>
      <ul className="flex flex-col gap-2">
        {data?.users.map((user) => (
          <li key={user.id} className="border rounded p-4">
            <p className="font-medium">{user.fullName}</p>
            <p className="text-zinc-500 text-sm">{user.email}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
