import { useQuery } from "@tanstack/react-query";
import { fetchUsers, type User } from "../users";

export function useUsers() {
  return useQuery<User[], Error>({
    queryKey: ["users"],
    queryFn: fetchUsers,
    staleTime: 1000 * 60, // 1 минута кэширования
    refetchOnWindowFocus: false, // не перезагружать при возврате на страницу
  });
}
