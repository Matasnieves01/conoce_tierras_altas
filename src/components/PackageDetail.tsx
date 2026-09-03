import { useEffect, useState } from "react";

export interface PackageInfo {
  id: string;
  icon: string;
  title: string;
  price: string;
  numericPrice?: number;
  category?: string;
  description: string;
  longDescription?: string;
  duration?: string;
  difficulty?: string;
  location?: string;
  includes: string[];
  highlights?: string[];
  itinerary?: { time: string; title: string; desc: string }[];
  image: string;
  gallery?: string[];
  videoUrl?: string;
  videoPoster?: string;
  className: string;
}

export interface ReservationItem {
  packageId: string;
  packageTitle: string;
  packageIcon: string;
  packageImage: string;
  pricePerPerson: number;
  peopleCount: number;
  totalPrice: number;
  date: string;
  displayDate: string;
}

interface PackageDetailProps {
  pkg: PackageInfo;
  allPackages: PackageInfo[];
  onSelectPackage: (pkg: PackageInfo) => void;
  onBack: () => void;
  onViewReservations?: () => void;
  onAddReservation?: (res: ReservationItem) => boolean | void;
  existingReservations?: ReservationItem[];
}

const MONTH_NAMES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

const WEEK_DAYS = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

export function PackageDetail({
  pkg,
  allPackages,
  onSelectPackage,
  onBack,
  onViewReservations,
  onAddReservation,
  existingReservations = [],
}: PackageDetailProps) {
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number>(0);
  const [isGalleryPaused, setIsGalleryPaused] = useState<boolean>(false);
  const [peopleCount, setPeopleCount] = useState<number>(2);

  // Calendar State
  const today = new Date();
  const [calendarYear, setCalendarYear] = useState<number>(today.getFullYear());
  const [calendarMonth, setCalendarMonth] = useState<number>(today.getMonth());

  // Default selected date: 5 days from now
  const defaultDate = new Date();
  defaultDate.setDate(defaultDate.getDate() + 5);
  const [selectedDate, setSelectedDate] = useState<string>(
    defaultDate.toISOString().split("T")[0]
  );

  const [isReserved, setIsReserved] = useState<boolean>(false);
  const [reservationMessage, setReservationMessage] = useState<string>("");

  // Extract numeric price safely
  const unitPrice = pkg.numericPrice || parseInt(pkg.price.replace(/\D/g, ""), 10) || 100;
  const totalPrice = unitPrice * peopleCount;

  // Default gallery if none provided
  const photoGallery = pkg.gallery && pkg.gallery.length > 0 ? pkg.gallery : [
    pkg.image,
    "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=900&q=80",
  ];

  // Auto-play gallery effect
  useEffect(() => {
    if (isGalleryPaused || photoGallery.length <= 1) return;

    const interval = setInterval(() => {
      setSelectedPhotoIndex((prev) => (prev + 1) % photoGallery.length);
    }, 3800);

    return () => clearInterval(interval);
  }, [isGalleryPaused, photoGallery.length]);

  const handlePrevPhoto = () => {
    setSelectedPhotoIndex((prev) => (prev === 0 ? photoGallery.length - 1 : prev - 1));
  };

  const handleNextPhoto = () => {
    setSelectedPhotoIndex((prev) => (prev + 1) % photoGallery.length);
  };

  // Calendar calculation functions
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const totalDays = getDaysInMonth(calendarYear, calendarMonth);
  const firstDay = getFirstDayOfMonth(calendarYear, calendarMonth);

  // Deterministic check for reserved / unavailable dates
  const isDateBooked = (day: number) => {
    const bookedDays = [3, 8, 14, 21, 27];
    return bookedDays.includes(day);
  };

  const isDatePast = (day: number) => {
    const checkDate = new Date(calendarYear, calendarMonth, day, 23, 59, 59);
    const now = new Date();
    return checkDate < now;
  };

  const handlePrevMonth = () => {
    if (calendarMonth === 0) {
      setCalendarMonth(11);
      setCalendarYear((prev) => prev - 1);
    } else {
      setCalendarMonth((prev) => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (calendarMonth === 11) {
      setCalendarMonth(0);
      setCalendarYear((prev) => prev + 1);
    } else {
      setCalendarMonth((prev) => prev + 1);
    }
  };

  const isReservedDateForOtherPackage = (day: number) => {
    const formattedMonth = String(calendarMonth + 1).padStart(2, "0");
    const formattedDay = String(day).padStart(2, "0");
    const dateString = `${calendarYear}-${formattedMonth}-${formattedDay}`;

    return existingReservations.some(
      (reservation) => reservation.packageId !== pkg.id && reservation.date === dateString,
    );
  };

  const handleSelectDay = (day: number) => {
    if (isDatePast(day) || isDateBooked(day) || isReservedDateForOtherPackage(day)) return;
    const formattedMonth = String(calendarMonth + 1).padStart(2, "0");
    const formattedDay = String(day).padStart(2, "0");
    setSelectedDate(`${calendarYear}-${formattedMonth}-${formattedDay}`);
    setIsReserved(false);
  };

  const formatDisplayDate = (dateStr: string) => {
    if (!dateStr) return "";
    const [y, m, d] = dateStr.split("-").map(Number);
    const dateObj = new Date(y, m - 1, d);
    return dateObj.toLocaleDateString("es-ES", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleAddReservation = () => {
    const hasConflict = existingReservations.some(
      (reservation) =>
        reservation.packageId !== pkg.id && reservation.date === selectedDate,
    );

    if (hasConflict) {
      setIsReserved(false);
      setReservationMessage(
        `Ya tienes un paquete reservado para el día ${formatDisplayDate(selectedDate)}. Elige otra fecha para continuar con la reserva.`
      );
      return;
    }

    const displayDateStr = formatDisplayDate(selectedDate);
    const result = onAddReservation?.({
      packageId: pkg.id,
      packageTitle: pkg.title,
      packageIcon: pkg.icon,
      packageImage: pkg.image,
      pricePerPerson: unitPrice,
      peopleCount: peopleCount,
      totalPrice: totalPrice,
      date: selectedDate,
      displayDate: displayDateStr,
    });

    if (result === false) {
      setIsReserved(false);
      setReservationMessage(
        `Ya existe una reserva en esta fecha. Elige otra fecha para reservar "${pkg.title}".`
      );
      return;
    }

    setIsReserved(true);
    setReservationMessage(
      `¡Excelente elección! Hemos agregado "${pkg.title}" para ${peopleCount} personas el ${displayDateStr} a tu reserva.`
    );
  };

  return (
    <div className="package-detail-page">
      {/* Full-width Edge-to-Edge Hero Banner */}
      <header
        className="package-detail__hero"
        style={{
          backgroundImage: `linear-gradient(180deg, rgba(0, 0, 0, 0.35) 0%, rgba(10, 30, 20, 0.45) 45%, rgba(10, 30, 20, 0.95) 100%), url(${pkg.image})`,
        }}
      >
        <div className="package-detail__hero-topbar">
          <button
            type="button"
            className="btn btn--secondary package-detail__back-btn"
            onClick={onBack}
          >
            ← Volver a la página principal
          </button>
        </div>

        <div className="package-detail__hero-container">
          <div className="package-detail__hero-content">
            <div className="package-detail__badges">
              <span className="hero-badge hero-badge--category">
                {pkg.icon} {pkg.category || "Tour Tierras Altas"}
              </span>
              <span className="hero-badge">
                ⏱ {pkg.duration || "5 - 6 Horas"}
              </span>
              <span className="hero-badge">
                📍 {pkg.location || "Tierras Altas, Panamá"}
              </span>
              <span className="hero-badge">
                🚙 {pkg.difficulty || "Aventura 4x4"}
              </span>
            </div>

            <h1 className="package-detail__title">{pkg.title}</h1>
            <p className="package-detail__tagline">{pkg.description}</p>

            <div className="package-detail__price-tag-hero">
              <div className="price-tag-hero__amount">
                <strong>{pkg.price}</strong>
                <span className="price-tag-hero__unit">por persona</span>
              </div>
              <button
                type="button"
                className="btn btn--primary"
                onClick={() => {
                  const el = document.getElementById("reserva-card");
                  if (el) {
                    el.scrollIntoView({ behavior: "smooth", block: "start" });
                  }
                }}
              >
                Reservar este tour ↓
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Container */}
      <div className="package-detail__container">
        {/* Main 2-Column Grid */}
        <div className="package-detail__layout">
          {/* Left Column: Details, Highlights, Media Gallery, Includes */}
          <main className="package-detail__main">
          {/* Quick Specs Cards */}
          <section className="specs-grid">
            <div className="spec-item">
              <span className="spec-item__icon">⏱</span>
              <div>
                <strong>Duración</strong>
                <p>{pkg.duration || "5 a 6 horas"}</p>
              </div>
            </div>
            <div className="spec-item">
              <span className="spec-item__icon">👥</span>
              <div>
                <strong>Grupo</strong>
                <p>Mínimo 2 personas</p>
              </div>
            </div>
            <div className="spec-item">
              <span className="spec-item__icon">🗣</span>
              <div>
                <strong>Idioma</strong>
                <p>Español e Inglés</p>
              </div>
            </div>
            <div className="spec-item">
              <span className="spec-item__icon">🚙</span>
              <div>
                <strong>Transporte</strong>
                <p>Vehículo Safari 4x4</p>
              </div>
            </div>
          </section>

          {/* Overview / Story */}
          <section className="detail-section">
            <h2 className="detail-section__title">Sobre esta experiencia</h2>
            <p className="detail-section__text">
              {pkg.longDescription ||
                `${pkg.description} Diseñado especialmente para quienes buscan conectar con la esencia de Tierras Altas, su cultura cafetalera de renombre mundial y sus paisajes montañosos incomparables. Recorre senderos únicos, cafetales en producción y miradores volcánicos.`}
            </p>

            {pkg.highlights && pkg.highlights.length > 0 ? (
              <div className="highlights-list">
                <h3>Puntos destacados:</h3>
                <div className="highlights-pills">
                  {pkg.highlights.map((h, i) => (
                    <span key={i} className="highlight-pill">
                      ✨ {h}
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              <div className="highlights-list">
                <h3>Puntos destacados:</h3>
                <div className="highlights-pills">
                  <span className="highlight-pill">✨ Paisajes únicos del Volcán Barú</span>
                  <span className="highlight-pill">☕ Café de especialidad de altura</span>
                  <span className="highlight-pill">🌿 Conexión con la naturaleza y fincas</span>
                  <span className="highlight-pill">📸 Paradas fotográficas privilegiadas</span>
                </div>
              </div>
            )}
          </section>

          {/* Multimedia Section: Auto-sliding Photos Gallery */}
          <section
            className="detail-section media-showcase-section"
            onMouseEnter={() => setIsGalleryPaused(true)}
            onMouseLeave={() => setIsGalleryPaused(false)}
          >
            <div className="media-showcase__header">
              <div>
                <span className="about-section__eyebrow">Galería de Imágenes</span>
                <h2 className="detail-section__title">Fotos del Tour</h2>
              </div>
              <div className="gallery-counter-badge">
                <span>{selectedPhotoIndex + 1} de {photoGallery.length} fotos</span>
                <span className="gallery-pulse-dot" title="Galería automática"></span>
              </div>
            </div>

            <div className="gallery-showcase">
              <div className="gallery-main-view">
                <img
                  key={selectedPhotoIndex}
                  src={photoGallery[selectedPhotoIndex]}
                  alt={`${pkg.title} - Foto ${selectedPhotoIndex + 1}`}
                  className="gallery-main-img gallery-main-img--fade"
                />

                {/* Left & Right Arrow Controls */}
                <button
                  type="button"
                  className="gallery-nav-arrow gallery-nav-arrow--prev"
                  onClick={handlePrevPhoto}
                  aria-label="Foto anterior"
                >
                  ‹
                </button>
                <button
                  type="button"
                  className="gallery-nav-arrow gallery-nav-arrow--next"
                  onClick={handleNextPhoto}
                  aria-label="Foto siguiente"
                >
                  ›
                </button>

                <div className="gallery-main-caption">
                  <span>
                    {selectedPhotoIndex === 0
                      ? `Vista principal de ${pkg.title}`
                      : `Ruta y paisajes de Tierras Altas - Foto ${selectedPhotoIndex + 1}`}
                  </span>
                  <div className="gallery-dots-indicator">
                    {photoGallery.map((_, dotIdx) => (
                      <span
                        key={dotIdx}
                        className={`gallery-dot ${dotIdx === selectedPhotoIndex ? "gallery-dot--active" : ""}`}
                        onClick={() => setSelectedPhotoIndex(dotIdx)}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="gallery-thumbnails">
                {photoGallery.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    className={`gallery-thumb-btn ${idx === selectedPhotoIndex ? "gallery-thumb-btn--active" : ""}`}
                    onClick={() => setSelectedPhotoIndex(idx)}
                  >
                    <img src={imgUrl} alt={`Miniatura ${idx + 1}`} />
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* Includes Section */}
          <section className="detail-section">
            <h2 className="detail-section__title">¿Qué incluye este paquete?</h2>
            <div className="includes-grid">
              {pkg.includes.map((item, idx) => (
                <div key={idx} className="include-card">
                  <span className="include-card__check">✓</span>
                  <span className="include-card__text">{item}</span>
                </div>
              ))}
            </div>
          </section>
        </main>

        {/* Right Column: Sticky Booking / Reservation Box */}
        <aside className="package-detail__sidebar" id="reserva-card">
          <div className="booking-card">
            <div className="booking-card__header">
              <span className="booking-card__eyebrow">Reserva tu fecha</span>
              <h3 className="booking-card__title">{pkg.title}</h3>
              <div className="booking-card__price-tag">
                <strong className="booking-card__price">{pkg.price}</strong>
                <span className="booking-card__unit">por persona</span>
              </div>
            </div>

            <div className="booking-card__body">
              {/* People Counter (Min 2 personas) */}
              <div className="booking-form-group">
                <label className="booking-form-label">
                  <span>Número de personas</span>
                  <span className="label-helper">Mínimo 2 personas</span>
                </label>
                <div className="counter-control">
                  <button
                    type="button"
                    className="counter-btn"
                    onClick={() => setPeopleCount((prev) => Math.max(2, prev - 1))}
                    disabled={peopleCount <= 2}
                    aria-label="Disminuir personas"
                  >
                    -
                  </button>
                  <span className="counter-value">{peopleCount} personas</span>
                  <button
                    type="button"
                    className="counter-btn"
                    onClick={() => setPeopleCount((prev) => prev + 1)}
                    aria-label="Aumentar personas"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Interactive Calendar with Availability */}
              <div className="booking-form-group">
                <label className="booking-form-label">
                  <span>Selecciona una fecha disponible</span>
                </label>

                <div className="calendar-widget">
                  {/* Calendar Header Month Navigator */}
                  <div className="calendar-header">
                    <button
                      type="button"
                      className="calendar-nav-btn"
                      onClick={handlePrevMonth}
                      aria-label="Mes anterior"
                    >
                      ‹
                    </button>
                    <span className="calendar-title">
                      {MONTH_NAMES[calendarMonth]} {calendarYear}
                    </span>
                    <button
                      type="button"
                      className="calendar-nav-btn"
                      onClick={handleNextMonth}
                      aria-label="Mes siguiente"
                    >
                      ›
                    </button>
                  </div>

                  {/* Weekday headers */}
                  <div className="calendar-weekdays">
                    {WEEK_DAYS.map((w, idx) => (
                      <span key={idx} className="calendar-weekday">
                        {w}
                      </span>
                    ))}
                  </div>

                  {/* Calendar Grid */}
                  <div className="calendar-grid">
                    {/* Empty cells before first day */}
                    {Array.from({ length: firstDay }).map((_, idx) => (
                      <span key={`empty-${idx}`} className="calendar-day calendar-day--empty" />
                    ))}

                    {/* Day Cells */}
                    {Array.from({ length: totalDays }).map((_, idx) => {
                      const day = idx + 1;
                      const isPast = isDatePast(day);
                      const isBookedBySystem = !isPast && isDateBooked(day);
                      const isBookedByOtherPackage = !isPast && isReservedDateForOtherPackage(day);
                      const isBooked = isBookedBySystem || isBookedByOtherPackage;
                      const formattedMonth = String(calendarMonth + 1).padStart(2, "0");
                      const formattedDay = String(day).padStart(2, "0");
                      const dateString = `${calendarYear}-${formattedMonth}-${formattedDay}`;
                      const isSelected = selectedDate === dateString;

                      let cellClass = "calendar-day";
                      if (isPast) {
                        cellClass += " calendar-day--past";
                      } else if (isBooked) {
                      }

                      if (isSelected) {
                        cellClass += " calendar-day--selected";
                      }

                      return (
                        <button
                          key={`day-${day}`}
                          type="button"
                          className={cellClass}
                          disabled={isPast || isBooked}
                          onClick={() => handleSelectDay(day)}
                          title={
                            isPast
                              ? "Fecha pasada"
                              : isBooked
                              ? "No disponible (ya hay otra reserva en este día)"
                              : "Disponible para reservar"
                          }
                        >
                          {day}
                        </button>
                      );
                    })}
                  </div>

                  {/* Calendar Legend */}
                  <div className="calendar-legend">
                    <div className="legend-item">
                      <span className="legend-dot legend-dot--available"></span>
                      <span>Disponible</span>
                    </div>
                    <div className="legend-item">
                      <span className="legend-dot legend-dot--booked"></span>
                      <span>Con reservación</span>
                    </div>
                    <div className="legend-item">
                      <span className="legend-dot legend-dot--selected"></span>
                      <span>Seleccionada</span>
                    </div>
                  </div>

                  {/* Selected Date Summary */}
                  {selectedDate && (
                    <div className="selected-date-badge">
                      <span>📅 Fecha elegida:</span>
                      <strong>{formatDisplayDate(selectedDate)}</strong>
                    </div>
                  )}
                </div>
              </div>

              {/* Total Calculation */}
              <div className="booking-card__calculation">
                <div className="calc-row">
                  <span>{peopleCount} personas × {unitPrice}$</span>
                  <span>{totalPrice}$</span>
                </div>
                <div className="calc-row">
                  <span>Seguro e impuestos de ruta</span>
                  <span className="calc-free">Incluido</span>
                </div>
                <div className="calc-total">
                  <strong>Total estimado:</strong>
                  <strong className="calc-total-amount">{totalPrice}$</strong>
                </div>
              </div>

              {/* Reservation Action */}
              {isReserved ? (
                <div className="reservation-success-box">
                  <div className="success-icon">🎉</div>
                  <h4>¡Paquete agregado a tu reserva!</h4>
                  <p>{reservationMessage}</p>
                  <div style={{ display: "grid", gap: "0.75rem" }}>
                    <button
                      type="button"
                      className="btn btn--primary btn--full"
                      onClick={onViewReservations}
                    >
                      Ver mi reserva 🛒
                    </button>
                    <button
                      type="button"
                      className="btn btn--secondary btn--full"
                      onClick={onBack}
                    >
                      Agregar otro paquete +
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  className="btn btn--primary btn--full btn--pulse"
                  onClick={handleAddReservation}
                >
                  Agregar a mi reserva 🛒
                </button>
              )}

              {/* Policy Badges */}
              <div className="booking-trust-badges">
                <div className="trust-item">
                  <span>🛡️</span> Cancelación o modificación de fecha con <strong>mínimo 1 semana (7 días) de anticipación</strong>.
                </div>
                <div className="trust-item">
                  <span></span> Transporte 4x4 seguro y cómodo en toda la ruta.
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* Recommended / Other Available Packages Strip */}
      <section className="other-packages-section">
        <div className="other-packages__header">
          <span className="about-section__eyebrow">Continúa explorando</span>
          <h2>Otros paquetes disponibles</h2>
        </div>

        <div className="packages-grid">
          {allPackages
            .filter((p) => p.id !== pkg.id)
            .slice(0, 3)
            .map((otherPkg) => (
              <article
                key={otherPkg.id}
                className={`package-card ${otherPkg.className}`}
                tabIndex={0}
                onClick={() => {
                  onSelectPackage(otherPkg);
                  setSelectedPhotoIndex(0);
                  setIsReserved(false);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              >
                <div className="package-card__logo" aria-hidden="true">{otherPkg.icon}</div>
                <div className="package-card__heading">
                  <h3>{otherPkg.title}</h3>
                  <div className="package-card__price-box">
                    <strong className="package-card__price">{otherPkg.price}</strong>
                    <span className="package-card__per-person">por persona</span>
                  </div>
                </div>
                <p>{otherPkg.description}</p>
                <div className="package-card__details">
                  <h4>Incluye</h4>
                  <ul>
                    {otherPkg.includes.slice(0, 3).map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                  <button className="package-card__reserve">
                    Ver detalles del tour →
                  </button>
                </div>
              </article>
            ))}
        </div>
      </section>
      </div>
    </div>
  );
}

export default PackageDetail;