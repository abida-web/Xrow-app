import Link from "next/link";

const GeneralButton = ({
  label,
  link,
  className,
}: {
  label: string;
  link?: string;
  className?: string;
}) => {
  const buttonClasses =
    "bg-[#06102c] px-5 py-2 hover:bg-[#14224c]/80 text-white rounded-full button-text";

  if (!link) {
    return <button className={buttonClasses}>{label}</button>;
  }

  return (
    <Link href={link} className={className ? className : buttonClasses}>
      {label}
    </Link>
  );
};
export default GeneralButton;
