import styled from 'styled-components'
import Header from "./Header"
import Container from "./Container"
import Footer from "./Footer"

type Props = {
  children?: any
}

const Content = ({ children }: Props) => {
  return (
    <StyledContent>
      { children}
    </StyledContent>
  )
}
const Layout = ({ children }: Props) => {
  return (
    <StyledLayout>
      <Header />
      <Container>
        <Content>
          {children}
        </Content>
			</Container>
			<Footer/>
    </StyledLayout>
  )
}

const StyledLayout = styled.div`
  background-color: #eaeef7;
  display: grid;
  grid-template-columns: 100%;
  grid-template-rows: auto;
  grid-template-areas:
  "header"
  "content"
  "footer";
`

const StyledContent = styled.section`
	grid-area: content;
  min-height: calc(100vh - 130px);
`

export default Layout