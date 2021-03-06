import LegacyDispatchFunction from '../LegacyDispatchFunction';
import ActionFunction from '../ActionFunction';
import ActionContext from '../ActionContext';
import install from './install';
import actionStack from './actionStack';

let isInstalled = false;
let uninstall: () => void;

export function getCurrentAction() {
    return actionStack.length ? actionStack[actionStack.length - 1] : null;
}

export function promiseMiddleware(
    next: LegacyDispatchFunction,
    action: ActionFunction,
    actionType: string,
    args: IArguments,
    actionContext: ActionContext
) {
    // If we're not already installed, install now
    if (!isInstalled) {
        uninstall = install();
        isInstalled = true;
    }

    try {
        actionStack.push(actionType);
        return next(action, actionType, args, actionContext);
    } finally {
        actionStack.pop();

        // If we're no longer in an action, uninstall
        if (!actionStack.length) {
            uninstall();
            isInstalled = false;
        }
    }
}
