import React from 'react';
import Link from 'next/link';
import styles from '../styles/PropertyCard.module.css';

interface PropertyCardProps {
  image: string;
  title: string;
  redirectUri: string; // Nuevo prop para la redirección
}

const PropertyCard: React.FC<PropertyCardProps> = ({ image, title, redirectUri }) => {
  return (
    <div className={styles.card}>
      <img src={image} alt={title} className={styles.image} />
      <div className={styles.content}>
        <h3 className={styles.title}>{title}</h3>
        {/* Link integrado en el botón */}
        <Link href={redirectUri} passHref>
          <button className={styles.detailsButton}>Ver detalles</button>
        </Link>
      </div>
    </div>
  );
};

export default PropertyCard;

