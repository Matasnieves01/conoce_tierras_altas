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
import { supabase } from "./lib/supabase";
import type { Session } from "@supabase/supabase-js";
import { translate, type Language } from "./i18n";

type AdminReservationStatus = "pendiente" | "aprobado" | "rechazado" | "cancelado" | "completado";

interface AdminReservation extends ReservationItem {
  id: string;
  status: AdminReservationStatus;
  createdAt: string;
  receiptPath?: string;
}

/* Legacy package definitions kept temporarily for image fallbacks only.
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

*/

interface PackageRow {
  id: string;
  icon: string | null;
  title: string;
  price: number;
  category: string | null;
  description: string | null;
  long_description: string | null;
  duration: string | null;
  difficulty: string | null;
  location: string | null;
  includes: string[] | null;
  highlights: string[] | null;
  image: string | null;
  gallery: string[] | null;
  class_name: string | null;
}

const getPackageAsset = (asset: string | null, fallback: string): string => {
  if (!asset) return fallback;
  if (asset.startsWith("http") || asset.startsWith("/")) return asset;

  const assetByName: Record<string, string> = {
    "Paquete1.jpg": paquete1,
    "Paquete2.jpg": paquete2,
    "Paquete3.jpg": paquete3,
  };

  return assetByName[asset] || fallback;
};

const mapPackageRow = (row: PackageRow): PackageInfo => {
  const image = getPackageAsset(row.image, paquete1);

  return {
    id: row.id,
    icon: row.icon || "✦",
    title: row.title,
    price: `${row.price}$`,
    numericPrice: row.price,
    category: row.category || undefined,
    description: row.description || "Descubre una experiencia inolvidable en Tierras Altas.",
    longDescription: row.long_description || undefined,
    duration: row.duration || undefined,
    difficulty: row.difficulty || undefined,
    location: row.location || undefined,
    includes: row.includes || [],
    highlights: row.highlights || [],
    image,
    gallery: (row.gallery || []).map((asset) => getPackageAsset(asset, image)),
    className: row.class_name || "package-card--one",
  };
};

function App() {
  const [language, setLanguage] = useState<Language>(() =>
    (localStorage.getItem("site-language") as Language) || "es",
  );
  const text = translate(language);
  const [isHeaderHidden, setIsHeaderHidden] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<PackageInfo | null>(null);
  const [reservations, setReservations] = useState<ReservationItem[]>([]);
  const [confirmedReservations, setConfirmedReservations] = useState<AdminReservation[]>([]);
  const [availablePackages, setAvailablePackages] = useState<PackageInfo[]>([]);
  const [packagesLoading, setPackagesLoading] = useState(true);
  const [packagesError, setPackagesError] = useState("");
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isAdminView, setIsAdminView] = useState(() => window.location.pathname === "/admin");
  const [adminSession, setAdminSession] = useState<Session | null>(null);
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [adminError, setAdminError] = useState("");
  const [adminSection, setAdminSection] = useState<"pending" | "approved" | "rejected" | "cancelled" | "completed" | "calendar">("pending");
  const [adminCalendarDate, setAdminCalendarDate] = useState(() => new Date());

  useEffect(() => {
    localStorage.setItem("site-language", language);
  }, [language]);

  useEffect(() => {
    const loadPackages = async () => {
      const { data, error } = await supabase
        .from("packages")
        .select("*")
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Error cargando paquetes:", error);
        setPackagesError("No pudimos cargar los paquetes disponibles.");
      } else {
        setAvailablePackages((data as PackageRow[]).map(mapPackageRow));
      }

      setPackagesLoading(false);
    };

    loadPackages();
  }, []);

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
    const loadAdminSession = async () => {
      const { data } = await supabase.auth.getSession();
      setAdminSession(data.session);
    };

    loadAdminSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setAdminSession(session);
    });

    return () => authListener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const loadReservations = async () => {
      if (!adminSession) return;

      const { data, error } = await supabase
        .from("reservations")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error cargando reservas:", error);
        return;
      }

      setConfirmedReservations((data ?? []).map((reservation) => ({
        id: String(reservation.id),
        packageId: reservation.package_id,
        packageTitle: reservation.package_title,
        packageIcon: "",
        packageImage: "",
        pricePerPerson: reservation.total_price / reservation.people_count,
        peopleCount: reservation.people_count,
        totalPrice: reservation.total_price,
        date: reservation.reservation_date,
        displayDate: new Date(`${reservation.reservation_date}T12:00:00`).toLocaleDateString("es-ES", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        status: reservation.status as AdminReservationStatus,
        createdAt: reservation.created_at,
        receiptPath: reservation.receipt_path,
      })));
    };

    loadReservations();
  }, [adminSession]);

  const allAvailablePackages = availablePackages;
  const regularPackages = availablePackages.filter(
    (pkg) => pkg.category !== "Safari Premium Coffee",
  );
  const premiumPackages = availablePackages.filter(
    (pkg) => pkg.category === "Safari Premium Coffee",
  );

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

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const { error } = await supabase.auth.signInWithPassword({
      email: adminEmail.trim(),
      password: adminPassword,
    });

    if (!error) {
      window.history.pushState({}, "", "/admin");
      setIsAdminView(true);
      setAdminError("");
      setAdminEmail("");
      setAdminPassword("");
      return;
    }

    setAdminError("Correo o contraseña incorrectos.");
  };

  const handleAdminLogout = async () => {
    await supabase.auth.signOut();
    window.history.pushState({}, "", "/");
    setIsAdminView(false);
  };

  const updateReservationStatus = async (id: string, status: AdminReservationStatus) => {
    const { error } = await supabase.from("reservations").update({ status }).eq("id", id);

    if (error) {
      alert("No se pudo actualizar el estado de la reserva.");
      return;
    }

    setConfirmedReservations((prev) => prev.map((reservation) =>
      reservation.id === id ? { ...reservation, status } : reservation,
    ));
  };

  const updateReservationData = async (id: string, nextDate: string, nextPeopleCount: number) => {
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

      void supabase.from("reservations").update({
        reservation_date: nextDate,
        people_count: nextPeopleCount,
        total_price: updatedPrice,
      }).eq("id", id).then(({ error }) => {
        if (error) alert("No se pudo modificar la reserva en Supabase.");
      });

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

  const handleAdminDeleteReservation = async (id: string) => {
    const { error } = await supabase.from("reservations").delete().eq("id", id);

    if (error) {
      alert("No se pudo eliminar la reserva.");
      return;
    }

    setConfirmedReservations((prev) => prev.filter((reservation) => reservation.id !== id));
  };

  const handleViewReceipt = async (receiptPath?: string) => {
    if (!receiptPath) {
      alert("Esta reserva no tiene un comprobante adjunto.");
      return;
    }

    const { data, error } = await supabase.storage
      .from("payment-receipts")
      .createSignedUrl(receiptPath, 300);

    if (error || !data?.signedUrl) {
      alert("No se pudo abrir el comprobante.");
      return;
    }

    window.open(data.signedUrl, "_blank", "noopener,noreferrer");
  };

  const pendingReservations = confirmedReservations.filter(
    (reservation) => reservation.status === "pendiente",
  );
  const approvedReservations = confirmedReservations.filter(
    (reservation) => reservation.status === "aprobado",
  );
  const rejectedReservations = confirmedReservations.filter(
    (reservation) => reservation.status === "rechazado",
  );
  const cancelledReservations = confirmedReservations.filter(
    (reservation) => reservation.status === "cancelado",
  );
  const completedReservations = confirmedReservations.filter(
    (reservation) => reservation.status === "completado",
  );

  const adminReservationsForSection = {
    pending: pendingReservations,
    approved: approvedReservations,
    rejected: rejectedReservations,
    cancelled: cancelledReservations,
    completed: completedReservations,
  }[adminSection === "calendar" ? "approved" : adminSection];

  const getAdminCalendarDays = () => {
    const year = adminCalendarDate.getFullYear();
    const month = adminCalendarDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();
    return { year, month, daysInMonth, firstDay };
  };

  const formatAdminMonth = () => adminCalendarDate.toLocaleDateString("es-ES", {
    month: "long",
    year: "numeric",
  });

  const moveAdminMonth = (offset: number) => {
    setAdminCalendarDate((current) => new Date(current.getFullYear(), current.getMonth() + offset, 1));
  };

  const getReservationsForAdminDay = (day: number) => {
    const { year, month } = getAdminCalendarDays();
    const date = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return confirmedReservations.filter(
      (reservation) =>
        reservation.date === date &&
        (reservation.status === "aprobado" || reservation.status === "completado"),
    );
  };

  return (
    <main className="page">
      {!isAdminView && <header className={`site-header${isHeaderHidden ? " site-header--hidden" : ""}`}>
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
                {text.home}
              </a>
            </li>
            <li>
              <a href="#experiencia" onClick={(e) => handleNavClick(e, "experiencia")}>
                {text.packages}
              </a>
            </li>
            <li>
              <a href="#safari-coffee" onClick={(e) => handleNavClick(e, "safari-coffee")}>
                {text.premium}
              </a>
            </li>
            <li>
              <a href="#contacto" onClick={(e) => handleNavClick(e, "contacto")}>
                {text.about}
              </a>
            </li>
          </ul>
        </nav>

        <div className="header-actions">
          <label className="language-switcher">
            <span className="sr-only">{text.language}</span>
            <select
              value={language}
              onChange={(event) => setLanguage(event.target.value as Language)}
              aria-label={text.language}
            >
              <option value="es">🇪🇸 ES</option>
              <option value="en">🇬🇧 EN</option>
            </select>
          </label>
          <button
            type="button"
            className="btn btn--primary header-btn header-reserva-btn"
            onClick={() => setIsCartOpen(true)}
            aria-label="Ver reservas seleccionadas"
          >
            <span>🛒 {text.cart}</span>
            {reservations.length > 0 && (
              <span className="header-reserva-badge">{reservations.length}</span>
            )}
          </button>
        </div>
      </header>}

      {isAdminView ? (
        <div style={{ maxWidth: "1200px", margin: "2rem auto", padding: "0 1rem" }}>
          {!adminSession ? (
            <div className="checkout-card" style={{ background: "#fff", borderRadius: "16px", padding: "2rem", boxShadow: "0 10px 30px rgba(0,0,0,0.08)" }}>
              <h2>Acceso administrativo</h2>
              <p style={{ color: "#555", marginBottom: "1rem" }}>Ingresa tu cuenta administrativa para revisar y gestionar reservas.</p>
              <form onSubmit={handleAdminLogin}>
                <input
                  type="email"
                  required
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  placeholder="admin@tudominio.com"
                  style={{ width: "100%", padding: "0.8rem", borderRadius: "8px", border: "1px solid #ccc", marginBottom: "0.75rem" }}
                />
                <input
                  type="password"
                  required
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
                  <h2 style={{ margin: "0.4rem 0 0" }}>Operación de reservas</h2>
                </div>
                <button type="button" className="btn btn--secondary" onClick={handleAdminLogout}>Cerrar sesión</button>
              </div>

              <nav aria-label="Secciones administrativas" style={{ display: "grid", gridTemplateColumns: "repeat(6, minmax(0, 1fr))", gap: "0.5rem", marginBottom: "1.5rem", borderBottom: "1px solid #e5e7eb", paddingBottom: "1rem" }}>
                <button type="button" className={`btn ${adminSection === "pending" ? "btn--primary" : "btn--secondary"}`} onClick={() => setAdminSection("pending")}>
                  Por aprobar <strong>({pendingReservations.length})</strong>
                </button>
                <button type="button" className={`btn ${adminSection === "approved" ? "btn--primary" : "btn--secondary"}`} onClick={() => setAdminSection("approved")}>
                  Aprobadas <strong>({approvedReservations.length})</strong>
                </button>
                <button type="button" className={`btn ${adminSection === "rejected" ? "btn--primary" : "btn--secondary"}`} onClick={() => setAdminSection("rejected")}>
                  Rechazadas <strong>({rejectedReservations.length})</strong>
                </button>
                <button type="button" className={`btn ${adminSection === "cancelled" ? "btn--primary" : "btn--secondary"}`} onClick={() => setAdminSection("cancelled")}>
                  Canceladas <strong>({cancelledReservations.length})</strong>
                </button>
                <button type="button" className={`btn ${adminSection === "completed" ? "btn--primary" : "btn--secondary"}`} onClick={() => setAdminSection("completed")}>
                  Completadas <strong>({completedReservations.length})</strong>
                </button>
                <button type="button" className={`btn ${adminSection === "calendar" ? "btn--primary" : "btn--secondary"}`} onClick={() => setAdminSection("calendar")}>
                  Calendario
                </button>
              </nav>

              {adminSection === "calendar" ? (
                <div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
                    <button type="button" className="calendar-nav-btn" onClick={() => moveAdminMonth(-1)} aria-label="Mes anterior">‹</button>
                    <h3 style={{ margin: 0, textTransform: "capitalize" }}>{formatAdminMonth()}</h3>
                    <button type="button" className="calendar-nav-btn" onClick={() => moveAdminMonth(1)} aria-label="Mes siguiente">›</button>
                  </div>
                  <div className="calendar-weekdays">
                    {["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"].map((day) => <span key={day}>{day}</span>)}
                  </div>
                  <div className="calendar-grid">
                    {Array.from({ length: getAdminCalendarDays().firstDay }).map((_, index) => <span key={`admin-empty-${index}`} className="calendar-day calendar-day--empty" />)}
                    {Array.from({ length: getAdminCalendarDays().daysInMonth }).map((_, index) => {
                      const day = index + 1;
                      const dayReservations = getReservationsForAdminDay(day);
                      return (
                        <div key={`admin-day-${day}`} className={`admin-calendar-day${dayReservations.length ? " admin-calendar-day--has-trips" : ""}`}>
                          <strong>{day}</strong>
                          {dayReservations.map((reservation) => <span key={reservation.id} title={reservation.packageTitle}>{reservation.packageTitle}</span>)}
                        </div>
                      );
                    })}
                  </div>
                  <p style={{ color: "#667085", marginTop: "1rem" }}>Los días resaltados tienen viajes aprobados o completados.</p>
                </div>
              ) : (
                adminReservationsForSection.length === 0 ? (
                  <p style={{ color: "#555" }}>No hay reservas en esta sección.</p>
                ) : (
                <div style={{ display: "grid", gap: "1rem" }}>
                  {adminReservationsForSection.map((reservation) => (
                    <div key={reservation.id} style={{ border: "1px solid #e5e7eb", borderRadius: "12px", padding: "1rem", background: "#f9fafb" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" }}>
                        <div>
                          <h3 style={{ margin: 0 }}>{reservation.packageTitle}</h3>
                          <p style={{ margin: "0.35rem 0", color: "#475467" }}>📅 {reservation.displayDate || reservation.date} · 👥 {reservation.peopleCount} personas</p>
                          <p style={{ margin: 0, color: "#475467" }}>💰 ${reservation.totalPrice}</p>
                        </div>
                        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", flexWrap: "wrap" }}>
                          <span style={{ background: reservation.status === "aprobado" || reservation.status === "completado" ? "#dcfce7" : reservation.status === "cancelado" || reservation.status === "rechazado" ? "#fee2e2" : "#e0f2fe", padding: "0.4rem 0.7rem", borderRadius: "999px", fontSize: "0.75rem", fontWeight: 700, color: "#0f172a" }}>
                            {reservation.status === "pendiente" ? "Por aprobar" : reservation.status === "aprobado" ? "Aprobada" : reservation.status === "rechazado" ? "Rechazada" : reservation.status === "cancelado" ? "Cancelada" : "Completada"}
                          </span>
                          {reservation.status === "pendiente" && <>
                            <button type="button" className="btn btn--secondary" onClick={() => updateReservationStatus(reservation.id, "aprobado")}>Aprobar</button>
                            <button type="button" className="btn btn--secondary" onClick={() => updateReservationStatus(reservation.id, "rechazado")}>Rechazar</button>
                          </>}
                          {reservation.status === "aprobado" && <>
                            <button type="button" className="btn btn--secondary" onClick={() => updateReservationStatus(reservation.id, "cancelado")}>Cancelar</button>
                            <button type="button" className="btn btn--secondary" onClick={() => updateReservationStatus(reservation.id, "completado")}>Completar</button>
                          </>}
                          <button type="button" className="btn btn--secondary" onClick={() => handleViewReceipt(reservation.receiptPath)}>Ver comprobante</button>
                          {(reservation.status === "cancelado" || reservation.status === "rechazado") && <button type="button" className="btn btn--secondary" onClick={() => handleAdminDeleteReservation(reservation.id)}>Eliminar</button>}
                        </div>
                      </div>

                      <div style={{ marginTop: "1rem", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                        <div>
                          <label style={{ display: "block", marginBottom: "0.3rem", fontWeight: 600 }}>Fecha</label>
                          <input
                            type="date"
                            value={reservation.date}
                            onChange={(e) => updateReservationData(reservation.id, e.target.value, reservation.peopleCount)}
                            disabled={reservation.status !== "aprobado"}
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
                            disabled={reservation.status !== "aprobado"}
                            style={{ width: "100%", padding: "0.7rem", borderRadius: "8px", border: "1px solid #ccc" }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                )
              )}
            </div>
          )}
        </div>
      ) : isCheckoutOpen ? (
        <CheckoutPage
          reservations={reservations}
          allPackages={allAvailablePackages}
          language={language}
          onBack={() => setIsCheckoutOpen(false)}
          onUpdateReservations={() => {
            setReservations([]);
            setIsCheckoutOpen(false);
            setIsCartOpen(false);
          }}
        />
      ) : selectedPackage ? (
        <PackageDetail
          pkg={selectedPackage}
          allPackages={allAvailablePackages}
          language={language}
          onSelectPackage={handleReserve}
          onBack={handleBack}
          onViewReservations={() => setIsCartOpen(true)}
          onAddReservation={handleAddReservationItem}
          existingReservations={reservations}
        />
      ) : (
        <>
          <header id="inicio" className="hero">
            <div className="hero__content">
              <p className="hero__eyebrow">{text.heroEyebrow}</p>

              <Heading
                title={text.heroTitle}
                subtitle={text.heroSubtitle}
              />

              <p className="hero__text">
                {text.heroText}
              </p>

              <div className="hero__actions">
                <button
                  type="button"
                  className="btn btn--primary"
                  onClick={() => document.getElementById("experiencia")?.scrollIntoView({ behavior: "smooth" })}
                >
                  {text.seePackages}
                </button>
                <button
                  type="button"
                  className="btn btn--secondary"
                  onClick={() => document.getElementById("equipo")?.scrollIntoView({ behavior: "smooth" })}
                >
                  {text.meetTeam}
                </button>
              </div>
            </div>

            <div className="hero__visual"></div>
          </header>

          <Section
            id="experiencia"
            title={text.packages}
            description={text.chooseExperience}
          >
            {packagesLoading && <p>Cargando paquetes...</p>}
            {packagesError && <p role="alert">{packagesError}</p>}
            {!packagesLoading && !packagesError && regularPackages.length === 0 && (
              <p>No hay paquetes disponibles en este momento.</p>
            )}
            <div className="packages-grid">
              {regularPackages.map((pkg) => (
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
                        <h4>{text.included}</h4>
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
                      {text.reserve}
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </Section>

          <Section
            id="safari-coffee"
            title={text.premium}
            description={text.premiumDescription}
          >
            <div className="packages-grid">
              {premiumPackages.map((pkg) => (
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
                        <h4>{text.included}</h4>
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
                      {text.reserve}
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </Section>

          <section id="contacto" className="about-section">
            <div className="about-section__content">
              <p className="about-section__eyebrow">{text.about}</p>
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
              <p className="about-section__eyebrow">{text.team}</p>
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
                  <h3>{text.reservations}</h3>
                  <p>{reservations.length} {reservations.length === 1 ? text.selectedPackage : text.selectedPackages}</p>
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
                    {text.checkout} →
                  </button>
                  <button
                    type="button"
                    className="btn btn--secondary btn--full"
                    onClick={() => setIsCartOpen(false)}
                  >
                    {text.continueExploring}
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