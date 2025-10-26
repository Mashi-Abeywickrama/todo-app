export function handleApiError(error: unknown): string {
  if (error && typeof error === "object" && "response" in error) {
    const err = error as any;
    return err.response?.data?.message || "An unexpected server error occurred.";
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "Something went wrong.";
}