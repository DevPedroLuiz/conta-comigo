import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { FinanceApp } from "./finance-app";

interface Todo {
  id: string;
  name: string;
}

export default async function Home() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  let todos: Todo[] = [];

  try {
    const result = await supabase.from("todos").select("id, name");
    if (result.error) {
      console.error("Supabase todos query failed:", result.error.message);
    } else {
      todos = (result.data as Todo[]) ?? [];
    }
  } catch (error) {
    console.error("Unable to load todos:", error);
  }

  return (
    <>
      <FinanceApp />
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>{todo.name}</li>
        ))}
      </ul>
    </>
  );
}

