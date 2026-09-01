import { useEffect, useState } from "react";
import { Section } from "./components/Section";
import Heading from "./components/Heading";
import PackageDetail, { type PackageInfo, type ReservationItem } from "./components/PackageDetail";
import logo from "./assets/logo.png";
import paquete1 from "./assets/Paquete1.jpg";
import paquete2 from "./assets/Paquete2.jpg";
import paquete3 from "./assets/Paquete3.jpg";
import CheckoutPage from "./components/CheckoutPage";
import { canAddReservation } from "./utils/reservationValidation";

const STORAGE_KEY = "conocetierrasaltas-confirmed-bookings";
const ADMIN_STORAGE_KEY = "conocetierrasaltas-admin-access";
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || "tierrasaltas-admin";

type AdminReservationStatus = "pendiente" | "aprobado" | "cancelado";

interface AdminReservation extends ReservationItem {
  id: string;
  status: AdminReservationStatus;
  createdAt: string;
}

const packages: PackageInfo[] = [
  {
    id: "finca-la-suiza",
    icon: "☕",
    title: "Finca la Suiza",
    price: "120$",
    numericPrice: 120,
    category: "Tour Cafetalero & Naturaleza",
    duration: "5 - 6 Horas",
    difficulty: "Fácil - Moderado",
    location: "Paso Ancho, Tierras Altas",
    description: "Una experiencia completa para conocer el proceso del café, la naturaleza y la cultura local.",
    longDescription: "Sumérgete en la tradición agrícola de Tierras Altas con un recorrido detallado por la histórica Finca la Suiza. Conocerás de la mano de expertos las etapas desde el cultivo, cosecha, despulpado hasta el secado tradicional y tostado.",
    highlights: [
      "Paseo guiado por plantaciones de café arábica de altura",
      "Demostración de beneficio y métodos de secado",
      "Visita al mirador panorámico del valle de Paso Ancho",
      "Cata y degustación de café fresco de especialidad",
    ],
    includes: [
      "Transporte 4x4",
      "Visita a Finca la Suiza",
      "Visita a Finca Drácula",
      "Almuerzo",
      "Snacks",
      "Cata de Café",
    ],
    image: paquete1,
    gallery: [
      paquete1,
      "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=900&q=80",
    ],
    className: "package-card--one",
  },
  {
    id: "aventura-lagunas-volcan",
    icon: "🚙",
    title: "Lagunas de Volcán",
    price: "90$",
    numericPrice: 90,
    category: "Aventura 4x4 & Senderos",
    duration: "4 - 5 Horas",
    difficulty: "Moderado (4x4)",
    location: "Humedal Lagunas de Volcán",
    description: "Para quienes buscan aventura, paisajes increíbles y recorridos en 4x4.",
    longDescription: "Vive la emoción todoterreno subiendo a las lagunas más altas de Panamá. Una travesía 4x4 enérgica que te llevará a través de senderos volcánicos, bosques de niebla y humedales protegidos con vistas panorámicas únicas.",
    highlights: [
      "Ruta safari 4x4 todoterreno por caminos volcánicos",
      "Avistamiento de aves de altura y flora endémica",
      "Punto de picnic frente a la laguna principal",
      "Café caliente de altura preparado en el sitio",
    ],
    includes: [
      "Transporte 4x4",
      "Visita a las Lagunas de Volcán",
      "Caminata por senderos ecológicos",
      "Almuerzo campestre",
      "Snacks e hidratación",
    ],
    image: paquete2,
    gallery: [
      paquete2,
      "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=900&q=80",
    ],
    className: "package-card--two",
  },
  {
    id: "cascadas-finca-panama",
    icon: "✦",
    title: "Cascadas y Finca Panamá",
    price: "110$",
    numericPrice: 110,
    category: "Senderismo & Bosque Nuboso",
    duration: "6 Horas",
    difficulty: "Moderado",
    location: "Finca Panamá & Mount Totumas",
    description: "Un recorrido pensado para disfrutar con tranquilidad, buena comida y paisajes únicos.",
    longDescription: "Un día de reconexión pura con la naturaleza. Visita caídas de agua cristalinas rodeadas de vegetación virgen, cafetales familiares y culmina con un almuerzo exclusivo en las faldas de la reserva de Mount Totumas.",
    highlights: [
      "Caminata guiada hacia cascadas escondidas en el bosque",
      "Paso por cafetales tradicionales de Finca Panamá",
      "Parada en Mi Finquita y sus instalaciones modelo",
      "Visita y almuerzo exclusivo en Mount Totumas",
    ],
    includes: [
      "Transporte 4x4 todo el día",
      "Visita a las cascadas de la finca Panamá y cafetales",
      "Visita a Mi Finquita y recorrido por sus instalaciones",
      "Visita a la reserva de Mount Totumas",
      "Almuerzo gourmet en Mount Totumas",
      "Snacks e hidratación continua",
    ],
    image: paquete3,
    gallery: [
      paquete3,
      "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1511497584788-87676104235f?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=900&q=80",
    ],
    className: "package-card--three",
  },
];

const safariPackages: PackageInfo[] = [
  {
    id: "finca-mi-finquita",
    icon: "☕",
    title: "Finca Cafetal Mi Finquita",
    price: "150$",
    numericPrice: 150,
    category: "Safari Premium Coffee",
    duration: "5 - 6 Horas",
    difficulty: "Aventura 4x4 & Cata",
    location: "Finca Mi Finquita, Volcán",
    description: "Una inmersión exclusiva en los cafetales y procesos de café de especialidad en Mi Finquita.",
    longDescription: "Un safari 4x4 premium diseñado para los apasionados del café de especialidad. Conocerás de primera mano variedades exóticas como Geisha y Pacamara, técnicas de fermentación innovadoras y una cata sensorial privada dirigida por un barista profesional.",
    highlights: [
      "Safari 4x4 por parcelas de variedades exóticas",
      "Laboratorio de fermentación y secado artesanal",
      "Cata privada de café Geisha de altura",
      "Almuerzo gourmet con maridaje de café",
    ],
    includes: [
      "Transporte 4x4 especializado",
      "Recorrido guiado por cafetales de altura",
      "Demostración del proceso de beneficio y secado",
      "Cata privada de café Geisha guiada por barista",
      "Snack campestre y café de cortesía",
    ],
    image: paquete2,
    gallery: [
      paquete2,
      "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=80",
    ],
    className: "package-card--safari-one",
  },
  {
    id: "finca-santos-cafe",
    icon: "🚙",
    title: "Finca Santos Café",
    price: "135$",
    numericPrice: 135,
    category: "Safari Premium Coffee",
    duration: "5 - 6 Horas",
    difficulty: "Aventura 4x4",
    location: "Finca Santos, Tierras Altas",
    description: "Aventura en 4x4 cruzando senderos cafetaleros con paradas en miradores y degustación en Finca Santos.",
    longDescription: "Asciende por las colinas cafetaleras de Finca Santos en nuestros vehículos 4x4 adaptados. Disfruta de vistas espectaculares del valle, brisas frescas de montaña y degustaciones de café filtrado al aire libre preparadas al momento.",
    highlights: [
      "Ruta off-road 4x4 por senderos de montaña",
      "Miradores panorámicos del Volcán Barú",
      "Preparación de café en métodos al aire libre",
      "Almuerzo tradicional de campo",
    ],
    includes: [
      "Ruta todoterreno 4x4 por fincas cafetaleras",
      "Paradas fotográficas en miradores del Volcán Barú",
      "Degustación de café filtrado al aire libre",
      "Almuerzo típico gourmet",
      "Hidratación durante todo el recorrido",
    ],
    image: paquete3,
    gallery: [
      paquete3,
      "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=900&q=80",
    ],
    className: "package-card--safari-two",
  },
  {
    id: "finca-santa-teresa",
    icon: "✦",
    title: "Finca Santa Teresa",
    price: "195$",
    numericPrice: 195,
    category: "Safari Premium Coffee",
    duration: "6 - 7 Horas",
    difficulty: "Experiencia Gourmet",
    location: "Finca Santa Teresa, Paso Ancho",
    description: "Experiencia de clase mundial en Finca Santa Teresa con tueste artesanal y cata sensorial.",
    longDescription: "La experiencia cafetalera definitiva en Panamá. Finca Santa Teresa te abre sus puertas para conocer lotes ganadores de la Best of Panama, el fascinante proceso de tueste y una cata sensorial guiada por catadores Q-Grader.",
    highlights: [
      "Recorrido por lotes premiados internacionalmente",
      "Demostración de tueste en vivo y perfiles de sabor",
      "Cata sensorial formal guiada por Q-Grader",
      "Maridaje y tabla de quesos y productos locales",
    ],
    includes: [
      "Transporte safari 4x4 de lujo",
      "Paseo por las parcelas de mayor altitud",
      "Taller de tueste y extracción de café",
      "Cata profesional de café de especialidad",
      "Almuerzo gourmet en terraza con vista al volcán",
    ],
    image: paquete1,
    gallery: [
      paquete1,
      "https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1498804103079-a6351b050096?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=900&q=80",
    ],
    className: "package-card--safari-three",
  },
];

const allAvailablePackages: PackageInfo[] = [...packages, ...safariPackages];

function App() {
  const [isHeaderHidden, setIsHeaderHidden] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<PackageInfo | null>(null);
  const [reservations, setReservations] = useState<ReservationItem[]>([]);
  const [confirmedReservations, setConfirmedReservations] = useState<AdminReservation[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isAdminView, setIsAdminView] = useState(() => {
    const path = window.location.pathname;
    return path === "/admin" || sessionStorage.getItem(ADMIN_STORAGE_KEY) === "true";
  });
  const [adminPassword, setAdminPassword] = useState("");
  const [adminError, setAdminError] = useState("");

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

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(confirmedReservations));
  }, [confirmedReservations]);

  useEffect(() => {
    const isAllowed = sessionStorage.getItem(ADMIN_STORAGE_KEY) === "true";
    const isAdminRoute = window.location.pathname === "/admin";

    if (isAllowed || isAdminRoute) {
      setIsAdminView(true);
    }
  }, []);

  useEffect(() => {
    if (window.location.pathname === "/admin") {
      sessionStorage.setItem(ADMIN_STORAGE_KEY, "true");
    }
  }, [isAdminView]);

  const handleReserve = (pkg: PackageInfo) => {
    setSelectedPackage(pkg);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBack = () => {
    setSelectedPackage(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    if (selectedPackage) {
      setSelectedPackage(null);
    }
    setTimeout(() => {
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }, 60);
  };

  const handleAddReservationItem = (item: ReservationItem): boolean => {
    const isValid = canAddReservation(
      reservations,
      {
        packageId: item.packageId,
        date: item.date,
      },
    );

    if (!isValid) {
      return false;
    }

    setReservations((prev) => {
      const existsIndex = prev.findIndex((r) => r.packageId === item.packageId);
      if (existsIndex >= 0) {
        const updated = [...prev];
        updated[existsIndex] = item;
        return updated;
      }
      return [...prev, item];
    });

    return true;
  };

  const handleRemoveReservationItem = (packageId: string) => {
    setReservations((prev) => prev.filter((r) => r.packageId !== packageId));
  };

  const totalCartPrice = reservations.reduce((sum, item) => sum + item.totalPrice, 0);

  const handleGoToCheckout = () => {
    if (reservations.length === 0) return;
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (adminPassword === ADMIN_PASSWORD) {
      sessionStorage.setItem(ADMIN_STORAGE_KEY, "true");
      window.history.pushState({}, "", "/admin");
      setIsAdminView(true);
      setAdminError("");
      setAdminPassword("");
      return;
    }

    setAdminError("Contraseña incorrecta. Intenta nuevamente.");
  };

  const handleAdminLogout = () => {
    sessionStorage.removeItem(ADMIN_STORAGE_KEY);
    window.history.pushState({}, "", "/");
    setIsAdminView(false);
  };

  const addConfirmedReservations = (items: ReservationItem[]) => {
    const nextRecords = items.map((item) => ({
      ...item,
      id: `${item.packageId}-${item.date}-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
      status: "pendiente" as const,
      createdAt: new Date().toISOString(),
    }));

    setConfirmedReservations((prev) => [...prev, ...nextRecords]);
  };

  const updateReservationStatus = (id: string, status: AdminReservationStatus) => {
    setConfirmedReservations((prev) =>
      prev.map((reservation) =>
        reservation.id === id ? { ...reservation, status } : reservation,
      ),
    );
  };

  const updateReservationData = (id: string, nextDate: string, nextPeopleCount: number) => {
    setConfirmedReservations((prev) => {
      const target = prev.find((reservation) => reservation.id === id);
      if (!target) return prev;

      const hasConflict = prev.some(
        (reservation) =>
          reservation.id !== id &&
          reservation.packageId !== target.packageId &&
          reservation.date === nextDate,
      );

      if (hasConflict) {
        alert("No se puede asignar esa fecha porque ya existe otra reserva en ese mismo día.");
        return prev;
      }

      const updatedPrice = target.pricePerPerson * nextPeopleCount;

      return prev.map((reservation) =>
        reservation.id === id
          ? {
              ...reservation,
              date: nextDate,
              displayDate: new Date(`${nextDate}T12:00:00`).toLocaleDateString("es-ES", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              }),
              peopleCount: nextPeopleCount,
              totalPrice: updatedPrice,
            }
          : reservation,
      );
    });
  };

  const handleAdminDeleteReservation = (id: string) => {
    setConfirmedReservations((prev) => prev.filter((reservation) => reservation.id !== id));
  };

  return (
    <main className="page">
      <header className={`site-header${isHeaderHidden ? " site-header--hidden" : ""}`}>
        <div
          className="site-header__logo"
          onClick={handleBack}
          role="button"
          tabIndex={0}
          style={{ cursor: "pointer" }}
          title="Volver a la página principal"
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              handleBack();
            }
          }}
        >
          <img className="logo-image" src={logo} alt="Conoce Tierras Altas" />
        </div>

        <nav className="site-header__nav" aria-label="Navegación principal">
          <ul>
            <li>
              <a href="#inicio" onClick={(e) => handleNavClick(e, "inicio")}>
                Inicio
              </a>
            </li>
            <li>
              <a href="#destinos" onClick={(e) => handleNavClick(e, "experiencia")}>
                Qué encontrarás
              </a>
            </li>
            <li>
              <a href="#experiencia" onClick={(e) => handleNavClick(e, "experiencia")}>
                Nuestros paquetes
              </a>
            </li>
            <li>
              <a href="#safari-coffee" onClick={(e) => handleNavClick(e, "safari-coffee")}>
                Safari Premium Coffee
              </a>
            </li>
            <li>
              <a href="#contacto" onClick={(e) => handleNavClick(e, "contacto")}>
                Sobre nosotros
              </a>
            </li>
          </ul>
        </nav>

        <button
          type="button"
          className="btn btn--primary header-btn header-reserva-btn"
          onClick={() => setIsCartOpen(true)}
          aria-label="Ver reservas seleccionadas"
        >
          <span>🛒 Mi Reserva</span>
          {reservations.length > 0 && (
            <span className="header-reserva-badge">{reservations.length}</span>
          )}
        </button>
      </header>

      {isAdminView ? (
        <div style={{ maxWidth: "1200px", margin: "2rem auto", padding: "0 1rem" }}>
          {!sessionStorage.getItem(ADMIN_STORAGE_KEY) ? (
            <div className="checkout-card" style={{ background: "#fff", borderRadius: "16px", padding: "2rem", boxShadow: "0 10px 30px rgba(0,0,0,0.08)" }}>
              <h2>Acceso administrativo</h2>
              <p style={{ color: "#555", marginBottom: "1rem" }}>Ingresa la contraseña para revisar y gestionar reservas.</p>
              <form onSubmit={handleAdminLogin}>
                <input
                  type="password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  placeholder="Contraseña del administrador"
                  style={{ width: "100%", padding: "0.8rem", borderRadius: "8px", border: "1px solid #ccc", marginBottom: "1rem" }}
                />
                {adminError && <p style={{ color: "#b42318", marginBottom: "1rem" }}>{adminError}</p>}
                <button type="submit" className="btn btn--primary">Entrar al panel</button>
              </form>
            </div>
          ) : (
            <div className="checkout-card" style={{ background: "#fff", borderRadius: "16px", padding: "2rem", boxShadow: "0 10px 30px rgba(0,0,0,0.08)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
                <div>
                  <span className="about-section__eyebrow">Panel de administración</span>
                  <h2 style={{ margin: "0.4rem 0 0" }}>Reservas y pagos</h2>
                </div>
                <button type="button" className="btn btn--secondary" onClick={handleAdminLogout}>Cerrar sesión</button>
              </div>

              {confirmedReservations.length === 0 ? (
                <p style={{ color: "#555" }}>No hay reservas confirmadas todavía.</p>
              ) : (
                <div style={{ display: "grid", gap: "1rem" }}>
                  {confirmedReservations.map((reservation) => (
                    <div key={reservation.id} style={{ border: "1px solid #e5e7eb", borderRadius: "12px", padding: "1rem", background: "#f9fafb" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" }}>
                        <div>
                          <h3 style={{ margin: 0 }}>{reservation.packageTitle}</h3>
                          <p style={{ margin: "0.35rem 0", color: "#475467" }}>📅 {reservation.displayDate || reservation.date} · 👥 {reservation.peopleCount} personas</p>
                          <p style={{ margin: 0, color: "#475467" }}>💰 ${reservation.totalPrice}</p>
                        </div>
                        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", flexWrap: "wrap" }}>
                          <span style={{ background: reservation.status === "aprobado" ? "#dcfce7" : reservation.status === "cancelado" ? "#fee2e2" : "#e0f2fe", padding: "0.4rem 0.7rem", borderRadius: "999px", fontSize: "0.75rem", fontWeight: 700, color: "#0f172a" }}>
                            {reservation.status}
                          </span>
                          <button type="button" className="btn btn--secondary" onClick={() => updateReservationStatus(reservation.id, "aprobado")}>Aprobar</button>
                          <button type="button" className="btn btn--secondary" onClick={() => updateReservationStatus(reservation.id, "cancelado")}>Cancelar</button>
                          <button type="button" className="btn btn--secondary" onClick={() => handleAdminDeleteReservation(reservation.id)}>Eliminar</button>
                        </div>
                      </div>

                      <div style={{ marginTop: "1rem", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                        <div>
                          <label style={{ display: "block", marginBottom: "0.3rem", fontWeight: 600 }}>Fecha</label>
                          <input
                            type="date"
                            value={reservation.date}
                            onChange={(e) => updateReservationData(reservation.id, e.target.value, reservation.peopleCount)}
                            style={{ width: "100%", padding: "0.7rem", borderRadius: "8px", border: "1px solid #ccc" }}
                          />
                        </div>
                        <div>
                          <label style={{ display: "block", marginBottom: "0.3rem", fontWeight: 600 }}>Personas</label>
                          <input
                            type="number"
                            min={2}
                            value={reservation.peopleCount}
                            onChange={(e) => updateReservationData(reservation.id, reservation.date, Number(e.target.value) || 2)}
                            style={{ width: "100%", padding: "0.7rem", borderRadius: "8px", border: "1px solid #ccc" }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      ) : isCheckoutOpen ? (
        <CheckoutPage
          reservations={reservations}
          allPackages={allAvailablePackages}
          onBack={() => setIsCheckoutOpen(false)}
          onUpdateReservations={(updated) => {
            setReservations([]);
            addConfirmedReservations(updated);
            setIsCheckoutOpen(false);
            setIsCartOpen(false);
          }}
        />
      ) : selectedPackage ? (
        <PackageDetail
          pkg={selectedPackage}
          allPackages={allAvailablePackages}
          onSelectPackage={handleReserve}
          onBack={handleBack}
          onAddReservation={handleAddReservationItem}
          existingReservations={reservations}
        />
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
                <button
                  type="button"
                  className="btn btn--primary"
                  onClick={() => document.getElementById("experiencia")?.scrollIntoView({ behavior: "smooth" })}
                >
                  Conoce los paquetes
                </button>
                <button
                  type="button"
                  className="btn btn--secondary"
                  onClick={() => document.getElementById("equipo")?.scrollIntoView({ behavior: "smooth" })}
                >
                  Conoce el Equipo
                </button>
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
                      type="button"
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
                      type="button"
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

          <section id="equipo" className="team-section">
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

      {!isAdminView && isCartOpen && (
        <div className="cart-modal-backdrop" onClick={() => setIsCartOpen(false)}>
          <div
            className="cart-modal"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Tus reservas"
          >
            <div className="cart-modal__header">
              <div className="cart-modal__title-box">
                <span className="cart-modal__icon">🛒</span>
                <div>
                  <h3>Tu Reserva de Experiencias</h3>
                  <p>{reservations.length} {reservations.length === 1 ? "paquete seleccionado" : "paquetes seleccionados"}</p>
                </div>
              </div>
              <button
                type="button"
                className="cart-modal__close-btn"
                onClick={() => setIsCartOpen(false)}
                aria-label="Cerrar ventana de reserva"
              >
                ✕
              </button>
            </div>

            <div className="cart-modal__body">
              {reservations.length === 0 ? (
                <div className="cart-empty-state">
                  <span className="cart-empty-icon">🌿</span>
                  <h4>Aún no has agregado paquetes</h4>
                  <p>Explora nuestros tours en Tierras Altas y agrega los que desees reservar.</p>
                  <button
                    type="button"
                    className="btn btn--primary"
                    onClick={() => {
                      setIsCartOpen(false);
                      if (selectedPackage) setSelectedPackage(null);
                      setTimeout(() => {
                        document.getElementById("experiencia")?.scrollIntoView({ behavior: "smooth" });
                      }, 50);
                    }}
                  >
                    Ver paquetes disponibles
                  </button>
                </div>
              ) : (
                <div className="cart-items-list">
                  {reservations.map((item) => (
                    <div key={item.packageId} className="cart-item-card">
                      <img src={item.packageImage} alt={item.packageTitle} className="cart-item-img" />
                      <div className="cart-item-info">
                        <h4>{item.packageTitle}</h4>
                        <div className="cart-item-meta">
                          <span>📅 {item.displayDate || item.date}</span>
                          <span>👥 {item.peopleCount} personas</span>
                        </div>
                        <div className="cart-item-subtotal">
                          <span>{item.peopleCount} × {item.pricePerPerson}$</span>
                          <strong>{item.totalPrice}$</strong>
                        </div>
                      </div>
                      <button
                        type="button"
                        className="cart-item-remove-btn"
                        onClick={() => handleRemoveReservationItem(item.packageId)}
                        title="Eliminar de mi reserva"
                        aria-label={`Eliminar ${item.packageTitle}`}
                      >
                        🗑️
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {reservations.length > 0 && (
              <div className="cart-modal__footer">
                <div className="cart-total-row">
                  <span>Total estimado:</span>
                  <strong className="cart-total-amount">${totalCartPrice}</strong>
                </div>
                <div className="cart-footer-actions">
                  <button
                    type="button"
                    className="btn btn--primary btn--full cart-confirm-btn"
                    onClick={handleGoToCheckout}
                  >
                    Ir al checkout →
                  </button>
                  <button
                    type="button"
                    className="btn btn--secondary btn--full"
                    onClick={() => setIsCartOpen(false)}
                  >
                    Continuar explorando
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}

export default App;