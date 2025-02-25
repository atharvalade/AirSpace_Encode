import Image from "next/image";
import Link from "next/link";

const Logo: React.FC = () => {
  return (
    <Link href="/">
      <Image
        src="https://www.airspace.com/hs-fs/hubfs/Updated%20logos/Airspace%20horizontal%20full%20color%20logotype%20white%20and%20green%20no%20background%20011321.png"
        alt="Airspace Logo"
        width={160}
        height={50}
        style={{ width: "auto", height: "auto" }}
        quality={100}
        priority
      />
    </Link>
  );
};

export default Logo;
