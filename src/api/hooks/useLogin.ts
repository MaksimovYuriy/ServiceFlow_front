import { useMutation } from "@tanstack/react-query";
import { loginRequest, type LoginAttributes } from "../auth";

export function useLogin() {
  return useMutation({
    mutationFn: (payload: LoginAttributes) => loginRequest(payload).then(r => r.data),
  });
}
