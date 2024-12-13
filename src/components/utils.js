export const W = "w";
export const A = "a";
export const S = "s";
export const D = "d";
export const SHIFT = "shift";
export const DIRECTIONS = [W, A, S, D];

// Global object to track pressed keys
export const keysPressed = {};

export class KeyDisplay {
  constructor() {
    this.map = new Map();

    const w = this.createKeyElement(W);
    const a = this.createKeyElement(A);
    const s = this.createKeyElement(S);
    const d = this.createKeyElement(D);

    this.map.set(W, w);
    this.map.set(A, a);
    this.map.set(S, s);
    this.map.set(D, d);

    const container = document.createElement("div");
    container.id = "key-display-container";
    this.map.forEach((v) => container.appendChild(v));
    document.body.append(container);

    window.addEventListener("resize", this.updatePosition.bind(this));
    this.updatePosition();

    this.addInfoAndSettings();
    this.addClickListeners(); // Add click event listeners for the keys
  }

  createKeyElement(key) {
    const element = document.createElement("div");
    element.className = `key-display control-${key}`;
    element.textContent = key.toUpperCase();
    return element;
  }

  updatePosition() {
    const container = document.getElementById("key-display-container");
    if (container) {
      container.style.position = "fixed";
      container.style.bottom = "20px";
      container.style.left = "20px";
      container.style.transform = "none";
    }
  }

  down(key) {
    const keyLower = key.toLowerCase();
    if (this.map.get(keyLower)) {
      this.map.get(keyLower).classList.add("active");
      keysPressed[keyLower] = true; // Track key press state
    }
  }

  up(key) {
    const keyLower = key.toLowerCase();
    if (this.map.get(keyLower)) {
      this.map.get(keyLower).classList.remove("active");
      keysPressed[keyLower] = false; // Track key release state
    }
  }

  addInfoAndSettings() {
    const infoBtn = document.getElementById("info-btn");
    const settingsBtn = document.getElementById("settings-btn");
    const infoCard = document.getElementById("info-card");
    const infoClose = document.getElementById("info-close");
    const settingsPanel = document.getElementById("settings-panel");
    const toggleKeyDisplay = document.getElementById("toggle-key-display");
    const keyDisplayContainer = document.querySelector(
      "#key-display-container"
    );

    // Toggle Info Card
    infoBtn.addEventListener("click", () => {
      infoCard.style.display = "block";
    });

    infoClose.addEventListener("click", () => {
      infoCard.style.display = "none";
    });

    // Toggle Settings Panel
    settingsBtn.addEventListener("click", () => {
      settingsPanel.style.display =
        settingsPanel.style.display === "block" ? "none" : "block";
    });

    // Toggle Key Display Container
    toggleKeyDisplay.addEventListener("change", (e) => {
      keyDisplayContainer.style.display = e.target.checked ? "block" : "none";
    });
  }

  addClickListeners() {
    this.map.forEach((element, key) => {
      element.addEventListener("mousedown", () => {
        this.down(key);
      });
      element.addEventListener("mouseup", () => {
        this.up(key);
      });
    });
  }
}
