import styled from '@emotion/styled';
import { Link } from '../../atoms/link/link';
import { headerListItem, headerUnorderedList } from './desktop-header.css';

export const AdminNav = () => {
  return (
    <ul className={headerUnorderedList}>
      <li className={headerListItem}>
        <Link path="/admin/customers">Customers</Link>
      </li>
      <li className={headerListItem}>
        <Link path="/admin/recipes">Recipes</Link>
      </li>
      <li className={headerListItem}>
        <Link path="/admin/planner">Planner</Link>
      </li>
      <li className={headerListItem}>
        <Link path="/admin/customisations">Customisations</Link>
      </li>
    </ul>
  );
};
