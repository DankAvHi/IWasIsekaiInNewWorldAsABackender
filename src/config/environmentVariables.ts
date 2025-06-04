import { ENVIRONMENT_VARIABLES } from "./ENVIRONMENT_VARIABLES";

export const environmentVariables = process.env as Record<
  (typeof ENVIRONMENT_VARIABLES)[number],
  string
>;
