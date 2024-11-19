import React from 'react';
import styles from '../styles/PropertyCard.module.css';

interface PropertyCardProps {
  image: string;
  title: string;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ image, title }) => {
  return (
    <div className={styles.card}>
      <img src={image} alt={title} className={styles.image} />
      <div className={styles.content}>
        <h3 className={styles.title}>{title}</h3>
        <button className={styles.detailsButton}>Ver detalles</button>
      </div>
    </div>
  );
};

export default PropertyCard;

