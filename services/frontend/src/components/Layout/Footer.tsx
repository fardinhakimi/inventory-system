import styled from 'styled-components'
import { space } from '@styled-system/space'

const Footer = () => {
  const currentYear = () => (new Date()).getFullYear()
  return (
    <StyledFooter>
      <h3> Inventory System &#169; {currentYear()} NoOne</h3>
    </StyledFooter>
  )
}

const StyledFooter = styled.footer`
  background-color: #ffff;
  grid-area: footer;
  height: 30px;
  border-top: solid 1px #ececec;
  ${space({ px: '20px'})};
`

export default Footer