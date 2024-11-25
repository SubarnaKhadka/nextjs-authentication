"user server";

import { AUTH_SESSION_TOKEN_NAME } from "@/lib/constants";
import { cookies } from "next/headers";

export const logout = async () => {
  (await cookies()).delete(AUTH_SESSION_TOKEN_NAME);
};
