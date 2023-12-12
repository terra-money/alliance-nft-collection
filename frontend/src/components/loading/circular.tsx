import styles from  './LoadingCircular.module.scss';

const LoadingCircular = ({ size }: { size?: number }) => {
  return (
    <div className={styles.circular__container} style={{ height: `${size}px`, width: `${size}px` }}>
      <svg viewBox="22 22 44 44">
        <circle className={styles.circle} cx="44" cy="44" r="20.2" fill="none" strokeWidth="5"></circle>
      </svg>
    </div>
  );
};

export default LoadingCircular;