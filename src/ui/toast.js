/**
 * DDLC Toast Notification Component
 * Shows floating DDLC notification banners for quick actions (Save, Load, Auto, Skip).
 */

export class ToastNotification {
  constructor() {
    this.container = document.createElement('div');
    this.container.id = 'toastNotificationContainer';
    this.container.className = 'fixed top-14 left-1/2 -translate-x-1/2 z-[80] pointer-events-none flex flex-col items-center gap-2 transition-all duration-300';
    document.body.appendChild(this.container);
  }

  show(message, duration = 2200) {
    const toast = document.createElement('div');
    toast.className = 'ddlc-toast animate-bounce text-xs md:text-sm font-bold tracking-wide transform scale-95 opacity-0 transition-all duration-200';
    toast.innerHTML = `<span>${message}</span>`;

    this.container.appendChild(toast);

    // Trigger enter animation
    requestAnimationFrame(() => {
      toast.classList.remove('scale-95', 'opacity-0');
      toast.classList.add('scale-100', 'opacity-100');
    });

    // Auto dismiss
    setTimeout(() => {
      toast.classList.add('opacity-0', 'scale-90');
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 300);
    }, duration);
  }
}

export default ToastNotification;
