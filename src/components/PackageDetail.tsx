export interface PackageInfo {
  id: string;
  icon: string;
  title: string;
  price: string;
  description: string;
  includes: string[];
  image: string;
  className: string;
}

interface PackageDetailProps {
  pkg: PackageInfo;
  onBack: () => void;
}

function PackageDetail({ pkg, onBack }: PackageDetailProps) {
  return (
    <section className="package-detail">
      <button className="btn btn--secondary package-detail__back" onClick={onBack}>
        ← Volver a los paquetes
      </button>

      <div
        className="package-detail__hero"
        style={{ backgroundImage: `url(${pkg.image})` }}
      >
        <div className="package-detail__hero-overlay">
          <p className="hero__eyebrow">{pkg.icon} Paquete</p>
          <h1>{pkg.title}</h1>
          <strong className="package-detail__price">{pkg.price}</strong>
        </div>
      </div>

      <div className="package-detail__body">
        <p className="package-detail__description">{pkg.description}</p>

        <div className="package-detail__includes">
          <h2>¿Qué incluye este paquete?</h2>
          <ul>
            {pkg.includes.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

        <a className="btn btn--primary package-detail__cta" href="#contacto">
          Confirmar mi reserva
        </a>
      </div>
    </section>
  );
}

export default PackageDetail;