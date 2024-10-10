const pokedex = document.getElementById('pokedex');
const pokemonModal = document.getElementById('pokemonModal');
const pokemonDetails = document.getElementById('pokemonDetails');
const closeModal = document.getElementById('closeModal');

const fetchPokemon = async () => {
    for (let i = 1; i <= 151; i++) {
        await getPokemon(i);
    }
};

const getPokemon = async (id) => {
    const url = `https://pokeapi.co/api/v2/pokemon/${id}`;
    const response = await fetch(url);
    const pokemon = await response.json();
    displayPokemon(pokemon);
};

const displayPokemon = (pokemon) => {
    const pokemonCard = document.createElement('div');
    pokemonCard.classList.add('pokemon-card');
    pokemonCard.addEventListener('click', () => showDetails(pokemon));

    const pokemonImage = document.createElement('img');
    pokemonImage.src = pokemon.sprites.front_default;

    const pokemonName = document.createElement('h2');
    pokemonName.classList.add('pokemon-name');
    pokemonName.textContent = `${pokemon.id}. ${capitalize(pokemon.name)}`;

    const pokemonTypes = document.createElement('div');
    pokemonTypes.classList.add('pokemon-types');
    pokemon.types.forEach(type => {
        const typeSpan = document.createElement('span');
        typeSpan.classList.add('type');
        typeSpan.textContent = capitalize(type.type.name);
        pokemonTypes.appendChild(typeSpan);
    });

    pokemonCard.appendChild(pokemonImage);
    pokemonCard.appendChild(pokemonName);
    pokemonCard.appendChild(pokemonTypes);

    pokedex.appendChild(pokemonCard);
};

const capitalize = (word) => word.charAt(0).toUpperCase() + word.slice(1);

// Function to fetch additional details
const getPokemonDetails = async (id) => {
    const speciesUrl = `https://pokeapi.co/api/v2/pokemon-species/${id}/`;
    const speciesResponse = await fetch(speciesUrl);
    const speciesData = await speciesResponse.json();
    const description = speciesData.flavor_text_entries.find(entry => entry.language.name === 'en').flavor_text;
    return description;
};

// Show details in the modal
const showDetails = async (pokemon) => {
    const description = await getPokemonDetails(pokemon.id);
    
    const detailsHTML = `
        <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
        <h3>${capitalize(pokemon.name)} (#${pokemon.id})</h3>
        <p><strong>Height:</strong> ${pokemon.height} dm</p>
        <p><strong>Weight:</strong> ${pokemon.weight} hg</p>
        <p><strong>Abilities:</strong> ${pokemon.abilities.map(ability => capitalize(ability.ability.name)).join(', ')}</p>
        <p><strong>Description:</strong> ${description}</p>
        <div class="pokemon-stats">
            <div><strong>HP:</strong> ${pokemon.stats[0].base_stat}</div>
            <div><strong>Attack:</strong> ${pokemon.stats[1].base_stat}</div>
            <div><strong>Defense:</strong> ${pokemon.stats[2].base_stat}</div>
            <div><strong>Speed:</strong> ${pokemon.stats[5].base_stat}</div>
        </div>
    `;
    
    pokemonDetails.innerHTML = detailsHTML;
    pokemonModal.style.display = 'block';
};

// Close modal
closeModal.addEventListener('click', () => {
    pokemonModal.style.display = 'none';
});

// Close modal by clicking outside of the content
window.onclick = function(event) {
    if (event.target === pokemonModal) {
        pokemonModal.style.display = 'none';
    }
};

fetchPokemon();
