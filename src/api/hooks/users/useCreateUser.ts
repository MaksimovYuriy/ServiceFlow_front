import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createUser, type CreateUserPayload, type User } from "../../users";

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation<User, Error, CreateUserPayload>({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
}
