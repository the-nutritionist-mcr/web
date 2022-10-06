import { Link } from '../../atoms/link/link';
import {
  adminNavLink,
  headerListItem,
  headerUnorderedList,
} from './admin-nav.css';

export const AdminNav = () => {
  return (
    <ul className={headerUnorderedList}>
      <li className={headerListItem}>
        <Link className={adminNavLink} path="/admin/customers">
          Customers
        </Link>
      </li>
      <li className={headerListItem}>
        <Link className={adminNavLink} path="/admin/recipes">
          Recipes
        </Link>
      </li>
      <li className={headerListItem}>
        <Link className={adminNavLink} path="/admin/planner">
          Planner
        </Link>
      </li>
      <li className={headerListItem}>
        <Link className={adminNavLink} path="/admin/customisations">
          Customisations
        </Link>
      </li>
    </ul>
  );
};
