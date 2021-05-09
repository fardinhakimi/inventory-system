import Loader, { LoaderProps } from "react-loader-spinner"
import styled from 'styled-components'
import { space } from '@styled-system/space'

const CustomLoader = ({ type }: LoaderProps) => {
  return (
    <StyledLoader>
      <Loader type={type} color="#008080" height={50} width={50} />
    </StyledLoader>
  )
}

const StyledLoader = styled.div`
 margin: 0 auto;
 text-align: center;
 ${space({ py: 4 })};
`

export default CustomLoader
