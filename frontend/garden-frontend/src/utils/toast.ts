export function showToast(message: string, type: "success" | "error" = "success") {
    const toast = document.createElement("div");

    toast.className = `
    toast align-items-center text-bg-${type} border-0 show 
    position-fixed bottom-0 end-0 m-3
  `;
    toast.role = "alert";
    toast.style.zIndex = "9999";

    toast.innerHTML = `
    <div class="d-flex">
      <div class="toast-body">${message}</div>
      <button type="button" class="btn-close btn-close-white me-2 m-auto"></button>
    </div>
  `;

    document.body.appendChild(toast);

    // Cerrar al pulsar la X
    toast.querySelector(".btn-close")?.addEventListener("click", () => toast.remove());

    // Autocierre a los 3 segundos
    setTimeout(() => toast.remove(), 3000);
}
