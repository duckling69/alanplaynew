import React,{useEffect,useState, useRef} from 'react'
import styled from 'styled-components'
import useAuth from "./useAuth"
import alanBtn from "@alan-ai/alan-sdk-web"
import SpotifyWebApi from "spotify-web-api-node"
import axios from 'axios';
import TrackSearchResult from './SearchResults';
import { Container, Form } from "react-bootstrap";
import { Dropdown } from 'bootstrap'
import Player from './player'

const Styles = styled.a`
#dashboard{
    background-image: conic-gradient(from 105.52deg at -25.49% 32.81%, #2F91D8 -23.28deg, #C75E71 12.54deg, #2F91D8 336.72deg, #C75E71 372.54deg);

}

`
const spotifyApi = new SpotifyWebApi({
  clientId: "8b945ef10ea24755b83ac50cede405a0",
})
const alanKey ='d9aebb67197355883ac1ff5c8634982e2e956eca572e1d8b807a3e2338fdd0dc/stage'



export default function DashBoard({code}) {
  const accessToken = useAuth(code)
  const [search, setSearch] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const [playingTrack, setPlayingTrack] = useState()
  const [lyrics, setLyrics] = useState("")

  function chooseTrack(track) {
    setPlayingTrack(track)
    setSearch("")
    setLyrics("")
  }
 

  useEffect(() => {
    
    if (!accessToken) return
    spotifyApi.setAccessToken(accessToken)
  }, [accessToken]);
  
  useEffect(()=>{
    alanBtn({
      key: alanKey,
      onCommand: ({command})=>{
        if(command==='play'){
          document.getElementById('button').click();
        }
        setSearch(command);
      }
    })
  },[])
  
  useEffect(() => {
    if (!playingTrack) return

    axios.get("http://localhost:3001/lyrics", {
        params: {
          track: playingTrack.title,
          artist: playingTrack.artist,
        },
      })
      .then(res => {
        setLyrics(res.data.lyrics)
      })
  }, [playingTrack])
  useEffect(() => {
    if (!search) return setSearchResults([])
    if (!accessToken) return

    let cancel = false
    spotifyApi.searchTracks(search).then(res => {
      if (cancel) return
      setSearchResults(
        res.body.tracks.items.map(track => {
          const smallestAlbumImage = track.album.images.reduce(
            (smallest, image) => {
              if (image.height < smallest.height) return image
              return smallest
            },
            track.album.images[0]
          )

          return {
            artist: track.artists[0].name,
            title: track.name,
            uri: track.uri,
            albumUrl: smallestAlbumImage.url,
          }
        })
      )
    })

    return () => (cancel = true)
  }, [search, accessToken])
  
  const [isOpen,setIsOpen]=useState(false);
  useEffect(()=>{

  },[])
   
  return (
    <Styles>
<div id='dashboard' className='bg-none max-w-[100vw] w-[100vw] h-[100vh]'>
      
      <Container className="d-flex flex-column py-2 w-[30vw] absolute left-[24.5vw] max-h-[70vh] mt-[50px]" style={{ height: "100vh" }}>
      
      <Form.Control
        type="search"
        placeholder="Search Songs/Artists"
        value={search }
        onChange={e => setSearch(e.target.value)}
        className='rounded-[50px]'
        onClick={()=>setIsOpen(prev=>!prev)}
      />
      
      <div  className={"flex-grow-1 z-2"+(isOpen? 'block':'hidden')} style={{ overflowY: "auto" }}>
        {searchResults.map(track => (
          <TrackSearchResult
            track={track}
            key={track.uri}
            chooseTrack={chooseTrack}
          />
        ))}
      </div>
      </Container>
      <div className='fixed bottom-5 left-[25vw] right-[25vw]  w-[50vw]'>
        <Player className='h-[50px]]' accessToken={accessToken} trackUri={playingTrack?.uri} />
  </div>
  <div style={{ whiteSpace: "pre" }} className='text-center shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] break-words rounded-[10px] z-0 relative top-[70px] h-[75vh] w-[33vw] left-[57vw] bg-white text-black overflow-auto'>
    <p ></p>
    {lyrics}
  </div>
  </div>
  
  </Styles>
  )

}
