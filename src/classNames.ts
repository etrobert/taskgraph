import without from "lodash/without";

/**
 * Filters out the false values and joins the class names in a space separated string.
 *
 * @example
 * <div
 *   className={classNames([
 *     "Task",
 *     status === "completed" && "Task--completed",
 *     selected && "Task--selected",
 *   ])}
 * />
 */
const classNames = (classes: (string | false | undefined)[]): string =>
  without(classes, false, undefined).join(" ");

export default classNames;
