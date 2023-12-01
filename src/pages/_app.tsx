import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { createGlobalStyle } from 'styled-components'

const GlobalStyle = createGlobalStyle`
html,
body,
textarea {
  padding: 0;
  margin: 0;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, 'Open Sans', 'Helvetica Neue', sans-serif, 
}

* {
  box-sizing: border-box;
}


a {
  cursor: pointer;
  text-decoration: none;
  transition: .25s;
  color: #000
}

ol, ul {
  list-style: none;
}
`;


export default function App({ Component, pageProps }: AppProps) {
  return 
    <>
      <GlobalStyle />
      <Component {...pageProps} />
    </>
}
