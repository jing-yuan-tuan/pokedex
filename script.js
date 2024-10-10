const pokedex = document.getElementById('pokedex');
const pokemonModal = document.getElementById('pokemonModal');
const pokemonDetails = document.getElementById('pokemonDetails');
const closeModal = document.getElementById('closeModal');
const searchInput = document.getElementById('searchInput');

let allPokemon = [];

const fetchPokemon = async () => {
    for (let i = 1; i <= 151; i++) {
        await getPokemon(i);
    }
};

const getPokemon = async (id) => {
    const url = `https://pokeapi.co/api/v2/pokemon/${id}`;
    const response = await fetch(url);
    const pokemon = await response.json();
    allPokemon.push(pokemon);
    displayPokemon(pokemon);
};

// Fetch Pokémon species for the flavor text
const getPokemonSpecies = async (id) => {
    const speciesUrl = `https://pokeapi.co/api/v2/pokemon-species/${id}`;
    const speciesResponse = await fetch(speciesUrl);
    const speciesData = await speciesResponse.json();
    return speciesData;
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

// Show details in the modal
const showDetails = async (pokemon) => {
    const speciesData = await getPokemonSpecies(pokemon.id);
    const description = speciesData.flavor_text_entries.find(entry => entry.language.name === 'en').flavor_text;

    const detailsHTML = `
        <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
        <h3>${capitalize(pokemon.name)} (#${pokemon.id})</h3>
        <p><strong>Height:</strong> ${(pokemon.height / 10).toFixed(1)} m</p>
        <p><strong>Weight:</strong> ${(pokemon.weight / 10).toFixed(1)} kg</p>
        <p><strong>Abilities:</strong> ${pokemon.abilities.map(ability => capitalize(ability.ability.name)).join(', ')}</p>
        <p><strong>Description:</strong> ${description}</p>
        <div class="pokemon-stats">
            <h4>Base Stats:</h4>
            <p><strong>HP:</strong> ${pokemon.stats[0].base_stat}</p>
            <p><strong>Attack:</strong> ${pokemon.stats[1].base_stat}</p>
            <p><strong>Defense:</strong> ${pokemon.stats[2].base_stat}</p>
            <p><strong>Special Attack:</strong> ${pokemon.stats[3].base_stat}</p>
            <p><strong>Special Defense:</strong> ${pokemon.stats[4].base_stat}</p>
            <p><strong>Speed:</strong> ${pokemon.stats[5].base_stat}</p>
        </div>
    `;
    
    pokemonDetails.innerHTML = detailsHTML;
    pokemonModal.style.display = 'block';
};

// Close modal
closeModal.addEventListener('click', () => {
    pokemonModal.style.display = 'none';
});

// Search functionality
searchInput.addEventListener('input', (e) => {
    const searchValue = e.target.value.toLowerCase();
    pokedex.innerHTML = '';

    const filteredPokemon = allPokemon.filter(pokemon => pokemon.name.toLowerCase().includes(searchValue));
    filteredPokemon.forEach(pokemon => displayPokemon(pokemon));
});

fetchPokemon();
