/**
 * Feature Flags Utility
 *
 * Controla la activación de features basado en fecha/hora.
 * La fecha de activación se configura en .env.local:
 * NEXT_PUBLIC_FEATURE_ACTIVATION_DATE=2026-01-31T17:00:00-06:00
 */

/**
 * Obtiene la fecha de activación desde las variables de entorno
 */
export function getActivationDate(): Date | null {
  const dateString = process.env.NEXT_PUBLIC_FEATURE_ACTIVATION_DATE;

  if (!dateString) {
    console.warn('NEXT_PUBLIC_FEATURE_ACTIVATION_DATE no está configurada');
    return null;
  }

  const date = new Date(dateString);

  if (isNaN(date.getTime())) {
    console.error('NEXT_PUBLIC_FEATURE_ACTIVATION_DATE tiene un formato inválido');
    return null;
  }

  return date;
}

/**
 * Verifica si las nuevas features están activadas
 * Retorna true si la fecha actual es >= fecha de activación
 */
export function isFeatureActive(): boolean {
  const activationDate = getActivationDate();

  if (!activationDate) {
    // Si no hay fecha configurada, features desactivadas por defecto
    return false;
  }

  const now = new Date();
  return now >= activationDate;
}

/**
 * Obtiene el tiempo restante hasta la activación
 * Retorna null si ya está activo o no hay fecha configurada
 */
export function getTimeUntilActivation(): {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalMs: number;
} | null {
  const activationDate = getActivationDate();

  if (!activationDate) return null;

  const now = new Date();
  const diff = activationDate.getTime() - now.getTime();

  if (diff <= 0) return null; // Ya está activo

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  return { days, hours, minutes, seconds, totalMs: diff };
}

/**
 * Formatea la fecha de activación para mostrar al usuario
 */
export function getFormattedActivationDate(): string {
  const activationDate = getActivationDate();

  if (!activationDate) return 'No configurada';

  return activationDate.toLocaleString('es-MX', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short'
  });
}
