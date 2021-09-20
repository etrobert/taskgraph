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
const classNames = (classes: (string | false)[]): string =>
  classes.filter((currentClass) => currentClass !== false).join(" ");

export default classNames;
