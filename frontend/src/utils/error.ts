import axios from "axios";

// These have to be function delarations at the moment as never/asserts doesn't
// work with arrow functions: https://github.com/microsoft/TypeScript/issues/34523

/**
 * Allow exceptions to be thrown in expressions.
 *
 * This allows throws to be done inline e.g. `const id = obj.id ?? throwError("No id")`.
 *
 * `throw new Error(...)` should be preferred.
 *
 * Will become deprecated after https://github.com/tc39/proposal-throw-expressions.
 * @param args Error args
 */
export function throwError(...args: ConstructorParameters<typeof Error>): never {
    throw new Error(...args);
}

/**
 * Type helper for exhaustive checking.
 *
 * https://www.typescriptlang.org/docs/handbook/unions-and-intersections.html#union-exhaustiveness-checking
 * @param val Value that should not be reachable
 */
export function assertNever(val: never): never {
    throw new Error(`Unexpected value ${val} (${typeof val})`);
}

/**
 * Extract error message from axios error or fallback to default message
 */
export function getErrorMessage(error: unknown, fallbackMessage: string = "An error occurred"): string {
    let message = fallbackMessage;

    // Check if it's an axios error
    if (axios.isAxiosError(error)) {
        // Try to extract error message from response data
        const responseData = error.response?.data as Record<string, unknown> | undefined;

        if (responseData) {
            let detail = "";
            if (typeof responseData.detail === "string") {
                detail = responseData.detail;
            } else {
                console.debug(`Missing error detail in response data:`, responseData);
                detail = extractErrorMessages(responseData.detail).join(" ");
            }

            let errorKey = error.message;
            if (typeof responseData.error === "string") {
                errorKey = responseData.error;
            } else {
                console.debug(`Missing error field in response data:`, responseData);
            }

            message = detail ?? errorKey;
        } else {
            // Fallback to axios error message
            message = error.message;
        }
    } else if (error instanceof Error) {
        // Check if it's a regular Error
        message = error.message;
    }

    return message;
}

export function extractErrorMessages(error: unknown): string[] {
    const messages: string[] = [];

    const visit = (value: unknown, parentKey?: string) => {
        if (typeof value === "string") {
            messages.push(parentKey ? `${parentKey}: ${value}` : value);
            return;
        }

        if (Array.isArray(value)) {
            value.forEach((v) => visit(v, parentKey));
            return;
        }

        if (typeof value === "object" && value !== null) {
            Object.entries(value).forEach(([key, val]) => {
                if (key === "non_field_errors") {
                    visit(val, parentKey);
                } else {
                    visit(val, key);
                }
            });
        }
    };

    if (typeof error === "object" && error !== null) {
        const err = error;
        visit((err as Record<string, unknown>).detail ?? err);
    } else {
        messages.push(error ? String(error) : "Unknown error");
    }

    return messages.length ? messages : [];
}
