/*
  COMO ADICIONAR PERSONAGENS:
  1. Coloque o desenho na pasta "assets".
  2. Adicione um novo objeto à lista abaixo, separando-o do anterior com uma vírgula.
  3. Use o nome exato do arquivo da imagem em "image".
  4. Campos sem informação podem ficar como "".
*/

const characters = [
  {
    id: "001",
    name: "Nome do personagem",
    image: "assets/personagem-001.jpg",
    status: "DOCUMENTADO",
    description: "Escreva aqui uma descrição curta do personagem.",
    age: "Não informado",
    role: "Não informado",
    personality: "Não informada",
    extra: "Adicione observações aqui, ou deixe este campo vazio.",
    imageAlt: "Desenho do personagem Nome do personagem"
  },
  {
    id: "002",
    name: "Segundo personagem",
    image: "assets/personagem-002.png",
    status: "EM ANÁLISE",
    description: "Este é outro exemplo. Troque o texto pelos dados reais.",
    age: "Não informado",
    role: "Não informado",
    personality: "Não informada",
    extra: "",
    imageAlt: "Desenho do personagem Segundo personagem"
  }
];

const listElement = document.querySelector("#characterList");
const searchInput = document.querySelector("#searchInput");
const resultCount = document.querySelector("#resultCount");
const emptyState = document.querySelector("#emptyState");
const detailView = document.querySelector("#detailView");
const backButton = document.querySelector("#backButton");
const homeLink = document.querySelector("#homeLink");

document.querySelector("#footerYear").textContent = new Date().getFullYear();

function escapeHTML(value = "") {
  return String(value).replace(/[&<>"']/g, character => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[character]);
}

function imageMarkup(character, className) {
  const image = escapeHTML(character.image || "");
  const alt = escapeHTML(character.imageAlt || `Desenho de ${character.name}`);
  if (!image) {
    return `<div class="${className} image-placeholder">IMAGEM<br>NÃO DISPONÍVEL</div>`;
  }
  return `<div class="${className}"><img class="${className === "card-image-wrap" ? "card-image" : "detail-image"}" src="${image}" alt="${alt}" loading="lazy" onerror="this.style.display='none'; this.parentElement.insertAdjacentHTML('beforeend','<div class=&quot;image-placeholder&quot;>IMAGEM<br>NÃO ENCONTRADA</div>')"></div>`;
}

function renderCharacters(query = "") {
  const normalizedQuery = query.trim().toLocaleLowerCase("pt-BR");
  const filtered = characters.filter(character => {
    const searchable = [
      character.id, character.name, character.status,
      character.description, character.age, character.role,
      character.personality, character.extra
    ].join(" ").toLocaleLowerCase("pt-BR");
    return searchable.includes(normalizedQuery);
  });

  listElement.innerHTML = filtered.map(character => `
    <button class="character-card" type="button" data-character-id="${escapeHTML(character.id)}">
      ${imageMarkup(character, "card-image-wrap")}
      <span class="card-content">
        <span class="card-code">REGISTRO Nº ${escapeHTML(character.id)}</span>
        <span class="card-name">${escapeHTML(character.name)}</span>
        <span class="card-description">${escapeHTML(character.description)}</span>
        <span class="card-bottom">
          <span class="status-label">${escapeHTML(character.status)}</span>
          <span class="card-open">Abrir registro →</span>
        </span>
      </span>
    </button>
  `).join("");

  resultCount.textContent = `${filtered.length} ${filtered.length === 1 ? "registro" : "registros"}`;
  emptyState.hidden = filtered.length > 0;
  listElement.hidden = filtered.length === 0;
}

function showDetails(id) {
  const character = characters.find(item => item.id === id);
  if (!character) return;

  listElement.hidden = true;
  document.querySelector(".intro").hidden = true;
  document.querySelector(".toolbar").hidden = true;
  emptyState.hidden = true;
  detailView.hidden = false;

  const detailImage = document.querySelector("#detailImage");
  detailImage.src = character.image || "";
  detailImage.alt = character.imageAlt || `Desenho de ${character.name}`;
  detailImage.hidden = !character.image;
  detailImage.onerror = () => {
    detailImage.hidden = true;
    document.querySelector("#detailImageCaption").textContent = "Imagem não encontrada. Confira o nome do arquivo em script.js e a pasta assets.";
  };

  document.querySelector("#detailImageCaption").textContent = character.image ? `ARQUIVO VISUAL · ${character.image.split("/").pop()}` : "Nenhuma imagem cadastrada.";
  document.querySelector("#detailCode").textContent = `REGISTRO Nº ${character.id}`;
  document.querySelector("#detailName").textContent = character.name;
  document.querySelector("#detailStatus").textContent = character.status;
  document.querySelector("#detailDescription").textContent = character.description || "Nenhuma descrição disponível.";

  const facts = [
    ["Idade", character.age],
    ["Função", character.role],
    ["Personalidade", character.personality]
  ].filter(([, value]) => value && value.trim() !== "");

  document.querySelector("#detailFacts").innerHTML = facts.map(([label, value]) => `
    <div class="fact-row">
      <dt>${escapeHTML(label)}</dt>
      <dd>${escapeHTML(value)}</dd>
    </div>
  `).join("");

  const extraWrap = document.querySelector("#detailExtraWrap");
  extraWrap.hidden = !character.extra || !character.extra.trim();
  document.querySelector("#detailExtra").textContent = character.extra || "";
  history.replaceState(null, "", `#personagem-${encodeURIComponent(character.id)}`);
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function showList() {
  detailView.hidden = true;
  listElement.hidden = false;
  document.querySelector(".intro").hidden = false;
  document.querySelector(".toolbar").hidden = false;
  renderCharacters(searchInput.value);
  history.replaceState(null, "", window.location.pathname + window.location.search);
  window.scrollTo({ top: 0, behavior: "smooth" });
}

listElement.addEventListener("click", event => {
  const button = event.target.closest("[data-character-id]");
  if (button) showDetails(button.dataset.characterId);
});

searchInput.addEventListener("input", () => renderCharacters(searchInput.value));
backButton.addEventListener("click", showList);
homeLink.addEventListener("click", event => {
  event.preventDefault();
  showList();
});

renderCharacters();
