import { EnvironmentVariables } from '../runtime/environment-vairables';

const LOG_ENTRIES_LIMIT = 3;

const loggedErrors: { [key: string]: undefined | number } = {};
const loggedWarnings: { [key: string]: undefined | number } = {};
const loggedDebug: { [key: string]: undefined | number } = {};

const logErrorToConsole = (
  errorKey: string,
  caughtValue: unknown,
  error: unknown,
  caughtValueIsInstanceOfError: boolean,
  extraData: unknown
) => {
  console.error('Logged error with key: ' + errorKey);

  if (!caughtValueIsInstanceOfError) {
    console.error('Caught value is not an instance of Error:', caughtValue);
  }

  console.error(error);

  if (typeof extraData !== 'undefined') {
    console.error('Error extra data:', extraData);
  }
};

const Logger = {
  logDebug(key: string, extraData?: unknown) {
    if (EnvironmentVariables.LOG_DEBUG) {
      const numberOfTimesLogged = loggedDebug[key] || 0;

      if (
        EnvironmentVariables.DISABLE_LOGGING_LIMIT ||
        numberOfTimesLogged < LOG_ENTRIES_LIMIT
      ) {
        loggedDebug[key] = numberOfTimesLogged + 1;

        // TODO: Implement remote logging here

        /*
          Some remote loggers also capture console messages.
          Maybe it's best to just call either the remote logger or the console,
          and not both, so we don't get twice the events.
        */

        console.log('----- DEBUG: ' + key, '\nExtra data:', extraData);
      }
    }
  },

  logWarning(key: string, message: string, extraData?: unknown) {
    const numberOfTimesLogged = loggedWarnings[key] || 0;

    if (
      EnvironmentVariables.DISABLE_LOGGING_LIMIT ||
      numberOfTimesLogged < LOG_ENTRIES_LIMIT
    ) {
      loggedWarnings[key] = numberOfTimesLogged + 1;

      // TODO: Implement remote logging here

      /*
        Some remote loggers also capture console messages.
        Maybe it's best to just call either the remote logger or the console,
        and not both, so we don't get twice the events.
      */
      console.warn('Logged warning with key: ' + key + '. ' + message);
      console.warn('Extra data:', extraData);
    }
  },

  logError(
    errorKey: string,
    /*
      In Javascript, any value type can be thrown,
      so we don't know if a caught value is actually an Error instance.
    */
    caughtValue: unknown,
    extraData?: unknown
  ) {
    const caughtValueIsInstanceOfError = caughtValue instanceof Error;
    const error = caughtValueIsInstanceOfError ? caughtValue : new Error();

    const numberOfTimesLogged = loggedErrors[errorKey] || 0;

    if (
      EnvironmentVariables.DISABLE_LOGGING_LIMIT ||
      numberOfTimesLogged < LOG_ENTRIES_LIMIT
    ) {
      loggedErrors[errorKey] = numberOfTimesLogged + 1;

      // TODO: Implement remote logging here

      /*
        Some remote loggers also capture console messages.
        Maybe it's best to just call either the remote logger or the console,
        and not both, so we don't get twice the events.
      */
      logErrorToConsole(
        errorKey,
        caughtValue,
        error,
        caughtValueIsInstanceOfError,
        extraData
      );
    }
  },
};

export { Logger };
