import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

const posts = [
  {id: 1, title: 'One'},
  {id: 2, title: 'TWo'},
]

function App() {
  const queryClient = useQueryClient();
  
  const pokemonQuery = useQuery({
    queryKey: ['posts'],
    //refetchInterval: 1000, //automatically refreshes in 1 sec
    queryFn: async () => {
      const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0')
      return response.json();
    },
  });

  const digimonQuery = useQuery({
    queryKey: ['digimons'],
    queryFn: async () => {
      const response = await fetch('https://www.digi-api.com/api/v1/digimon?page=0')
      return response.json()
    },
    cacheTime: 1000 * 30 ,
  })

  const newPostMutation = useMutation({
    mutationFn: (title) => {
      return wait(1000).then(() => posts.push({id: crypto.randomUUID(), title}))
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['posts'])
    }
  })

  if(pokemonQuery.isLoading || digimonQuery.isLoading) {
    return <h1>Loading...</h1>
  }

  if(pokemonQuery.error){
    return <pre>Error: {JSON.stringify(pokemonQuery.error)}</pre>
  }

  return (
    <div>
      {
        pokemonQuery.data.results.map(pokemon => (
          <div key={pokemon.name}>{pokemon.name}</div>
        ))
      }
      {digimonQuery.data.content.map(digimon => (
        <div key={digimon.name}>{digimon.name}</div>
      ))}
      {/* <button onClick={() => newPostMutation.mutate("new post")}>Add new</button> */}
    </div>
  )
}

function wait(duration){
  return new Promise(resolve => setTimeout(resolve, duration))
}

export default App
