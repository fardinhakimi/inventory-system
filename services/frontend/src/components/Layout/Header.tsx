import styled, { css } from "styled-components";
import Link from "next/link";
import { useRouter } from "next/dist/client/router";
import { space } from "styled-system";

export const Header = () => {
  const router = useRouter();

  const isActive = (route: string) => router.pathname === route;

  const productsRoute = "/products";
  const inventoryRoute = "/inventory";
  const root = "/";

  const routes = [
    {
      route: root,
      name: "Import Data",
      isActive: router.pathname === root
    },
    {
      route: productsRoute,
      name: "Manage Products",
      isActive: isActive(productsRoute)
    },
    {
      route: inventoryRoute,
      name: "Manage Inventory",
      isActive: isActive(inventoryRoute)
    }
  ];

  return (
    <StyledHeader>
      <StyledNav>
        {routes.map((item, index) => {
          return (
            <StyledNavItem key={index} isActive={item.isActive}>
              <Link href={item.route}>
                <h4>{item.name}</h4>
              </Link>
            </StyledNavItem>
          );
        })}
      </StyledNav>
    </StyledHeader>
  );
};

const StyledHeader = styled.div`
  background-color: #ffff;
  ${space({ px: "20px" })};
  grid-area: header;
  display: grid;
  grid-template-columns: 1fr 1fr;
  border-bottom: solid 1px #ececec;
`;

const StyledNav = styled.ul`
  list-style: none;
  display: flex;
  justify-content: flex-start;
  ${space({ p: 0, m: 0 })};
`;

const activeMixin = css`
  color: teal;
  border-bottom-color: teal;
`;

const StyledNavItem = styled.li<{ isActive?: boolean }>`
  border-bottom: solid 2px transparent;
  &:hover {
    cursor: pointer;
    color: teal;
    border-bottom-color: teal;
  }
  ${space({ ml: "10px;" })};
  &:nth-of-type(1) {
    ${space({ ml: 0 })};
  }
  a {
    text-decoration: none;
    color: black;
  }
  ${({ isActive = false }) => isActive && activeMixin};
`;

export default Header;
