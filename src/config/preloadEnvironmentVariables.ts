import { ENVIRONMENT_VARIABLES } from "./ENVIRONMENT_VARIABLES";

export const preloadEnvironmentVariables = () => {
  const variables = process.env;

  const notExisted = ENVIRONMENT_VARIABLES.filter(
    (variable) => !Object.keys(variables).includes(variable)
  );

  if (notExisted.length === 0) return true;

  console.error(
    `ERROR: The following fields are missing in the .env file:\n${notExisted.join(
      "\n"
    )}\nEND OF LIST`
  );
  return false;
};
