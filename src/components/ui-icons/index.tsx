interface Icon extends React.SVGProps<SVGSVGElement> {}

// svg example how to use add your svg with the same flow

export function IconName({ ...props }: Icon) {
  return <svg width={55} height={66} {...props}></svg>;
}
