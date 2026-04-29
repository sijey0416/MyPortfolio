document.addEventListener("DOMContentLoaded", () => {
  // --- CUSTOM CURSOR ---
  const cursorDot = document.querySelector(".cursor-dot");
  const cursorRing = document.querySelector(".cursor-ring");

  window.addEventListener("mousemove", (e) => {
    // Dot follows exactly
    cursorDot.style.left = `${e.clientX}px`;
    cursorDot.style.top = `${e.clientY}px`;

    // Ring follows with slight delay
    cursorRing.style.left = `${e.clientX}px`;
    cursorRing.style.top = `${e.clientY}px`;
  });

  // Clicking effect
  window.addEventListener("mousedown", () => {
    cursorRing.style.transform = "translate(-50%, -50%) scale(0.8)";
    cursorRing.style.borderColor = "var(--blood-red)";
    cursorDot.style.transform = "translate(-50%, -50%) scale(1.5)";
  });
  window.addEventListener("mouseup", () => {
    cursorRing.style.transform = "translate(-50%, -50%) scale(1)";
    cursorRing.style.borderColor = "var(--highlight-gold)";
    cursorDot.style.transform = "translate(-50%, -50%) scale(1)";
  });

  // Hover effect on interactable elements
  const interactables = document.querySelectorAll(
    "button, a, .case-file, .cert-card, .exp-tab, .hit-btn, .close-folder, .inspect-btn, .profile-frame",
  );
  interactables.forEach((el) => {
    el.addEventListener("mouseenter", () => {
      cursorRing.style.transform = "translate(-50%, -50%) scale(1.5)";
      cursorRing.style.borderColor = "var(--blood-red)";
      cursorRing.style.backgroundColor = "rgba(139,0,0,0.1)";
      cursorDot.style.opacity = "0";
    });
    el.addEventListener("mouseleave", () => {
      cursorRing.style.transform = "translate(-50%, -50%) scale(1)";
      cursorRing.style.borderColor = "var(--highlight-gold)";
      cursorRing.style.backgroundColor = "transparent";
      cursorDot.style.opacity = "1";
    });
  });

  // --- TYPEWRITER EFFECT ---
  const textArray = ["Aspiring Software Engineer", "FreeLance Game Developer."];
  let textIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  const typewriterElement = document.getElementById("typewriter");

  function type() {
    const currentText = textArray[textIndex];

    if (isDeleting) {
      typewriterElement.textContent = currentText.substring(0, charIndex - 1);
      charIndex--;
    } else {
      typewriterElement.textContent = currentText.substring(0, charIndex + 1);
      charIndex++;
    }

    let typeSpeed = isDeleting ? 50 : 100;

    if (!isDeleting && charIndex === currentText.length) {
      // Pause at end of word
      typeSpeed = 2000;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      textIndex = (textIndex + 1) % textArray.length;
      typeSpeed = 500;
    }

    // Occasional "glitch" fast type to mimic real old typewriter
    if (!isDeleting && Math.random() < 0.1) {
      typeSpeed = 20;
    }

    setTimeout(type, typeSpeed);
  }

  // Start the typing effect after a short delay
  setTimeout(type, 1500);

  // --- SCROLL REVEAL (INTERSECTION OBSERVER) ---
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("revealed");
        // observer.unobserve(entry.target); // Optional: only reveal once
      }
    });
  }, observerOptions);

  document.querySelectorAll(".section-hidden").forEach((section) => {
    observer.observe(section);
  });

  // Trigger reveal for hero immediately on load
  setTimeout(() => {
    document.querySelector(".hero").classList.add("revealed");
  }, 100);

  // --- EXPERIENCE TABS ---
  const tabs = document.querySelectorAll(".exp-tab");
  const panels = document.querySelectorAll(".exp-panel");

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      // Remove active from all
      tabs.forEach((t) => t.classList.remove("active"));
      panels.forEach((p) => p.classList.remove("active"));

      // Add to current
      tab.classList.add("active");
      const targetId = tab.getAttribute("data-target");
      document.getElementById(targetId).classList.add("active");
    });
  });
});

// --- GLOBAL MODAL FUNCTIONS ---

function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.style.display = "flex";
    // Small timeout to allow display block to apply before opacity transition
    setTimeout(() => {
      modal.classList.add("show");
    }, 10);

    // Reset carousel to first slide on open
    const track = modal.querySelector(".carousel-track");
    if (track) {
      track.setAttribute("data-index", "0");
      track.style.transform = `translateX(0%)`;
    }
  }
}

function moveCarousel(trackId, direction) {
  const track = document.getElementById(trackId);
  if (!track) return;

  const slides = track.children;
  const totalSlides = slides.length;
  if (totalSlides === 0) return;

  let currentIndex = parseInt(track.getAttribute("data-index") || "0");
  let nextIndex = currentIndex + direction;

  if (nextIndex < 0) {
    nextIndex = totalSlides - 1; // Wrap to end
  } else if (nextIndex >= totalSlides) {
    nextIndex = 0; // Wrap to start
  }

  track.setAttribute("data-index", nextIndex);
  track.style.transform = `translateX(-${nextIndex * 100}%)`;
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove("show");
    setTimeout(() => {
      modal.style.display = "none";
    }, 300); // Matches CSS transition time
  }
}

// Certificate Modal Specific
function openCertModal(certType) {
  const certData = {
    JavaCert: { title: "Java Programming", img: "./Pictures/JavaCert.png" },
    SystemAdminCert: {
      title: "System Administration",
      img: "./Pictures/SystemAdminCert.png",
    },
    SAP4Hana: { title: "SAP S/4HANA", img: "./Pictures/SapCert.png" },
  };

  const cert = certData[certType];
  if (cert) {
    document.getElementById("cert-title").textContent = cert.title;
    document.getElementById("cert-img").src = cert.img;
    openModal("cert-modal");
  }
}

// Close Modal when clicking outside the manila folder
window.onclick = function (event) {
  if (event.target.classList.contains("manila-modal")) {
    closeModal(event.target.id);
  }
};

// --- FORM SUBMISSION SIMULATION ---
// --- FORM SUBMISSION WITH WEB3FORMS ---
function simulateSubmit(event, isContact) {
  event.preventDefault();
  
  const form = event.target;
  const formData = new FormData(form);
  const name = formData.get('name');
  const email = formData.get('email');
  const message = formData.get('message') || '';
  const honey = formData.get('_honey') || '';
  const errorMsgEl = form.querySelector('.error-msg');
  
  // Clear previous errors
  if (errorMsgEl) errorMsgEl.style.display = 'none';

  // Check honeypot (spam protection)
  if (honey.trim() !== '') {
    // Silently fail for bots
    return;
  }

  // Validate Gmail
  if (!email.toLowerCase().endsWith('@gmail.com')) {
    if (errorMsgEl) {
      errorMsgEl.textContent = 'Error: Only @gmail.com addresses are accepted.';
      errorMsgEl.style.display = 'block';
    } else {
      alert('Error: Only @gmail.com addresses are accepted.');
    }
    return;
  }

  // Show loading state
  const loadingBar = document.getElementById('loading-bar');
  if (loadingBar) {
    loadingBar.classList.remove('loading-active');
    void loadingBar.offsetWidth; // trigger reflow
    loadingBar.classList.add('loading-active');
  }
  
  // Disable submit button
  const submitBtn = form.querySelector('button[type="submit"]');
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.style.opacity = '0.5';
    submitBtn.style.cursor = 'not-allowed';
    submitBtn.innerHTML = 'Sending... <i class="fa-solid fa-spinner fa-spin"></i>';
  }

  // Prepare Web3Forms data
  const web3Data = {
    access_key: '127c4fea-0e33-418a-a3f3-c4fa7c5d014b',
    subject: isContact ? 'Work Inquiry from Portfolio' : 'App Download Request from Portfolio',
    from_name: name,
    from_email: email,
    message: isContact ? message : `Request for downloadable app version of game project.\n\nName: ${name}\nEmail: ${email}`,
    _template: 'table',
    _captcha: 'false'
  };

  // Submit to Web3Forms
  fetch('https://api.web3forms.com/submit', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(web3Data)
  })
  .then(response => response.json())
  .then(data => {
    // Hide loading
    if (loadingBar) {
      loadingBar.classList.remove('loading-active');
    }
    
    // Re-enable submit button
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.style.opacity = '1';
      submitBtn.style.cursor = 'none';
      submitBtn.innerHTML = isContact ? 'Send Email <i class="fa-solid fa-paper-plane"></i>' : 'Request App <i class="fa-solid fa-paper-plane"></i>';
    }
    
    if (data.success) {
      // Success
      openModal('modal-submit-success');
      form.reset();
    } else {
      // Error
      if (errorMsgEl) {
        errorMsgEl.textContent = 'Error: ' + (data.message || 'Failed to send message. Please try again.');
        errorMsgEl.style.display = 'block';
      } else {
        alert('Error: ' + (data.message || 'Failed to send message. Please try again.'));
      }
    }
  })
  .catch(error => {
    // Hide loading
    if (loadingBar) {
      loadingBar.classList.remove('loading-active');
    }
    
    // Re-enable submit button
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.style.opacity = '1';
      submitBtn.style.cursor = 'none';
      submitBtn.innerHTML = isContact ? 'Send Email <i class="fa-solid fa-paper-plane"></i>' : 'Request App <i class="fa-solid fa-paper-plane"></i>';
    }
    
    // Network error
    if (errorMsgEl) {
      errorMsgEl.textContent = 'Error: Network error. Please check your connection and try again.';
      errorMsgEl.style.display = 'block';
    } else {
      alert('Error: Network error. Please check your connection and try again.');
    }
    console.error('Web3Forms submission error:', error);
  });
}
