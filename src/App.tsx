import { useEffect, useState } from "react";
import { Section } from "./components/Section";
import Heading from "./components/Heading";
import PackageDetail, { type PackageInfo } from "./components/PackageDetail";
import logo from "./assets/logo.png";
import paquete1 from "./assets/Paquete1.jpg";
import paquete2 from "./assets/Paquete2.jpg";
import paquete3 from "./assets/Paquete3.jpg";

const packages: PackageInfo[] = [
  {
    id: "aventura",
    icon: "✦",
    title: "Tour de Aventura",
    price: "65$",
    description: "Visita a las lagunas de Volcán y a las faldas del Volcán Barú.",
    includes: ["Desayuno", "Botella de agua"],
    image: paquete1,
    className: "package-card--one",
  },
  {
    id: "cafe",
    icon: "☕",
    title: "Tour de Experiencia de Café",
    price: "120$",
    description: "Desde Volcán hacia la finca Mi Finquita.",
    includes: [
      "Desayuno",
      "Recorrido por cafetales",
      "Recorrido por las instalaciones de Mi Finquita",
      "Almuerzo",
      "Cata de café o café filtrado",
    ],
    image: paquete2,
    className: "package-card--two",
  },
  {
    id: "completo",
    icon: "▲",
    title: "Tour Aventura y Experiencia de Café",
    price: "180$",
    description: "Una ruta completa entre cascadas, cafetales y paisajes de montaña.",
    includes: [
      "Visita a las cascadas de la finca Panamá y cafetales",
      "Visita a Mi Finquita y recorrido por sus instalaciones",
      "Visita a Mount Totumas",
      "Almuerzo en Mount Totumas",
    ],
    image: paquete3,
    className: "package-card--three",
  },
];

const safariPackages: PackageInfo[] = [
  {
    id: "finca-mi-finquita",
    icon: "☕",
    title: "Finca Cafetal Mi Finquita",
    price: "150$",
    description: "Una inmersión exclusiva en los cafetales y procesos de café de especialidad en Mi Finquita.",
    includes: [
      "Transporte 4x4 especializado",
      "Recorrido guiado por cafetales de altura",
      "Demostración del proceso de beneficio y secado",
      "Cata privada de café Geisha guiada por barista",
      "Snack campestre y café de cortesía",
    ],
    image: paquete2,
    className: "package-card--safari-one",
  },
  {
    id: "finca-santos-cafe",
    icon: "🚙",
    title: "Finca Santos Café",
    price: "135$",
    description: "Aventura en 4x4 cruzando senderos cafetaleros con paradas en miradores y degustación en Finca Santos.",
    includes: [
      "Ruta todoterreno 4x4 por fincas cafetaleras",
      "Paradas fotográficas en miradores del Volcán Barú",
      "Degustación de café filtrado al aire libre",
      "Almuerzo típico gourmet",
      "Hidratación durante todo el recorrido",
    ],
    image: paquete3,
    className: "package-card--safari-two",
  },
  {
    id: "finca-santa-teresa",
    icon: "✦",
    title: "Finca Santa Teresa",
    price: "195$",
    description: "Experiencia de clase mundial en Finca Santa Teresa con tueste artesanal y cata sensorial.",
    includes: [
      "Taller interactivo de tueste artesanal en vivo",
      "Cata sensorial de diferentes varietales de café",
      "Preparación en métodos de filtrado (V60, Chemex, Aeropress)",
      "Almuerzo maridado y postre de la casa",
      "Muestra de café recién tostado de regalo",
    ],
    image: paquete1,
    className: "package-card--safari-three",
  },
];

function App() {
  const [isHeaderHidden, setIsHeaderHidden] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<PackageInfo | null>(null);

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 80) {
        setIsHeaderHidden(true);
      } else {
        setIsHeaderHidden(false);
      }

      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  

  const handleReserve = (pkg: PackageInfo) => {
    setSelectedPackage(pkg);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBack = () => {
    setSelectedPackage(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main className="page">
      <header className={`site-header${isHeaderHidden ? " site-header--hidden" : ""}`}>
        <div className="site-header__logo">
          <img className="logo-image" src={logo} alt="Conoce Tierras Altas" />
        </div>

        <nav className="site-header__nav" aria-label="Navegación principal">
          <ul>
            <li><a href="#inicio">Inicio</a></li>
            <li><a href="#destinos">Qué encontrarás</a></li>
            <li><a href="#experiencia">Nuestros paquetes</a></li>
            <li><a href="#safari-coffee">Safari Premium Coffee</a></li>
            <li><a href="#contacto">Sobre nosotros</a></li>
          </ul>
        </nav>

        <a className="btn btn--primary header-btn" href="#experiencia">
          Reserva ahora
        </a>
      </header>

      {selectedPackage ? (
        <PackageDetail pkg={selectedPackage} onBack={handleBack} />
      ) : (
        <>
          <header id="inicio" className="hero">
            <div className="hero__content">
              <p className="hero__eyebrow">Safari de experiencia de Cafe</p>

              <Heading
                title="Conoce Tierras Altas"
                subtitle="Descubre los paisajes más emblemáticos de Tierras Altas."
              />

              <p className="hero__text">
                Recorre fincas cafetaleras y atractivos naturales en un safari 4x4
                organizado, con paradas estratégicas para disfrutar del paisaje,
                degustar café preparado en el lugar y conocer la historia y el
                proceso de producción del café.
              </p>

              <div className="hero__actions">
                <button className="btn btn--primary">Conoce los paquetes</button>
                <button className="btn btn--secondary">Conoce el Equipo</button>
              </div>
            </div>

            <div className="hero__visual"></div>
          </header>

          <Section
            id="experiencia"
            title="Nuestros paquetes"
            description="Elige la experiencia que más te gustaría vivir en Tierras Altas."
          >
            <div className="packages-grid">
              {packages.map((pkg) => (
                <article key={pkg.id} className={`package-card ${pkg.className}`} tabIndex={0}>
                  <div className="package-card__logo" aria-hidden="true">{pkg.icon}</div>
                  <div className="package-card__heading">
                    <h3>{pkg.title}</h3>
                    <div className="package-card__price-box">
                      <strong className="package-card__price">{pkg.price}</strong>
                      <span className="package-card__per-person">por persona</span>
                    </div>
                  </div>
                  <p>{pkg.description}</p>
                  <div className="package-card__details">
                    <h4>Incluye</h4>
                    <ul>
                      {pkg.includes.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                    <button
                      className="package-card__reserve"
                      onClick={() => handleReserve(pkg)}
                    >
                      Reservar ahora
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </Section>

          <Section
            id="safari-coffee"
            title="Safari Premium Coffee"
            description="Descubre experiencias exclusivas en 4x4 por las mejores fincas cafeteras, degustando cosechas especiales y catas de café de altura."
          >
            <div className="packages-grid">
              {safariPackages.map((pkg) => (
                <article key={pkg.id} className={`package-card ${pkg.className}`} tabIndex={0}>
                  <div className="package-card__logo" aria-hidden="true">{pkg.icon}</div>
                  <div className="package-card__heading">
                    <h3>{pkg.title}</h3>
                    <div className="package-card__price-box">
                      <strong className="package-card__price">{pkg.price}</strong>
                      <span className="package-card__per-person">por persona</span>
                    </div>
                  </div>
                  <p>{pkg.description}</p>
                  <div className="package-card__details">
                    <h4>Incluye</h4>
                    <ul>
                      {pkg.includes.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                    <button
                      className="package-card__reserve"
                      onClick={() => handleReserve(pkg)}
                    >
                      Reservar ahora
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </Section>

          <section id="contacto" className="about-section">
            <div className="about-section__content">
              <p className="about-section__eyebrow">Sobre nosotros</p>
              <h2>Una historia nacida de la tierra y del cariño por su gente.</h2>
              <p>
                Soy oriundo de Volcán, del distrito de Tierras Altas y durante 45 años
                he crecido rodeado de sus paisajes, su naturaleza y su cultura.
              </p>
              <p>
                Ese profundo amor por mi tierra me inspiró a crear Conoce Tierras
                Altas, con el propósito de que más personas puedan conocer y disfrutar
                la belleza de este lugar, tal como yo la he disfrutado toda mi vida.
              </p>
            </div>
          </section>

          <section className="team-section">
            <div className="team-section__intro">
              <p className="about-section__eyebrow">Nuestro equipo</p>
              <h2>Las personas detrás de cada experiencia.</h2>
            </div>

            <div className="team-grid">
              <article className="team-card">
                <div className="team-card__photo">Foto próximamente</div>
                <h3>Greg Guinard</h3>
              </article>
              <article className="team-card">
                <div className="team-card__photo">Foto próximamente</div>
                <h3>Johanni Gonzalez</h3>
              </article>
              <article className="team-card">
                <div className="team-card__photo">Foto próximamente</div>
                <h3>Frank Guinard</h3>
              </article>
            </div>
          </section>
        </>
      )}
    </main>
  );
}

export default App;