import type { AppProps } from 'next/app'
import { ThemeProvider } from 'styled-components'
import GlobalStyle from '@/styles/GlobalStyle'
import theme from '@/styles/theme'
import { WorkflowProvider } from '@/context/WorkflowContext'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={theme}>
      <WorkflowProvider>
        <GlobalStyle />
        <Component {...pageProps} />
      </WorkflowProvider>
    </ThemeProvider>
  )
}