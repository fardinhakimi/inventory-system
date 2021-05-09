import styled from 'styled-components'
import { space } from '@styled-system/space'

const StyledContainer = styled.div`${space({ px: '20px' })};`

const Container = ({ children }: { children?: any }) => {
  return (
      <StyledContainer>
        {children}
      </StyledContainer>
  )
}

export default Container