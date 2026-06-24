"use client";

import { use } from "react";
import { useQuery } from "@apollo/client/react";
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

export default function UserPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data, loading, error } = useQuery(GET_USER, { variables: { id } });

  if(loading) return <p>Loading...</p>;
  if(error) return <p>Error: {error.message}</p>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold mb-4">User</h1>
      <p className="font-medium">Name: {data?.user.fullName}</p>
      <p className="font-medium">Email: {data?.user.email}</p>
    </div>
  );
}