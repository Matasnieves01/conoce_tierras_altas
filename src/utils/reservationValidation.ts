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
