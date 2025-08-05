/**
 * Particles.js - Sistema de partículas interactivas para el fondo de la página principal
 * Basado en los colores de la paleta del sitio
 */

// Configuración de las partículas
const PARTICLE_CONFIG = {
  particleCount: 80,
  connectParticles: true,
  minDistance: 120,
  maxDistance: 280,
  speed: 0.6,
  responsiveBreakpoint: 768,
  mobileParticleCount: 40,
  colors: ['#0066ff', '#673AB7', '#0033cc']
};

class ParticleSystem {
  constructor(canvasId, config = {}) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.mouse = { x: null, y: null, radius: 150 };
    this.config = { ...PARTICLE_CONFIG, ...config };
    this.isDarkMode = document.body.classList.contains('dark-mode');
    
    this.init();
  }
  
  init() {
    // Configurar el canvas para que ocupe toda la pantalla
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    
    // Reducir número de partículas en móviles
    const particleCount = window.innerWidth < this.config.responsiveBreakpoint 
      ? this.config.mobileParticleCount 
      : this.config.particleCount;
    
    // Crear las partículas
    for (let i = 0; i < particleCount; i++) {
      this.particles.push(new Particle(this));
    }
    
    // Escuchar eventos
    this.addEventListeners();
    
    // Iniciar animación
    this.animate();
  }
  
  addEventListeners() {
    // Evento para seguir el ratón
    window.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
    });
    
    // Evento para cuando el ratón sale de la página
    window.addEventListener('mouseout', () => {
      this.mouse.x = undefined;
      this.mouse.y = undefined;
    });
    
    // Ajustar el tamaño del canvas cuando se redimensiona la ventana
    window.addEventListener('resize', () => {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
      
      // Recrear las partículas con la nueva dimensión
      this.particles = [];
      const particleCount = window.innerWidth < this.config.responsiveBreakpoint 
        ? this.config.mobileParticleCount 
        : this.config.particleCount;
      
      for (let i = 0; i < particleCount; i++) {
        this.particles.push(new Particle(this));
      }
    });
    
    // Detectar cambios de tema
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
      themeToggle.addEventListener('click', () => {
        setTimeout(() => {
          this.isDarkMode = document.body.classList.contains('dark-mode');
        }, 50);
      });
    }
  }
  
  animate() {
    requestAnimationFrame(() => this.animate());
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Actualizar y dibujar cada partícula
    for (const particle of this.particles) {
      particle.update();
      particle.draw();
    }
    
    // Conectar partículas cercanas
    if (this.config.connectParticles) {
      this.connectNearbyParticles();
    }
  }
  
  connectNearbyParticles() {
    const { particles, ctx, config, isDarkMode } = this;
    
    for (let a = 0; a < particles.length; a++) {
      for (let b = a + 1; b < particles.length; b++) {
        const dx = particles[a].x - particles[b].x;
        const dy = particles[a].y - particles[b].y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < config.maxDistance) {
          // Calcular opacidad basada en la distancia
          const opacity = 1 - (distance / config.maxDistance);
          
          if (isDarkMode) {
            // Colores más visibles para modo oscuro
            const brightColor = 'rgba(255,255,255,';
            if (distance < config.minDistance) {
              ctx.strokeStyle = brightColor + opacity * 0.9 + ')';
            } else {
              ctx.strokeStyle = brightColor + opacity * 0.4 + ')';
            }
          } else {
            // Colores para modo claro
            const darkColor = 'rgba(0,0,0,';
            if (distance < config.minDistance) {
              ctx.strokeStyle = darkColor + opacity * 0.8 + ')';
            } else {
              ctx.strokeStyle = darkColor + opacity * 0.2 + ')';
            }
          }
          
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(particles[a].x, particles[a].y);
          ctx.lineTo(particles[b].x, particles[b].y);
          ctx.stroke();
        }
      }
    }
  }
  
  getRandomColor() {
    return this.config.colors[Math.floor(Math.random() * this.config.colors.length)];
  }
}

class Particle {
  constructor(system) {
    this.system = system;
    this.x = Math.random() * system.canvas.width;
    this.y = Math.random() * system.canvas.height;
    this.size = Math.random() * 3 + 1;
    this.color = system.getRandomColor();
    
    // Velocidad aleatoria
    this.speedX = (Math.random() - 0.5) * system.config.speed;
    this.speedY = (Math.random() - 0.5) * system.config.speed;
  }
  
  update() {
    // Mover la partícula
    this.x += this.speedX;
    this.y += this.speedY;
    
    // Rebotar en los bordes
    if (this.x > this.system.canvas.width || this.x < 0) {
      this.speedX = -this.speedX;
    }
    
    if (this.y > this.system.canvas.height || this.y < 0) {
      this.speedY = -this.speedY;
    }
    
    // Interacción con el ratón
    const { mouse } = this.system;
    if (mouse.x !== undefined && mouse.y !== undefined) {
      const dx = mouse.x - this.x;
      const dy = mouse.y - this.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < mouse.radius) {
        const angle = Math.atan2(dy, dx);
        const force = (mouse.radius - distance) / mouse.radius;
        
        // Aplicar fuerza repulsiva
        this.speedX -= Math.cos(angle) * force * 0.5;
        this.speedY -= Math.sin(angle) * force * 0.5;
      }
    }
  }
  
  draw() {
    const { ctx, isDarkMode } = this.system;
    
    // Dibujar partícula con opacidad
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    
    // Establecer color con opacidad
    // Mayor brillo y opacidad para modo oscuro para mejor visibilidad
    const opacity = isDarkMode ? 0.9 : 0.5;
    
    // En modo oscuro, usar colores más brillantes
    if (isDarkMode) {
      // Asegurarse que sea uno de los colores configurados pero con mayor brillo
      ctx.fillStyle = this.color;
      // Añadir un borde blanco para mayor contraste
      ctx.strokeStyle = 'rgba(255,255,255,0.8)';
      ctx.lineWidth = 0.5;
      ctx.stroke();
    } else {
      ctx.fillStyle = this.color + hexOpacity(opacity);
    }
    
    ctx.fill();
  }
}

// Función para convertir opacidad a hexadecimal para colores
function hexOpacity(opacity) {
  const alpha = Math.round(opacity * 255).toString(16);
  return alpha.length === 1 ? '0' + alpha : alpha;
}

// Inicializar cuando se cargue la página
document.addEventListener('DOMContentLoaded', () => {
  // Crear el canvas si no existe
  let canvas = document.getElementById('particle-canvas');
  if (!canvas) {
    canvas = document.createElement('canvas');
    canvas.id = 'particle-canvas';
    document.body.insertBefore(canvas, document.body.firstChild);
  }
  
  // Inicializar sistema de partículas
  new ParticleSystem('particle-canvas');
});
