import portrait400 from "../../../../assets/images/portrait-400.webp";
import portrait800 from "../../../../assets/images/portrait-800.webp";
import styles from "./HeaderLookingProfileImage.module.scss";

interface HeaderLookingProfileImageProps {
  alt: string;
}

// Round portrait in a glowing ring. Static placeholder for now; the gaze that follows
// the pointer or touch is built once the layout is responsive.
function HeaderLookingProfileImage({ alt }: HeaderLookingProfileImageProps) {
  return (
    <div className={styles.frame}>
      <img
        className={styles.portrait}
        src={portrait400}
        srcSet={`${portrait400} 400w, ${portrait800} 800w`}
        sizes="(min-width: 64rem) 14rem, 10rem"
        width={400}
        height={400}
        alt={alt}
        decoding="async"
        fetchPriority="high"
      />
    </div>
  );
}

export default HeaderLookingProfileImage;
