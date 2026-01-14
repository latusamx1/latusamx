/**
 * Utilidad para crear efecto de confetti
 */

export function crearConfetti() {
  const colors = ['#3B82F6', '#8B5CF6', '#EC4899', '#10B981', '#F59E0B']

  for (let i = 0; i < 50; i++) {
    setTimeout(() => {
      const confetti = document.createElement('div')
      confetti.className = 'confetti-piece'
      confetti.style.cssText = `
        position: fixed;
        width: 10px;
        height: 10px;
        background-color: ${colors[Math.floor(Math.random() * colors.length)]};
        left: ${Math.random() * 100}%;
        animation: confetti-fall ${Math.random() * 2 + 2}s ease-out forwards;
        animation-delay: ${Math.random() * 0.5}s;
        z-index: 9999;
      `
      document.body.appendChild(confetti)
      setTimeout(() => confetti.remove(), 3500)
    }, i * 30)
  }
}

export const confettiStyles = `
  @keyframes confetti-fall {
    0% {
      transform: translateY(-100vh) rotate(0deg);
      opacity: 1;
    }
    100% {
      transform: translateY(100vh) rotate(720deg);
      opacity: 0;
    }
  }
`
