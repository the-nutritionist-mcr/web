import { Button } from "grommet";
import React from "react";
import UserContext from "../../lib/UserContext";
import { useHistory } from "react-router-dom";

interface MenuLinkProps {
  to?: string;
  groups: string[];
  onClick?: () => void;
  icon?: JSX.Element;
}

const MenuButton: React.FC<MenuLinkProps> = (props) => {
  const history = useHistory();

  const user = React.useContext(UserContext);
  const userGroups = user?.groups ? user.groups : ["anonymous"];

  const onClick = (): void => {
    if (props.to) {
      history.push(props.to);
    }

    props.onClick?.();
  };

  // eslint-disable-next-line sonarjs/prefer-immediate-return
  const returnVal = props.groups.some((group) => userGroups.includes(group)) ? (
    <Button
      plain={true}
      onClick={onClick}
      hoverIndicator
      icon={props.icon}
      label={props.children}
    />
  ) : null;

  return returnVal;
};

export default MenuButton;
