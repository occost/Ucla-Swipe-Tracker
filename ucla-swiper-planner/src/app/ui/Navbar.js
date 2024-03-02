// components/Navbar.js
import Link from 'next/link';
import styles from './Navbar.module.css'; // Assuming you have this CSS file for styling

const Navbar = () => {
  return (
    <nav className={styles.navbar}>
      <ul className={styles.navList}>
        <li className={styles.navItem}>
          {/* Use Link with legacyBehavior prop */}
          <Link href="/" legacyBehavior>
            <a className={styles.navLink}>Home</a>
          </Link>
        </li>
        <li className={styles.navItem}>
          <Link href="/about" legacyBehavior>
            <a className={styles.navLink}>About</a>
          </Link>
        </li>
        <li className={styles.navItem}>
          <Link href="/contact" legacyBehavior>
            <a className={styles.navLink}>Contact</a>
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
