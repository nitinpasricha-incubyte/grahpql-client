import { render, screen } from "@testing-library/react";
import { MockedProvider } from "@apollo/client/testing/react";
import UsersPage, { GET_USERS } from "./page";

// Each entry describes ONE expected GraphQL operation and the canned response
// MockLink should return when it sees a matching request.
const mocks = [
  {
    request: { query: GET_USERS },
    result: {
      data: {
        users: [
          { id: "1", fullName: "Alice Smith", email: "alice@test.com" },
          { id: "2", fullName: "Bob Jones", email: "bob@test.com" },
        ],
      },
    },
  },
];

describe("UsersPage", () => {
  it("shows a loading state, then renders the list of users", async () => {
    render(
      <MockedProvider mocks={mocks}>
        <UsersPage />
      </MockedProvider>
    );

    // First render: query is in-flight, component returns "Loading..."
    expect(screen.getByText("Loading...")).toBeInTheDocument();

    // findByText waits (polls) until the mock resolves and React re-renders.
    expect(await screen.findByText("Alice Smith")).toBeInTheDocument();
    expect(screen.getByText("alice@test.com")).toBeInTheDocument();
    expect(screen.getByText("Bob Jones")).toBeInTheDocument();
  });
});
