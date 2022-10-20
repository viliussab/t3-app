import Link from "next/link";
import React from "react";
import {MdHome, MdMap} from "react-icons/md";
import {IconType} from "react-icons";

const sidebarLinks : Array<ItemProps> = [
  {
    name: "Home Page",
    href: "/",
    Icon: MdHome
  },
  {
    name: "Maps",
    href: "/maps",
    Icon: MdMap
  },
  {
    name: "Maps create",
    href: "/maps/create",
    Icon: MdMap
  }
];

const Sidebar = () => {
  return (
    <ul className="">
      {sidebarLinks.map(Item)}
    </ul>
  );
};

interface ItemProps {
    name: string;
    href: string;
    Icon: IconType;
}

const Item = (props: ItemProps) => {
  const {href, name, Icon} = props;

  return <Link href={href} key={href}>
    <li className="hover:bg-gray-200 rounded-2xl cursor-pointer flex flex-row-reverse text-lg items-center pl-2 pr-2">
      <div className="ml-2">
        <Icon />
      </div>
      <div className="">
        {name}
      </div>
    </li>
  </Link>
  ;
};

export default Sidebar;
