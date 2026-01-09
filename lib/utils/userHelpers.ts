/**
 * Extrae las iniciales del nombre de un usuario
 * @param name - Nombre completo del usuario
 * @returns Iniciales en mayúsculas (máximo 2 caracteres)
 * @example
 * getInitials("Juan Pérez") // "JP"
 * getInitials("María") // "M"
 * getInitials("") // "U"
 */
export function getInitials(name: string): string {
  if (!name || name.trim() === '') {
    return 'U' // "U" de Usuario por defecto
  }

  return name
    .trim()
    .split(' ')
    .filter(word => word.length > 0)
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}
