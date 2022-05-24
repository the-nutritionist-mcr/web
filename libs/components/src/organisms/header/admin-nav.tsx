import styled from '@emotion/styled';
import { Link } from '../../atoms/link/link';

const HeaderListItem = styled('li')`
  list-style: none;
  margin: 0;
  white-space: nowrap;
  font-weight: 300;
`;

const HeaderUnorderedList = styled('ul')`
  display: flex;
  width: 100%;
  font-size: 16px;
  justify-content: center;
  gap: 1rem;
  margin: 0;
  height: 100%;
  align-items: center;
`;

export const AdminNav = () => {
  return (
    <HeaderUnorderedList>
      <HeaderListItem>
        <Link path="/admin/customers">Customers</Link>
      </HeaderListItem>
      <HeaderListItem>
        <Link path="/admin/recipes">Recipes</Link>
      </HeaderListItem>
      <HeaderListItem>
        <Link path="/admin/planner">Planner</Link>
      </HeaderListItem>
      <HeaderListItem>
        <Link path="/admin/customisations">Customisations</Link>
      </HeaderListItem>
    </HeaderUnorderedList>
  );
};
