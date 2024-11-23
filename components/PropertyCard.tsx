import React from 'react';
import Link from 'next/link';
import styles from '../styles/PropertyCard.module.css';

interface PropertyCardProps {
  image: string;
  title: string;
  rent: number; // Nuevo prop para el costo de renta mensual
  redirectUri: string; // Prop para la redirección
}

const PropertyCard: React.FC<PropertyCardProps> = ({ image, title, rent, redirectUri }) => {
  return (
    <div className={styles.card}>
      <img src={image} alt={title} className={styles.image} />
      <div className={styles.content}>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.rent}>Renta mensual: ${rent.toLocaleString()} MXN</p> {/* Formato de precio */}
        <Link href={redirectUri} passHref>
          <button className={styles.detailsButton}>Ver detalles</button>
        </Link>
      </div>
    </div>
  );
};

export default PropertyCard;

