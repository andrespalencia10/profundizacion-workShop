import { getData } from "./helper/getData.js";

let listPokemons = [];
const containerCards = document.getElementById("containerCards");
const URL_API = "https://pokeapi.co/api/v2/pokemon";

const getPokemons = async (url, searchTerm = "") => {
  listPokemons = [];
  const response = await axios.get(url);
  const pokemons = searchTerm
    ? response.data.results.filter((pokemon) =>
        pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : response.data.results;
  console.log(pokemons);
  pokemons.forEach(async (pokemom, index) => {
    const dataPokemon = await axios.get(pokemom.url);
    const newPokemon = {
      name: pokemom.name,
      image: dataPokemon.data.sprites.front_default,
      weight: dataPokemon.data.weight,
      height: dataPokemon.data.height,
      experience: dataPokemon.data.base_experience,
      abilities: dataPokemon.data.abilities,
      id: dataPokemon.data.id,
      icon: dataPokemon.data.sprites.versions["generation-vii"].icons
        .front_default,
      tipo: dataPokemon.data.types,
    };
    listPokemons.push(newPokemon);
    if (index + 1 === pokemons.length) {
      console.log(listPokemons);
      renderPokemons(listPokemons);
    }
  });
};

getPokemons(URL_API);

const renderPokemons = (arrayPokemons) => {
  containerCards.innerHTML = "";
  arrayPokemons.forEach((pokemom) => {
    containerCards.innerHTML += `
        <section class="card">
            <p class="card__title">${pokemom.name}</p>
            <figure id="${pokemom.id}">
                <img id="${pokemom.id}" src="${
      pokemom.image
    }" alt="Ditto" class="card__image">
            </figure>
            <!-- <p class="card__info">Peso: ${pokemom.weight}</p>
            <p class="card__info">Altura: ${pokemom.height}</p>
            <p class="card__info">Experiencia: ${pokemom.experience}</p>
            <p class="card__info">Habilidades:
            ${renderAbilities(pokemom.abilities)}
            </p> -->
        </section>
        `;
  });
};

const renderAbilities = (arrayAbilities) => {
  let abilitiesList = "";
  arrayAbilities.forEach((ability) => {
    abilitiesList += `
        <span class="card__abilities">${ability.ability.name}</span>
        `;
  });
  return abilitiesList;
};

const renderType = (arrayTipes) => {
  let TipesList = "";
  arrayTipes.forEach((tipo) => {
    TipesList += `
        <span class="card__abilities">${tipo.type.name}</span>
        `;
  });
  return TipesList;
};

const search = document.querySelector(".form__search");

search.addEventListener("submit", async (event) => {
  event.preventDefault();
  const inputSearch = document.getElementById("inputSearch");
  const searchTerm = inputSearch.value;
  if (searchTerm) {
    getPokemons(URL_API, searchTerm);
  }
});

const renderInfo = (infoArrays) => {
  const num = document.querySelector(".num");
  const icon = document.querySelector(".icon");
  const pokemonName = document.querySelector(".pokemonName");
  const pokemonImg = document.querySelector(".pokemonImg");
  const level = document.querySelector(".level");
  const type = document.querySelector(".type");
  const hability = document.querySelector(".hability");
  const height = document.querySelector(".height");
  const weight = document.querySelector(".weight");

  infoArrays.forEach((infoArray) => {
    num.textContent = infoArray.id;
    icon.src = infoArray.icon;
    pokemonName.textContent = infoArray.name;
    pokemonImg.src = infoArray.image;
    level.textContent = infoArray.experience;
    type.innerHTML = renderType(infoArray.tipo);
    hability.innerHTML = renderAbilities(infoArray.abilities);
    height.textContent = infoArray.height;
    weight.textContent = infoArray.weight;
  });

  console.log(infoArrays);
};

containerCards.addEventListener("click", (e) => {
  if (e.target.localName == "figure" || e.target.localName == "img") {
    console.log(e.target.id);

    let arrayFilter = listPokemons.filter(
      (pokemon) => pokemon.id == e.target.id
    );
    renderInfo(arrayFilter);
  }
});
