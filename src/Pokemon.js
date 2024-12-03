import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Grid,
  Container,
  Card,
  CardContent,
  CardMedia,
  Typography,
  CircularProgress,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
} from '@mui/material';

const Pokemon = () => {
  const [pokemonList, setPokemonList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPokemon, setSelectedPokemon] = useState(null); // Store selected Pokémon details
  const [detailsLoading, setDetailsLoading] = useState(false);

  useEffect(() => {
    const fetchPokemons = async () => {
      try {
        const response = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=40');
        const pokemonData = await Promise.all(
          response.data.results.map(async (pokemon) => {
            return {
              name: pokemon.name,
              url: pokemon.url,
              image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${
                pokemon.url.split('/')[pokemon.url.split('/').length - 2]
              }.png`,
            };
          })
        );
        setPokemonList(pokemonData);
      } catch (error) {
        console.error('Error fetching Pokémon data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPokemons();
  }, []);

  const handleDetails = async (url) => {
    try {
      setDetailsLoading(true);
      const response = await axios.get(url);
      const details = response.data;
      setSelectedPokemon({
        name: details.name,
        height: details.height,
        weight: details.weight,
        abilities: details.abilities.map((ability) => ability.ability.name).join(', '),
        types: details.types.map((type) => type.type.name).join(', '),
      });
    } catch (error) {
      console.error('Error fetching Pokémon details:', error);
    } finally {
      setDetailsLoading(false);
    }
  };

  const handleClose = () => {
    setSelectedPokemon(null);
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
        sx={{
          background: 'linear-gradient(135deg, #FFDDC1, #FFABAB)',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        background: 'linear-gradient(135deg, #FFDDC1, #FFABAB)',
        minHeight: '100vh',
        paddingTop: '20px',
      }}
    >
      <Container>
        <Grid container spacing={3}>
          {pokemonList.map((pokemon, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
              <Card
                sx={{
                  maxWidth: 300,
                  height: 350,
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  transition: 'transform 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'scale(1.05)',
                  },
                }}
              >
                <CardMedia
                  component="img"
                  sx={{
                    objectFit: 'contain',
                    height: '200px',
                    margin: 'auto',
                  }}
                  image={pokemon.image}
                  alt={pokemon.name}
                />
                <CardContent>
                  <Typography gutterBottom variant="h6" component="div">
                    {pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}
                  </Typography>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => handleDetails(pokemon.url)}
                  >
                    View Details
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Dialog for Pokémon details */}
      {selectedPokemon && (
        <Dialog open={!!selectedPokemon} onClose={handleClose}>
          <DialogTitle>{selectedPokemon.name.toUpperCase()}</DialogTitle>
          <DialogContent>
            {detailsLoading ? (
              <CircularProgress />
            ) : (
              <Box>
                <Typography variant="body1">
                  <strong>Height:</strong> {selectedPokemon.height}
                </Typography>
                <Typography variant="body1">
                  <strong>Weight:</strong> {selectedPokemon.weight}
                </Typography>
                <Typography variant="body1">
                  <strong>Abilities:</strong> {selectedPokemon.abilities}
                </Typography>
                <Typography variant="body1">
                  <strong>Types:</strong> {selectedPokemon.types}
                </Typography>
              </Box>
            )}
          </DialogContent>
        </Dialog>
      )}
    </Box>
  );
};

export default Pokemon;
