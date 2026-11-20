import styles from "./SkipLink.module.scss";

interface SkipLinkProps {
  targetId: string;
  label: string;
}

function SkipLink({ targetId, label }: SkipLinkProps) {
  return (
    <a className={styles.skipLink} href={`#${targetId}`}>
      {label}
    </a>
  );
}

export default SkipLink;
