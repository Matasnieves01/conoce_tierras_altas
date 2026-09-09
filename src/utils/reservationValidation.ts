export interface ReservationDateCandidate {
  packageId: string;
  date: string;
}

export function hasDateConflict(
  reservations: ReservationDateCandidate[],
  candidate: ReservationDateCandidate,
): boolean {
  return reservations.some(
    (reservation) =>
      reservation.packageId !== candidate.packageId &&
      reservation.date === candidate.date,
  );
}

export function canAddReservation(
  reservations: ReservationDateCandidate[],
  candidate: ReservationDateCandidate,
): boolean {
  return !hasDateConflict(reservations, candidate);
}

export interface AccessibilityInfo {
  level: "accessible" | "advisory" | "warning";
  badgeText: string;
  durationText: string;
  shortNotice: string;
  fullNotice: string;
}

export function getPackageAccessibility(
  pkg: { id?: string; title?: string; duration?: string; difficulty?: string; accessibility?: string },
  language: "es" | "en" = "es",
): AccessibilityInfo {
  const id = pkg.id?.toLowerCase() || "";
  const title = pkg.title?.toLowerCase() || "";

  // 1. Tour de Aventura: Cualquier persona, duracion 4Hrs
  if (
    id === "finca-la-suiza" ||
    id === "aventura" ||
    (title.includes("aventura") && !title.includes("experiencia"))
  ) {
    return {
      level: "accessible",
      badgeText: language === "en" ? "Any person • 4 Hrs" : "Cualquier persona • 4 Hrs",
      durationText: language === "en" ? "4 Hours" : "4 Horas",
      shortNotice: language === "en" ? "Any person (Low physical demand)" : "Cualquier persona (Baja exigencia)",
      fullNotice:
        language === "en"
          ? "Suitable for any person regardless of prior physical condition. Light walks and comfortable 4x4 routes."
          : "Apto para cualquier persona. Caminatas ligeras, senderos accesibles y recorridos cómodos en 4x4.",
    };
  }

  // 2. Tour de Experiencia de Cafe: Aviso a mayores de edad y personas que padecen de alguna condicion, Duracion 6 a 8 Hrs
  if (
    id === "aventura-lagunas-volcan" ||
    id === "cafe" ||
    (title.includes("experiencia de cafe") && !title.includes("tour aventura"))
  ) {
    return {
      level: "advisory",
      badgeText: language === "en" ? "Advisory: Seniors & Health • 6-8 Hrs" : "Aviso: Mayores y salud • 6-8 Hrs",
      durationText: language === "en" ? "6 to 8 Hours" : "6 a 8 Horas",
      shortNotice:
        language === "en"
          ? "Notice for seniors & health conditions"
          : "Aviso a mayores de edad y personas con alguna condición",
      fullNotice:
        language === "en"
          ? "Advisory for seniors and people suffering from any health condition. The tour includes mountain trails, slopes, and elevation changes."
          : "Aviso a mayores de edad y a personas que padecen de alguna condición médica previa. Se recorren senderos con pendientes, caminos de montaña y cambios de elevación.",
    };
  }

  // 3. Tour Aventura y Experiencia de Cafe: Advertencia a mayores de edad y a personas que padecen de alguna condicion por terrenos dificiles, duracion Max 10 Hrs segun clima
  if (
    id === "cascadas-finca-panama" ||
    id === "completo" ||
    title.includes("tour aventura y experiencia") ||
    (title.includes("aventura") && title.includes("experiencia"))
  ) {
    return {
      level: "warning",
      badgeText: language === "en" ? "Warning: Rough Terrain • Max 10 Hrs" : "Advertencia: Terrenos difíciles • Máx 10 Hrs",
      durationText: language === "en" ? "Max 10 Hours (weather dependent)" : "Máx. 10 Horas según clima",
      shortNotice:
        language === "en"
          ? "Warning for seniors & health conditions (Difficult terrain)"
          : "Advertencia a mayores de edad y con alguna condición (Terrenos difíciles)",
      fullNotice:
        language === "en"
          ? "Warning for seniors and people suffering from any health condition due to difficult terrain, steep rocky trails, and demanding conditions (Duration up to 10 hours depending on weather). Requires good physical stamina."
          : "Advertencia a mayores de edad y a personas que padecen de alguna condición física o médica por terrenos difíciles, senderos técnicos y tramos de alta exigencia (Duración máx. 10 horas según clima). Requiere buena condición física.",
    };
  }

  // Default / Safari Coffee packages
  return {
    level: "accessible",
    badgeText: pkg.difficulty || (language === "en" ? "All public • 5-6 Hrs" : "Todo público • 5-6 Hrs"),
    durationText: pkg.duration || (language === "en" ? "5 - 6 Hours" : "5 - 6 Horas"),
    shortNotice: pkg.difficulty || (language === "en" ? "Suitable for all audiences" : "Apto para todo público"),
    fullNotice:
      pkg.accessibility ||
      (language === "en"
        ? "Exclusive 4x4 safari with guided coffee tastings and accessible walks."
        : "Recorrido safari 4x4 con catas guiadas y caminatas cómodas por fincas cafetaleras."),
  };
}
