"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useMutation } from "@apollo/client/react";
import { gql, TypedDocumentNode } from "@apollo/client";
import { GET_USERS } from "../page";

type User = {
  id: string;
  fullName: string;
  email: string;
};

type CreateUserData = { createUser: { user: User } };
type CreateUserInput = { firstName: string; lastName: string; email: string };
type CreateUserVars = { input: CreateUserInput };

const CREATE_USER: TypedDocumentNode<CreateUserData, CreateUserVars> = gql`
  mutation CreateUser($input: CreateUserInput!) {
    createUser(input: $input) {
      user {
        id
        fullName
        email
      }
    }
  }
`;

export default function NewUserPage() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");

  const [createUser, { loading, error }] = useMutation(CREATE_USER, {
    refetchQueries: [{ query: GET_USERS }],
  });

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    const result = await createUser({ variables: { input: { firstName, lastName, email } } });
    const id = result.data?.createUser.user.id;
    router.push(`/users/${id}`);
  };

  return (
    <div className="p-8 max-w-md">
      <h1 className="text-2xl font-semibold mb-6">Create User</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="First name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
          className="border rounded px-3 py-2"
        />
        <input
          type="text"
          placeholder="Last name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
          className="border rounded px-3 py-2"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="border rounded px-3 py-2"
        />
        {error && <p className="text-red-500 text-sm">{error.message}</p>}
        <button
          type="submit"
          disabled={loading}
          className="bg-black text-white rounded px-4 py-2 disabled:opacity-50"
        >
          {loading ? "Creating..." : "Create User"}
        </button>
      </form>
    </div>
  );
}
