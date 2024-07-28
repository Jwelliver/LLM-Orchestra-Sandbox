import cn from "../utils/cn";

export function NodeTextArea(
  props: React.TextareaHTMLAttributes<HTMLTextAreaElement>
) {
  const { className, ...restProps } = props;

  return (
    <textarea
      className={cn(
        "nodrag nowheel focus:outline-none textarea textarea-bordered textarea-md text-sm",
        className
      )}
      autoFocus
      {...restProps}
    />
  );
}
