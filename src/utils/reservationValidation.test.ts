import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { hasDateConflict, canAddReservation } from './reservationValidation';

describe('reservationValidation', () => {
  it('detecta conflicto cuando ya existe otra reserva en la misma fecha', () => {
    const existing = [
      { packageId: 'tour-1', date: '2026-09-10' },
      { packageId: 'tour-2', date: '2026-09-11' },
    ];

    assert.equal(hasDateConflict(existing, { packageId: 'tour-3', date: '2026-09-10' }), true);
    assert.equal(canAddReservation(existing, { packageId: 'tour-3', date: '2026-09-12' }), true);
  });

  it('permite reemplazar la misma reserva del mismo paquete en la misma fecha', () => {
    const existing = [{ packageId: 'tour-1', date: '2026-09-10' }];

    assert.equal(
      canAddReservation(existing, { packageId: 'tour-1', date: '2026-09-10' }),
      true,
    );
  });
});
