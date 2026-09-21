import Link from "next/link";

export default function Logo() {
  return (
    <Link href="/" className="logo" aria-label="AiFod - início">
      <span className="logoMark">A</span>
      <span className="logoWord">AiFod</span>
    </Link>
  );
}
