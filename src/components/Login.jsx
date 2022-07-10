import React,{useEffect} from 'react'
import {FaSpotify} from 'react-icons/fa';
import alanBtn from "@alan-ai/alan-sdk-web";
import styled from 'styled-components';

const AUTH_URL ="https://accounts.spotify.com/authorize?client_id=5cab7e32768645939367333788c97773&response_type=code&redirect_uri=http://localhost:3000&scope=streaming%20user-read-email%20user-read-private%20user-library-read%20user-library-modify%20user-read-playback-state%20user-modify-playback-state"

const alanKey='e5266a8cbddbf44a3ac1ff5c8634982e2e956eca572e1d8b807a3e2338fdd0dc/stage';

const Styles = styled.a`
#loginpage{
  height: 100vh;
  width: 100vw;
  background-image:  linear-gradient(180deg, rgba(217, 217, 217, 0) 0%, #1D1D1D 78.53%),url("https://townsquare.media/site/295/files/2021/01/1981-movies.jpg");
  
}

`
function Login() {
  useEffect(()=>{
    alanBtn({
      key: alanKey,
      onCommand: ({command})=>{
        if(command==='testCommand'){
          window.open(AUTH_URL,"_self");
        }
      }
    })
  },[])
  return (
    <Styles>
    <div id='loginpage' >
        <a href={AUTH_URL} className=' rounded-[50px] bg-[#57B65F] w-[220px] h-[70px]  bottom-[50px] fixed align-middle pb-[2px] justify-center items-center mx-[40vw] flex px-[20px] gap-[30px]'>
            <FaSpotify className='text-white text-[50px] '/>
            <p className='text-white align-center text-center leading-6 ' href='#'> Log in with <span className='text-[30px] font-semibold'>Spotify</span></p>
        </a>
    </div>
    </Styles>
  )
}

export default Login