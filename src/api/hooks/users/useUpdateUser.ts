import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUser, type UpdateUserPayload, type User } from "../../users";

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation<User, Error, UpdateUserPayload>({
    mutationFn: updateUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
}
