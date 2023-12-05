/* eslint-disable no-console */
import { inspect } from 'util';
import { EnvironmentVariables } from '../runtime/environment-variables';
import { Injectable } from '@nestjs/common';

function nestedValuesToString(value: unknown) {
  return inspect(value, undefined, 10);
}

@Injectable()
export class LoggingService {
  logDebug(key: string, extraData?: unknown) {
    if (EnvironmentVariables.LOG_DEBUG) {
      console.log(
        nestedValuesToString({
          key,
          extraData,
        }),
      );
    }
  }

  logInfo(key: string, extraData?: unknown) {
    console.info(
      nestedValuesToString({
        key,
        extraData,
      }),
    );
  }

  logWarning(key: string, extraData?: unknown) {
    console.warn(
      nestedValuesToString({
        key,
        extraData,
      }),
    );
  }

  logError(
    key: string,
    /*
        In Javascript, any value type can be thrown,
        so we don't know if a caught value is actually an Error instance.
    */
    caughtValue: unknown,
    extraData?: unknown,
  ) {
    console.error(nestedValuesToString({ key, caughtValue, extraData }));
  }
}
