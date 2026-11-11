const fields = [
  "name","role","email","phone","city","linkedin","objective","summary",
  "education","educationDate","educationStatus","company","job","jobDate",
  "jobDescription","courses","skills","languages","projects","additional"
];

const form = document.getElementById("resumeForm");
const preview = document.getElementById("resumePreview");
const templateClasses = {
  classico: "classic-resume",
  moderno: "modern-resume",
  profissional: "professional-resume",
  minimalista: "minimalista-resume",
  criativo: "criativo-resume",
  primeiro: "primeiro-resume"
};
let currentTemplate = "classico";

function value(id) {
  return document.getElementById(id).value.trim();
}

function setOutput(selector, text, fallback = "") {
  const element = document.querySelector(`[data-out="${selector}"]`);
  if (element) element.textContent = text || fallback;
}

function updatePreview() {
  setOutput("name", value("name"), "Seu Nome Completo");
  setOutput("role", value("role"), "Sua área profissional");
  setOutput("objective", value("objective"), "Seu objetivo profissional aparecerá aqui.");
  setOutput("summary", value("summary"), "Apresente um breve resumo sobre você.");
  setOutput("education", value("education"), "Seu curso e instituição");
  setOutput("educationMeta", [value("educationDate"), value("educationStatus")].filter(Boolean).join(" · "));
  setOutput("jobLine", [value("job"), value("company")].filter(Boolean).join(" — ") || "Cargo · Empresa");
  setOutput("jobDate", value("jobDate"));
  setOutput("jobDescription", value("jobDescription"));
  setOutput("courses", value("courses"), "Seus cursos aparecerão aqui.");
  setOutput("skills", value("skills"), "Suas habilidades aparecerão aqui.");
  setOutput("languages", value("languages"));
  setOutput("projects", value("projects"));
  setOutput("additional", value("additional"));
  setOutput("linkedin", value("linkedin"));

  const contact = [value("email"), value("phone"), value("city")].filter(Boolean);
  document.getElementById("outContact").textContent = contact.join("  •  ") || "E-mail · Telefone · Cidade";

  const sectionFields = {
    "sec-objective": ["objective"],
    "sec-summary": ["summary"],
    "sec-education": ["education","educationDate","educationStatus"],
    "sec-experience": ["company","job","jobDate","jobDescription"],
    "sec-courses": ["courses"],
    "sec-skills": ["skills"],
    "sec-extra": ["languages","projects","additional","linkedin"]
  };
  Object.entries(sectionFields).forEach(([section, ids]) => {
    const hasContent = ids.some(id => value(id));
    document.getElementById(section).style.display = hasContent ? "block" : "none";
  });
}

fields.forEach(id => document.getElementById(id).addEventListener("input", updatePreview));

document.querySelectorAll(".model-card").forEach(card => {
  card.addEventListener("click", () => {
    document.querySelectorAll(".model-card").forEach(item => item.classList.remove("selected"));
    card.classList.add("selected");
    currentTemplate = card.dataset.template;
    preview.className = `resume ${templateClasses[currentTemplate]}`;
  });
});

document.getElementById("clearBtn").addEventListener("click", () => {
  if (!confirm("Tem certeza que deseja apagar todas as informações?")) return;
  form.reset();
  updatePreview();
});

document.getElementById("downloadBtn").addEventListener("click", () => {
  if (typeof html2pdf === "undefined") {
    alert("Não foi possível carregar a ferramenta de PDF. Verifique sua conexão com a internet e tente novamente.");
    return;
  }
  const name = value("name") || "curriculo";
  const options = {
    margin: [10, 10, 10, 10],
    filename: `curriculo-${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.pdf`,
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true, backgroundColor: "#ffffff" },
    jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    pagebreak: { mode: ["avoid-all", "css", "legacy"] }
  };
  html2pdf().set(options).from(preview).save();
});

updatePreview();
