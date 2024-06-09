import { QueryClient, QueryClientProvider, useMutation, useQuery } from "@tanstack/react-query";
import React from "react";


// Initialize QueryClient
const queryClient = new QueryClient();

function App() {
  const { data, error, isLoading, isError, isSuccess } = useQuery({
    queryKey: ["todo"],
    queryFn: () =>
      fetch("https://jsonplaceholder.typicode.com/posts").then((res) =>
        res.json()
      ),
    refetchInterval: 4000,
  });

  const { mutate, isLoading: isPending } = useMutation({
    mutationFn: (newPost) =>
      fetch("https://jsonplaceholder.typicode.com/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newPost),
      }).then((res) => res.json()),
    onSuccess: () => {
      // Invalidate and refetch the "todo" query to update the list
      queryClient.invalidateQueries("todo");
    },
  });

  if (error || isError) return <div>There was an error!</div>;
  if (isLoading) return <div>DATA IS LOADING...</div>;

  return (
    <div className="App">
      {isPending && <p>DATA IS BEING ADDED...</p>}
      <button
        onClick={() =>
          mutate({
            userId: 5000,
            id: 4000,
            title: "Hey my name is Pedro and this is my Channel!",
            body: "This is the body of this post",
          })
        }
      >
        Add Post
      </button>
      <div>
        {data?.map((todo) => (
          <div key={todo.id}>
            <h4>ID: {todo.id}</h4>
            <h4>TITLE: {todo.title}</h4>
            <p>{todo.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function WrappedApp() {
  return (
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  );
}
