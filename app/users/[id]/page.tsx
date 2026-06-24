"use client";

import Link from "next/link";
import { use } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation } from "@apollo/client/react";
import { gql, TypedDocumentNode } from "@apollo/client";

type User = {
  id: string;
  fullName: string;
  email: string;
};

const GET_USER: TypedDocumentNode<{ user: User }, { id: string }> = gql`
  query GetUser($id: ID!) {
    user(id: $id) {
      id
      fullName
      email
    }
  }
`;

const DELETE_USER: TypedDocumentNode<{ deleteUser: { user: User } }, { input: { id: string } }> = gql`
  mutation DeleteUser($input: DeleteUserInput!) {
    deleteUser(input: $input) {
      user {
        id
      }
    }
  }
`;

export default function UserPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { data, loading, error } = useQuery(GET_USER, { variables: { id } });
  const [deleteUser, { loading: deleting }] = useMutation(DELETE_USER);

  const handleDelete = async () => {
    await deleteUser({ variables: { input: { id } } });
    router.push("/users");
  };

  if(loading) return <p>Loading...</p>;
  if(error) return <p>Error: {error.message}</p>;

  return (
    <div className="p-8 max-w-md">
      <Link href="/users" className="text-sm text-zinc-500 hover:text-black">
        ← Back to Users
      </Link>
      <div className="mt-6 border rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-semibold">{data?.user.fullName}</h1>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="text-sm text-red-500 hover:text-red-700 disabled:opacity-50"
          >
            {deleting ? "Deleting..." : "Delete"}
          </button>
        </div>
        <p className="text-zinc-500 text-sm">{data?.user.email}</p>
      </div>
    </div>
  );
}